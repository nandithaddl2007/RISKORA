import React, { useState, useEffect } from 'react';
import { Product, RiskAnalysisResult, DemandTrend } from '../types';
import { analyzeInventoryRisk } from '../services/inventoryService';
import {
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProduct?: Product | null;
  onInitiateReplenishment: (analysis: RiskAnalysisResult) => Promise<void>;
  availableProducts: Product[];
  isDemoMode?: boolean;
}

export const AnalyzeModal: React.FC<AnalyzeModalProps> = ({
  isOpen,
  onClose,
  prefillProduct,
  onInitiateReplenishment,
  availableProducts,
  isDemoMode = false,
}) => {
  // Form State
  const [productName, setProductName] = useState('Leather Handbag');
  const [currentStock, setCurrentStock] = useState<number>(100);
  const [dailyOrders, setDailyOrders] = useState<number>(25);
  const [demandTrend, setDemandTrend] = useState<DemandTrend>('Increasing');
  const [supplierLeadTime, setSupplierLeadTime] = useState<number>(3);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [productId, setProductId] = useState<string | undefined>('prod-handbag');

  // Interaction State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [replenishmentSuccess, setReplenishmentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showParametersForm, setShowParametersForm] = useState(false);

  // Initialize or reset when modal opens or prefill changes
  useEffect(() => {
    if (!isOpen) return;

    if (isDemoMode) {
      // Direct demo presentation mode for Leather Handbag
      setProductName('Leather Handbag');
      setCurrentStock(100);
      setDailyOrders(25);
      setDemandTrend('Increasing');
      setSupplierLeadTime(3);
      setPendingOrders(0);
      setProductId('prod-handbag');
      setReplenishmentSuccess(false);
      setErrorMessage(null);
      setIsReasoningOpen(false);
      setShowParametersForm(false);

      // Pre-compute the exact Handbag analysis result
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAnalysisResult({
        productId: 'prod-handbag',
        productName: 'Leather Handbag',
        currentStock: 100,
        dailyDemand: 25,
        stockCoverage: 4.0,
        supplierLeadTime: 3,
        demandTrend: 'Increasing',
        risk: 'HIGH',
        riskHeadline: 'HIGH STOCK-OUT RISK',
        reason: 'Demand is increasing, and current stock may not last until the next replenishment arrives.',
        businessReasoning: [
          'Demand is increasing',
          'Current stock covers approximately 4 days',
          'Supplier lead time is 3 days',
          'Safety margin is very small',
          'Replenishment is recommended',
        ],
        recommendedQuantity: 150,
        safetyMarginDays: 1.0,
        analyzedAt: timeString,
      });
    } else if (prefillProduct) {
      setProductName(prefillProduct.name);
      setCurrentStock(prefillProduct.currentStock);
      setDailyOrders(prefillProduct.dailyOrders);
      setDemandTrend(prefillProduct.demandTrend);
      setSupplierLeadTime(prefillProduct.supplierLeadTime);
      setPendingOrders(prefillProduct.pendingOrders || 0);
      setProductId(prefillProduct.id);
      setAnalysisResult(null);
      setReplenishmentSuccess(false);
      setErrorMessage(null);
      setIsReasoningOpen(false);
      setShowParametersForm(true);
    } else {
      setShowParametersForm(true);
      setAnalysisResult(null);
      setReplenishmentSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen, prefillProduct, isDemoMode]);

  const loadHandbagDemo = () => {
    setProductName('Leather Handbag');
    setCurrentStock(100);
    setDailyOrders(25);
    setDemandTrend('Increasing');
    setSupplierLeadTime(3);
    setPendingOrders(0);
    setProductId('prod-handbag');
    setReplenishmentSuccess(false);
    setErrorMessage(null);
    setIsReasoningOpen(false);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAnalysisResult({
      productId: 'prod-handbag',
      productName: 'Leather Handbag',
      currentStock: 100,
      dailyDemand: 25,
      stockCoverage: 4.0,
      supplierLeadTime: 3,
      demandTrend: 'Increasing',
      risk: 'HIGH',
      riskHeadline: 'HIGH STOCK-OUT RISK',
      reason: 'Demand is increasing, and current stock may not last until the next replenishment arrives.',
      businessReasoning: [
        'Demand is increasing',
        'Current stock covers approximately 4 days',
        'Supplier lead time is 3 days',
        'Safety margin is very small',
        'Replenishment is recommended',
      ],
      recommendedQuantity: 150,
      safetyMarginDays: 1.0,
      analyzedAt: timeString,
    });
    setShowParametersForm(false);
  };

  if (!isOpen) return null;

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      setErrorMessage('Please enter a product name.');
      return;
    }
    if (currentStock < 0 || dailyOrders <= 0 || supplierLeadTime < 0) {
      setErrorMessage('Please enter valid numeric inventory parameters.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setReplenishmentSuccess(false);

    try {
      const result = await analyzeInventoryRisk({
        productId,
        productName: productName.trim(),
        currentStock,
        dailyDemand: dailyOrders,
        demandTrend,
        supplierLeadTime,
        pendingOrders,
      });
      setAnalysisResult(result);
      setShowParametersForm(false);
    } catch {
      setErrorMessage('Unable to analyze this product. Please check the inventory details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInitiateReplenishment = async () => {
    if (!analysisResult) return;
    setIsReplenishing(true);
    setErrorMessage(null);
    try {
      await onInitiateReplenishment(analysisResult);
      setReplenishmentSuccess(true);
    } catch {
      setErrorMessage('Replenishment request could not be created. Please try again.');
    } finally {
      setIsReplenishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0C1322] border border-[#1E2D4A] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A263D] px-6 py-4 bg-[#090E1A]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Product Risk Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Predict stock-outs and determine autonomous replenishment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#152138] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Quick Preset Selector */}
          <div className="flex flex-wrap items-center justify-between rounded-lg bg-[#0F1728] border border-[#19263E] p-3 text-xs gap-2">
            <span className="text-slate-400 font-medium">Quick Demo Preset:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadHandbagDemo}
                className="rounded-md bg-indigo-600/20 border border-indigo-500/40 px-3 py-1 text-indigo-300 font-semibold hover:bg-indigo-600/30 transition-colors cursor-pointer"
              >
                👜 Leather Handbag (100 stock / 25 daily / 3d lead)
              </button>
              {analysisResult && (
                <button
                  type="button"
                  onClick={() => setShowParametersForm(!showParametersForm)}
                  className="flex items-center gap-1 rounded-md bg-[#090E1A] border border-[#1E2D4A] px-2.5 py-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>{showParametersForm ? 'Hide Inputs' : 'Edit Parameters'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Form (shows if no result or user toggles parameter editing) */}
          {(showParametersForm || !analysisResult) && (
            <form onSubmit={handleRunAnalysis} className="space-y-4 rounded-xl bg-[#090E1A] border border-[#182338] p-4.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Leather Handbag"
                    required
                    className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Current Stock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Stock (units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
                    required
                    className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Daily Orders */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Daily Orders (units/day)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dailyOrders}
                    onChange={(e) => setDailyOrders(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                    className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Demand Trend */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Demand Trend
                  </label>
                  <select
                    value={demandTrend}
                    onChange={(e) => setDemandTrend(e.target.value as DemandTrend)}
                    className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Decreasing">Decreasing</option>
                    <option value="Stable">Stable</option>
                    <option value="Increasing">Increasing</option>
                  </select>
                </div>

                {/* Supplier Lead Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Supplier Lead Time (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={supplierLeadTime}
                    onChange={(e) => setSupplierLeadTime(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                    className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing with RISKORA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with RISKORA</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Polished Result Card */}
          {analysisResult && (
            <div className="rounded-xl border border-rose-500/30 bg-[#0F172A] p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              {/* Product Header & Risk Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E2C48] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-medium">
                    Evaluated Product
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {analysisResult.productName}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold font-mono text-xs uppercase tracking-wider shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>{analysisResult.riskHeadline}</span>
                </div>
              </div>

              {/* Core Metrics: Stock Coverage, Supplier Lead Time, Demand Trend */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-[#0B1120] border border-[#1B273F] p-3.5 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Stock Coverage</span>
                  <span className="text-lg font-bold text-rose-400 font-mono tabular-nums">
                    {analysisResult.stockCoverage} days
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({analysisResult.currentStock} / {analysisResult.dailyDemand} daily)
                  </span>
                </div>

                <div className="rounded-lg bg-[#0B1120] border border-[#1B273F] p-3.5 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Supplier Lead Time</span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {analysisResult.supplierLeadTime} days
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Order to dock
                  </span>
                </div>

                <div className="rounded-lg bg-[#0B1120] border border-[#1B273F] p-3.5 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Demand Trend</span>
                  <span className="text-lg font-bold text-amber-300 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    <span>{analysisResult.demandTrend}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Accelerating
                  </span>
                </div>
              </div>

              {/* Reason Section */}
              <div className="rounded-lg bg-rose-950/20 border border-rose-500/25 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Stock-Out Risk</span>
                </div>
                <p className="text-sm font-bold text-rose-200 leading-snug">
                  “Stock may run out before the next delivery arrives.”
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.reason}
                </p>
              </div>

              {/* Recommendation & Primary CTAs */}
              <div className="rounded-xl bg-[#090E1A] border border-[#1E2D4A] p-4.5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#182338] pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 font-mono block">
                      Recommendation
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 block">
                      Replenish approximately {analysisResult.recommendedQuantity} units.
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Buffer to prevent stock-out
                  </span>
                </div>

                {/* Two Action Buttons: View Recommendation & Initiate Replenishment */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Secondary Button: View Recommendation */}
                  <button
                    type="button"
                    onClick={() => setIsReasoningOpen(!isReasoningOpen)}
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#233558] bg-[#10182C] hover:bg-[#16223D] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isReasoningOpen ? 'Hide Recommendation' : 'View Recommendation'}</span>
                    {isReasoningOpen ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>

                  {/* Primary Button: Initiate Replenishment */}
                  <button
                    type="button"
                    onClick={handleInitiateReplenishment}
                    disabled={isReplenishing || replenishmentSuccess}
                    className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                      replenishmentSuccess
                        ? 'bg-emerald-600 border border-emerald-500/50'
                        : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-indigo-600/30'
                    }`}
                  >
                    {isReplenishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Request...</span>
                      </>
                    ) : replenishmentSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <span>Replenishment Request Created</span>
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

              {/* Confirmation State */}
              {replenishmentSuccess && (
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-4 text-xs text-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-300 block text-sm">
                      Replenishment request created successfully.
                    </span>
                    <span className="text-emerald-300/80 mt-0.5 block">
                      Added event: “RISKORA created a replenishment request for 150 units of Leather Handbag.”
                    </span>
                  </div>
                </div>
              )}

              {/* View Reasoning Simple Explanation (Clean bullet points, no complex AI CoT) */}
              {isReasoningOpen && (
                <div className="rounded-xl bg-[#090E1A] border border-[#19263E] p-4.5 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 border-b border-[#182338] pb-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Reasoning Summary
                    </h5>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>Demand is increasing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>Current stock covers approximately 4 days</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>Supplier lead time is 3 days</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>Safety margin is very small</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>Replenishment is recommended</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
