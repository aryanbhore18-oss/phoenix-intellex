'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { ReviewModal } from '@/components/reviews/review-modal';
import {
  Star,
  Plus,
  Search,
  Filter,
  Building2,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react';

export default function ReviewsPage() {
  const { reviews, clients, addReview } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      (r.client_name && r.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.review_text && r.review_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;
    const matchesSentiment = sentimentFilter === 'all' || r.sentiment_label === sentimentFilter;

    return matchesSearch && matchesRating && matchesSentiment;
  });

  // Calculate real metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const positiveCount = reviews.filter((r) => r.sentiment_label === 'Positive').length;
  const positiveRate = totalReviews > 0 ? ((positiveCount / totalReviews) * 100).toFixed(0) : 0;
  const negativeCount = reviews.filter((r) => r.sentiment_label === 'Negative').length;

  // Recurring keyword themes from actual text
  const extractRecurringThemes = () => {
    const stopWords = new Set([
      'the', 'and', 'was', 'to', 'in', 'for', 'with', 'a', 'of', 'at', 'is', 'it', 'on', 'this', 'that', 'were',
    ]);
    const wordsCount: Record<string, number> = {};

    reviews.forEach((r) => {
      if (!r.review_text) return;
      const clean = r.review_text.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const words = clean.split(/\s+/);
      words.forEach((w) => {
        if (w.length > 3 && !stopWords.has(w)) {
          wordsCount[w] = (wordsCount[w] || 0) + 1;
        }
      });
    });

    return Object.entries(wordsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  };

  const topThemes = extractRecurringThemes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#164A3A]">Smart Review Analytics</h1>
          <p className="text-xs text-[#758078]">
            Customer voice aggregation, sentiment detection, and service rating benchmarks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#B89B5E]" />
          Record Review
        </button>
      </div>

      {/* 4 Review KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Average Rating</div>
            <div className="text-2xl font-bold text-[#B89B5E] flex items-baseline gap-1">
              {avgRating} <span className="text-xs font-normal text-[#758078]">/ 5.0</span>
            </div>
            <div className="text-[10px] text-[#758078] mt-0.5">Based on {totalReviews} reviews</div>
          </div>
          <Star className="w-6 h-6 text-[#B89B5E] fill-[#B89B5E]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Total Feedback</div>
            <div className="text-2xl font-bold text-[#164A3A]">{totalReviews}</div>
            <div className="text-[10px] text-[#758078] mt-0.5">Across {clients.length} business accounts</div>
          </div>
          <MessageSquare className="w-6 h-6 text-[#164A3A]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Positive Sentiment</div>
            <div className="text-2xl font-bold text-[#1b8755]">{positiveRate}%</div>
            <div className="text-[10px] text-[#1b8755] mt-0.5">{positiveCount} favorable reviews</div>
          </div>
          <ThumbsUp className="w-6 h-6 text-[#1b8755]" />
        </div>

        <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#758078] uppercase">Negative Alerts</div>
            <div className="text-2xl font-bold text-[#c83232]">{negativeCount}</div>
            <div className="text-[10px] text-[#c83232] mt-0.5">Requires operational review</div>
          </div>
          <ThumbsDown className="w-6 h-6 text-[#c83232]" />
        </div>
      </div>

      {/* Recurring Feedback Topics / Words */}
      <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-xl border border-[#E3DED2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B89B5E]" />
            <h3 className="text-xs font-bold text-[#164A3A] uppercase tracking-wider">
              Recurring Customer Topics
            </h3>
          </div>
          <p className="text-[11px] text-[#758078] mt-0.5">
            Most frequent non-trivial terms detected in live customer feedback records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {topThemes.length === 0 ? (
            <span className="text-xs text-[#758078]">No text records to extract themes from yet.</span>
          ) : (
            topThemes.map(([word, count]) => (
              <span
                key={word}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#E3DED2] text-xs font-medium text-[#25342D] flex items-center gap-1.5"
              >
                <span>#{word}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#164A3A]/10 text-[#164A3A] font-bold">
                  {count}
                </span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E3DED2] flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews, business, comments..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#758078]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter:</span>
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-[#E3DED2] text-[#25342D] focus:outline-none focus:ring-1 focus:ring-[#164A3A]"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-2 bg-[#FAF7F0] p-8 rounded-xl border border-[#E3DED2] text-center text-xs text-[#758078]">
            No customer reviews match the active criteria.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F0] p-5 rounded-xl border border-[#E3DED2] shadow-xs flex flex-col justify-between gap-3 hover:border-[#164A3A]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'fill-[#B89B5E] text-[#B89B5E]' : 'text-[#E3DED2]'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#164A3A] ml-1">{rev.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-[#758078]">{formatDate(rev.review_date)}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-[#758078]" />
                  <span className="text-xs font-semibold text-[#164A3A]">{rev.client_name}</span>
                  <span className="text-[10px] text-[#758078]">• {rev.source}</span>
                </div>

                {rev.review_text && (
                  <p className="text-xs text-[#25342D] italic leading-relaxed bg-white p-3 rounded-lg border border-[#E3DED2]/80">
                    "{rev.review_text}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E3DED2]/60">
                <span className="text-[10px] text-[#758078]">Method: Lexicon & Star Score</span>
                {rev.sentiment_label && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      rev.sentiment_label === 'Positive'
                        ? 'bg-[#1b8755]/15 text-[#1b8755]'
                        : rev.sentiment_label === 'Negative'
                        ? 'bg-[#c83232]/15 text-[#c83232]'
                        : 'bg-[#758078]/15 text-[#758078]'
                    }`}
                  >
                    Sentiment: {rev.sentiment_label}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addReview}
      />
    </div>
  );
}
