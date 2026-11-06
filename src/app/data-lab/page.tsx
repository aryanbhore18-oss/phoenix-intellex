'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Table,
  BarChart3,
  Sparkles,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

interface ColumnStats {
  name: string;
  type: 'numeric' | 'string' | 'date' | 'boolean';
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  // Numeric specifics
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  stdDev?: number;
  // Categorical frequency top 3
  topFrequencies?: { value: string; count: number }[];
}

export default function DataLabPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [originalData, setOriginalData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [columnStats, setColumnStats] = useState<ColumnStats[]>([]);
  const [duplicateCount, setDuplicateCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'statistics' | 'clean'>('preview');

  // Preview Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute Data Statistics
  const computeStatistics = (rows: Record<string, unknown>[], cols: string[]) => {
    // 1. Duplicate row detection
    const rowStrings = rows.map((r) => JSON.stringify(r));
    const uniqueRowSet = new Set(rowStrings);
    const duplicates = rows.length - uniqueRowSet.size;
    setDuplicateCount(duplicates);

    // 2. Column-wise statistics
    const stats: ColumnStats[] = cols.map((col) => {
      const values = rows.map((r) => r[col]);
      const validValues = values.filter(
        (v) => v !== null && v !== undefined && v !== '' && String(v).trim() !== ''
      );
      const missingCount = rows.length - validValues.length;
      const missingPercentage = Number(((missingCount / (rows.length || 1)) * 100).toFixed(1));
      const uniqueCount = new Set(validValues.map(String)).size;

      // Type detection: check if all valid values are numeric
      const numericValues = validValues
        .map((v) => Number(v))
        .filter((n) => !isNaN(n));
      const isNumeric = validValues.length > 0 && numericValues.length === validValues.length;

      if (isNumeric) {
        numericValues.sort((a, b) => a - b);
        const count = numericValues.length;
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const mean = Number((sum / count).toFixed(2));
        const median =
          count % 2 === 0
            ? Number(((numericValues[count / 2 - 1] + numericValues[count / 2]) / 2).toFixed(2))
            : numericValues[Math.floor(count / 2)];
        const min = numericValues[0];
        const max = numericValues[count - 1];

        // Standard Deviation
        const variance =
          numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const stdDev = Number(Math.sqrt(variance).toFixed(2));

        return {
          name: col,
          type: 'numeric',
          missingCount,
          missingPercentage,
          uniqueCount,
          mean,
          median,
          min,
          max,
          stdDev,
        };
      }

      // Categorical frequency top 3
      const freqMap: Record<string, number> = {};
      validValues.forEach((v) => {
        const str = String(v);
        freqMap[str] = (freqMap[str] || 0) + 1;
      });
      const topFrequencies = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([val, cnt]) => ({ value: val, count: cnt }));

      return {
        name: col,
        type: 'string',
        missingCount,
        missingPercentage,
        uniqueCount,
        topFrequencies,
      };
    });

    setColumnStats(stats);
  };

  // Handle File Upload (CSV, XLSX, XLS)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('File exceeds 15MB size limit. Please upload a manageable dataset.');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    setLoading(true);

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const buffer = evt.target?.result;
          const workbook = XLSX.read(buffer, { type: 'binary' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

          if (parsed.length === 0) {
            setError('The selected worksheet contains no data rows.');
            setLoading(false);
            return;
          }

          const cols = Object.keys(parsed[0] || {});
          setData(parsed);
          setOriginalData(parsed);
          setColumns(cols);
          computeStatistics(parsed, cols);
          setCurrentPage(1);
          setLoading(false);
        } catch {
          setError('Failed to parse Excel file. Please ensure it is a valid spreadsheet.');
          setLoading(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      // CSV Parsing
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            setError('The selected CSV file contains no data rows.');
            setLoading(false);
            return;
          }

          const parsed = results.data as Record<string, unknown>[];
          const cols = results.meta.fields || Object.keys(parsed[0] || {});
          setData(parsed);
          setOriginalData(parsed);
          setColumns(cols);
          computeStatistics(parsed, cols);
          setCurrentPage(1);
          setLoading(false);
        },
        error: (err) => {
          setError(`CSV parsing error: ${err.message}`);
          setLoading(false);
        },
      });
    }
  };

  // Cleaning Actions (Previewable)
  const removeDuplicates = () => {
    const seen = new Set();
    const cleaned = data.filter((row) => {
      const serialized = JSON.stringify(row);
      if (seen.has(serialized)) return false;
      seen.add(serialized);
      return true;
    });
    setData(cleaned);
    computeStatistics(cleaned, columns);
  };

  const removeEmptyRows = () => {
    const cleaned = data.filter((row) => {
      return Object.values(row).some(
        (val) => val !== null && val !== undefined && String(val).trim() !== ''
      );
    });
    setData(cleaned);
    computeStatistics(cleaned, columns);
  };

  const trimWhitespace = () => {
    const cleaned = data.map((row) => {
      const newRow: Record<string, unknown> = {};
      Object.keys(row).forEach((k) => {
        const val = row[k];
        newRow[k] = typeof val === 'string' ? val.trim() : val;
      });
      return newRow;
    });
    setData(cleaned);
    computeStatistics(cleaned, columns);
  };

  const resetToOriginal = () => {
    setData(originalData);
    computeStatistics(originalData, columns);
  };

  // Export Cleaned CSV
  const exportCleanedCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned_${fileName || 'dataset.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculation
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedRows = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Data Lab — Analytics Workspace</h1>
          <p className="text-xs text-[#758078]">
            In-browser CSV/Excel data science engine: profiling, descriptive statistics & non-destructive cleaning.
          </p>
        </div>
        {data.length > 0 && (
          <button
            onClick={exportCleanedCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#B89B5E]" />
            Download Cleaned CSV
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      <div className="bg-[#FAF7F0] border-2 border-dashed border-[#E3DED2] rounded-2xl p-6 text-center hover:border-[#164A3A]/40 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#164A3A]/10 text-[#164A3A] flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-bold text-[#164A3A]">
            {fileName ? fileName : 'Upload Dataset (CSV or Excel)'}
          </h3>
          <p className="text-xs text-[#758078] mt-1 max-w-sm">
            {fileName
              ? `File size: ${fileSize} • ${data.length} rows • ${columns.length} columns loaded`
              : 'Drag & drop or browse your CSV or XLSX file to begin automated profiling and cleaning.'}
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-white border border-[#E3DED2] hover:bg-[#F4EFE4] text-xs font-semibold text-[#164A3A] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#B89B5E]" />
            {fileName ? 'Choose Another File' : 'Browse File'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#c83232]/10 border border-[#c83232]/20 text-xs text-[#c83232] inline-flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Workspace Area when data is loaded */}
      {data.length > 0 && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2]">
              <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Rows</div>
              <div className="text-xl font-bold text-[#164A3A]">{data.length}</div>
            </div>
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2]">
              <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Columns</div>
              <div className="text-xl font-bold text-[#164A3A]">{columns.length}</div>
            </div>
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2]">
              <div className="text-[11px] font-semibold text-[#758078] uppercase">Duplicate Rows</div>
              <div className={`text-xl font-bold ${duplicateCount > 0 ? 'text-[#c83232]' : 'text-[#1b8755]'}`}>
                {duplicateCount}
              </div>
            </div>
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2]">
              <div className="text-[11px] font-semibold text-[#758078] uppercase">Cleaning State</div>
              <div className="text-xs font-bold text-[#25342D] mt-1">
                {data.length !== originalData.length ? `${originalData.length - data.length} rows altered` : 'Original Dataset'}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E3DED2]">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
                  : 'text-[#758078] hover:text-[#25342D]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Dataset Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'statistics'
                  ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
                  : 'text-[#758078] hover:text-[#25342D]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Descriptive Statistics</span>
            </button>

            <button
              onClick={() => setActiveTab('clean')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'clean'
                  ? 'bg-[#FAF7F0] text-[#164A3A] border-t-2 border-x border-[#E3DED2] border-t-[#164A3A]'
                  : 'text-[#758078] hover:text-[#25342D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cleaning Sandbox</span>
            </button>
          </div>

          {/* Tab 1: Dataset Preview Table */}
          {activeTab === 'preview' && (
            <div className="bg-[#FAF7F0] rounded-xl border border-[#E3DED2] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFE4]/60 border-b border-[#E3DED2] text-[#758078] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-12">#</th>
                      {columns.map((col) => (
                        <th key={col} className="py-3 px-4">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED2]/70 text-[#25342D]">
                    {paginatedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F4EFE4]/40 transition-colors">
                        <td className="py-3 px-4 text-[#758078] font-mono text-[11px]">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        {columns.map((col) => {
                          const val = row[col];
                          return (
                            <td key={col} className="py-3 px-4 max-w-xs truncate">
                              {val === null || val === undefined || String(val).trim() === '' ? (
                                <span className="text-[#c83232] italic text-[10px]">null</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div className="px-4 py-3 border-t border-[#E3DED2] flex items-center justify-between text-xs text-[#758078]">
                <span>
                  Page {currentPage} of {totalPages} ({data.length} records)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-white border border-[#E3DED2] text-xs font-medium disabled:opacity-40 hover:bg-[#F4EFE4]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded bg-white border border-[#E3DED2] text-xs font-medium disabled:opacity-40 hover:bg-[#F4EFE4]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Descriptive Statistics Table */}
          {activeTab === 'statistics' && (
            <div className="bg-[#FAF7F0] rounded-xl border border-[#E3DED2] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFE4]/60 border-b border-[#E3DED2] text-[#758078] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Column</th>
                      <th className="py-3 px-4">Detected Type</th>
                      <th className="py-3 px-4">Missing / Nulls</th>
                      <th className="py-3 px-4">Unique Values</th>
                      <th className="py-3 px-4 text-right">Mean</th>
                      <th className="py-3 px-4 text-right">Median</th>
                      <th className="py-3 px-4 text-right">Min / Max</th>
                      <th className="py-3 px-4 text-right">Std Dev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED2]/70 text-[#25342D]">
                    {columnStats.map((stat) => (
                      <tr key={stat.name} className="hover:bg-[#F4EFE4]/40">
                        <td className="py-3.5 px-4 font-bold text-[#164A3A]">{stat.name}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              stat.type === 'numeric'
                                ? 'bg-[#164A3A]/10 text-[#164A3A]'
                                : 'bg-[#B89B5E]/20 text-[#8E743A]'
                            }`}
                          >
                            {stat.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={stat.missingCount > 0 ? 'text-[#c83232] font-semibold' : 'text-[#1b8755]'}
                          >
                            {stat.missingCount} ({stat.missingPercentage}%)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#758078]">{stat.uniqueCount}</td>
                        <td className="py-3.5 px-4 text-right font-medium">
                          {stat.mean !== undefined ? stat.mean : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium">
                          {stat.median !== undefined ? stat.median : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#758078]">
                          {stat.min !== undefined && stat.max !== undefined
                            ? `${stat.min} / ${stat.max}`
                            : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                          {stat.stdDev !== undefined ? stat.stdDev : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Cleaning Operations Sandbox */}
          {activeTab === 'clean' && (
            <div className="bg-[#FAF7F0] p-6 rounded-xl border border-[#E3DED2] shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#164A3A]">Non-Destructive Cleaning Operations</h3>
                <p className="text-xs text-[#758078] mt-0.5">
                  Execute selective data scrubbing steps. You can preview all changes or restore the original file at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E3DED2] space-y-3">
                  <h4 className="text-xs font-bold text-[#164A3A]">Drop Duplicate Rows</h4>
                  <p className="text-[11px] text-[#758078] leading-relaxed">
                    Identifies identical serialized rows and keeps only the first occurrence.
                  </p>
                  <button
                    disabled={duplicateCount === 0}
                    onClick={removeDuplicates}
                    className="w-full py-2 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 transition-colors"
                  >
                    Remove {duplicateCount} Duplicates
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E3DED2] space-y-3">
                  <h4 className="text-xs font-bold text-[#164A3A]">Drop Entirely Empty Rows</h4>
                  <p className="text-[11px] text-[#758078] leading-relaxed">
                    Filters out blank rows containing no meaningful cell values across all columns.
                  </p>
                  <button
                    onClick={removeEmptyRows}
                    className="w-full py-2 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Drop Empty Rows
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E3DED2] space-y-3">
                  <h4 className="text-xs font-bold text-[#164A3A]">Trim String Whitespace</h4>
                  <p className="text-[11px] text-[#758078] leading-relaxed">
                    Strips leading and trailing spaces from all text/categorical column entries.
                  </p>
                  <button
                    onClick={trimWhitespace}
                    className="w-full py-2 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Trim String Whitespace
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3DED2] flex items-center justify-between">
                <button
                  onClick={resetToOriginal}
                  className="px-4 py-2 bg-white border border-[#E3DED2] hover:bg-[#F4EFE4] text-xs font-medium text-[#c83232] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Original Dataset
                </button>

                <button
                  onClick={exportCleanedCSV}
                  className="px-4 py-2 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#B89B5E]" />
                  Download Cleaned CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
