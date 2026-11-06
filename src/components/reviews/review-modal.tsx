'use client';

import React, { useState } from 'react';
import { X, Star, Building2, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/app-context';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    client_id: string;
    client_name?: string;
    rating: number;
    review_text?: string;
    review_date: string;
    source: string;
    sentiment_label?: 'Positive' | 'Neutral' | 'Negative';
    sentiment_score?: number;
  }) => void;
}

const REVIEW_SOURCES = ['Google Review', 'Smart Review QR', 'Direct Portal', 'Feedback Form'];

export function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const { clients } = useApp();
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState(REVIEW_SOURCES[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Simple, transparent rule-based sentiment classifier
  const estimateSentiment = (text: string, score: number) => {
    const lower = text.toLowerCase();
    const positiveWords = ['great', 'excellent', 'fast', 'attentive', 'dependable', 'best', 'good', 'loved', 'fresh'];
    const negativeWords = ['slow', 'bad', 'poor', 'delayed', 'tough', 'horrible', 'worst', 'issue', 'problem', 'waiting'];

    let posHits = 0;
    let negHits = 0;

    positiveWords.forEach((w) => {
      if (lower.includes(w)) posHits++;
    });
    negativeWords.forEach((w) => {
      if (lower.includes(w)) negHits++;
    });

    if (score >= 4 || posHits > negHits) {
      return { label: 'Positive' as const, score: 0.85 };
    } else if (score <= 2 || negHits > posHits) {
      return { label: 'Negative' as const, score: 0.25 };
    }
    return { label: 'Neutral' as const, score: 0.5 };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select an associated client.');
      return;
    }

    const selectedClient = clients.find((c) => c.id === clientId);
    const sentiment = estimateSentiment(reviewText, rating);

    onSubmit({
      client_id: clientId,
      client_name: selectedClient?.business_name,
      rating,
      review_text: reviewText.trim() || undefined,
      review_date: reviewDate,
      source,
      sentiment_label: sentiment.label,
      sentiment_score: sentiment.score,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF7F0] border border-[#E3DED2] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3DED2]">
          <h2 className="text-base font-bold text-[#164A3A]">Add Review Record</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[#758078] hover:text-[#25342D]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#c83232]/10 border border-[#c83232]/20 flex items-center gap-2 text-xs text-[#c83232]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">
              Associated Business *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.business_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Star Rating</label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-[#B89B5E] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-[#B89B5E] text-[#B89B5E]' : 'text-[#E3DED2]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#164A3A] ml-2">{rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#25342D] mb-1">Channel Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              >
                {REVIEW_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Review Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#758078]" />
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#25342D] mb-1">Customer Feedback Text</label>
            <div className="relative">
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste customer comments, praise, or complaints..."
                className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#E3DED2] focus:outline-none focus:ring-1 focus:ring-[#164A3A] text-[#25342D]"
              />
            </div>
            <p className="text-[10px] text-[#758078] mt-1">
              * Sentiment label is estimated automatically based on star score and feedback language.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E3DED2] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#758078] hover:text-[#25342D] rounded-lg hover:bg-[#F4EFE4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#164A3A] hover:bg-[#10382D] text-[#FAF7F0] rounded-lg shadow-xs"
            >
              Save Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
