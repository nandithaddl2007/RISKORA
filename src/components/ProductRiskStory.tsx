import React, { useState } from 'react';
import { Product } from '../types';
import { AlertTriangle, Sparkles, Send, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface ProductRiskStoryProps {
  product: Product;
  onViewRecommendation: () => void;
  onInitiateReplenishment: () => Promise<void>;
}

export const ProductRiskStory: React.FC<ProductRiskStoryProps> = ({
  product,
  onViewRecommendation,
  onInitiateReplenishment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleReplenish = async () => {
    setIsSubmitting(true);
    try {
      await onInitiateReplenishment();
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHandbag = product.name.toLowerCase().includes('handbag');
  const riskBadgeColor =
    product.risk === 'HIGH'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      : product.risk === 'MEDIUM'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  return (
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A263D] pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Product Risk Story
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              {product.name}
            </h3>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono uppercase border ${riskBadgeColor}`}>
            {product.risk} RISK
          </span>
        </div>

        {/* 5 Clear Product Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-2.5">
            <span className="text-[11px] text-slate-400 block">Current Stock</span>
            <span className="font-bold text-white font-mono tabular-nums text-sm">
              {product.currentStock} units
            </span>
          </div>

          <div className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-2.5">
            <span className="text-[11px] text-slate-400 block">Daily Orders</span>
            <span className="font-bold text-white font-mono tabular-nums text-sm">
              {product.dailyOrders}/day
            </span>
          </div>

          <div className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-2.5">
            <span className="text-[11px] text-slate-400 block">Stock Coverage</span>
            <span className="font-bold text-rose-400 font-mono tabular-nums text-sm">
              {product.stockCoverage} days
            </span>
          </div>

          <div className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-2.5">
            <span className="text-[11px] text-slate-400 block">Supplier Lead Time</span>
            <span className="font-bold text-slate-200 font-mono tabular-nums text-sm">
              {product.supplierLeadTime} days
            </span>
          </div>

          <div className="col-span-2 sm:col-span-2 rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-2.5">
            <span className="text-[11px] text-slate-400 block">Demand Trend</span>
            <span className="font-bold text-amber-300 text-sm">
              {product.demandTrend}
            </span>
          </div>
        </div>

        {/* Prominent Risk Warning */}
        <div className="mt-4 rounded-lg bg-rose-950/20 border border-rose-500/30 p-3.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-rose-200 leading-snug">
              “Stock may run out before the next delivery arrives.”
            </p>
          </div>
        </div>

        {/* Recommendation Line */}
        <div className="mt-3 rounded-lg bg-[#0F1728] border border-indigo-500/30 p-3 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium">Recommendation:</span>
          <span className="text-xs font-bold text-indigo-300 font-mono">
            Replenish approximately {product.recommendedQuantity || 150} units.
          </span>
        </div>

        {/* Inline Reasoning Accordion */}
        {isExpanded && (
          <div className="mt-3 rounded-lg bg-[#080D1A] border border-[#1A263D] p-3 text-xs text-slate-200 space-y-1.5 animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-400 font-mono uppercase font-semibold">
              Why this is recommended:
            </p>
            <ul className="space-y-1 text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Demand is increasing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Current stock covers approximately 4 days</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Supplier lead time is 3 days</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Safety margin is very small</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span>Replenishment is recommended</span>
              </li>
            </ul>
          </div>
        )}

        {justSubmitted && (
          <div className="mt-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Replenishment request created successfully.</span>
          </div>
        )}
      </div>

      {/* Two Buttons: View Recommendation & Initiate Replenishment */}
      <div className="mt-4 pt-3 border-t border-[#182338] flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) onViewRecommendation();
          }}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#233558] bg-[#10182C] hover:bg-[#16223D] px-3 py-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>{isExpanded ? 'Hide Details' : 'View Recommendation'}</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        <button
          type="button"
          onClick={handleReplenish}
          disabled={isSubmitting || justSubmitted}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Ordering...</span>
            </>
          ) : justSubmitted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Requested</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Initiate Replenishment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
