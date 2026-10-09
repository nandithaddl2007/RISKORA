import React, { useState } from 'react';
import { Product, RiskLevel } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface RiskAnalysisViewProps {
  products: Product[];
  onAnalyzeProduct: (product: Product) => void;
  onReplenishProduct: (product: Product) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  products,
  onAnalyzeProduct,
  onReplenishProduct,
}) => {
  const highRiskList = products.filter((p) => p.risk === 'HIGH');
  const mediumRiskList = products.filter((p) => p.risk === 'MEDIUM');
  const lowRiskList = products.filter((p) => p.risk === 'LOW');

  const total = products.length;
  const highPercent = Math.round((highRiskList.length / total) * 100) || 0;
  const mediumPercent = Math.round((mediumRiskList.length / total) * 100) || 0;
  const lowPercent = Math.round((lowRiskList.length / total) * 100) || 0;

  // Sandbox simulation state
  const [simProduct, setSimProduct] = useState<string>(products[0]?.id || '');
  const [simLeadTimeDelta, setSimLeadTimeDelta] = useState<number>(0);
  const [simDemandSurge, setSimDemandSurge] = useState<number>(0);

  const fallbackProduct: Product = {
    id: 'prod-handbag',
    name: 'Leather Handbag',
    sku: 'HB-LUX-001',
    category: 'Accessories',
    currentStock: 100,
    dailyOrders: 25,
    stockCoverage: 4.0,
    supplierLeadTime: 3,
    demandTrend: 'Increasing',
    risk: 'HIGH',
    recommendedAction: 'Replenish 150 units',
    recommendedQuantity: 150,
  };

  const activeSimProduct = products.find((p) => p.id === simProduct) || products[0] || fallbackProduct;

  const simulatedLeadTime = Math.max(1, activeSimProduct.supplierLeadTime + simLeadTimeDelta);
  const simulatedDailyOrders = Math.round(activeSimProduct.dailyOrders * (1 + simDemandSurge / 100));
  const simulatedCoverage = Number((activeSimProduct.currentStock / simulatedDailyOrders).toFixed(1));
  const isSimulatedHigh = simulatedCoverage <= simulatedLeadTime + 1.2;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-400" />
          <span>Stock-Out Risk Analysis</span>
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">
          RISKORA predicts which products may run out before new stock arrives.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* High Risk Card */}
        <div className="rounded-xl bg-[#0C1322] border border-rose-500/30 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
              High Risk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {highRiskList.length}
            </span>
            <span className="text-xs text-rose-400 font-medium font-mono">
              ({highPercent}% of active products)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Stock may run out before the next supplier delivery.
          </p>
        </div>

        {/* Medium Risk Card */}
        <div className="rounded-xl bg-[#0C1322] border border-amber-500/30 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
              Medium Risk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {mediumRiskList.length}
            </span>
            <span className="text-xs text-amber-400 font-medium font-mono">
              ({mediumPercent}% of active products)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Stock is getting low and replenishment may be needed soon.
          </p>
        </div>

        {/* Low Risk Card */}
        <div className="rounded-xl bg-[#0C1322] border border-emerald-500/30 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Low Risk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {lowRiskList.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium font-mono">
              ({lowPercent}% of active products)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Healthy stock coverage. No immediate action required.
          </p>
        </div>
      </div>

      {/* Risk Distribution Chart Bar */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Risk Distribution Bar
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {total} total monitored products
          </span>
        </div>

        {/* Proportional distribution line */}
        <div className="h-4 w-full rounded-full bg-[#11192C] overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${highPercent}%` }}
            className="bg-rose-500 transition-all duration-300"
            title={`High Risk: ${highRiskList.length} (${highPercent}%)`}
          />
          <div
            style={{ width: `${mediumPercent}%` }}
            className="bg-amber-500 transition-all duration-300"
            title={`Medium Risk: ${mediumRiskList.length} (${mediumPercent}%)`}
          />
          <div
            style={{ width: `${lowPercent}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Low Risk: ${lowRiskList.length} (${lowPercent}%)`}
          />
        </div>

        {/* Easier to scan legend & stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-[#0F1728] border border-rose-500/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-rose-300">High Risk</span>
            </div>
            <span className="font-mono font-bold text-white tabular-nums">
              {highPercent}% <span className="text-slate-400 font-normal">({highRiskList.length})</span>
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-[#0F1728] border border-amber-500/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-amber-300">Medium Risk</span>
            </div>
            <span className="font-mono font-bold text-white tabular-nums">
              {mediumPercent}% <span className="text-slate-400 font-normal">({mediumRiskList.length})</span>
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-[#0F1728] border border-emerald-500/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-300">Low Risk</span>
            </div>
            <span className="font-mono font-bold text-white tabular-nums">
              {lowPercent}% <span className="text-slate-400 font-normal">({lowRiskList.length})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Highest Risk Products Section */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
            <span>Highest-Risk Products Requiring Immediate Attention</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Products that may run out before the next supplier delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highRiskList.map((product) => {
            const margin = Number((product.stockCoverage - product.supplierLeadTime).toFixed(1));
            return (
              <div
                key={product.id}
                className="rounded-xl bg-[#0F1728] border border-rose-500/30 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {product.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {product.sku}
                      </span>
                    </div>
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                      HIGH RISK
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-[#0A0F1D] p-2 border border-[#182338]">
                      <span className="text-[10px] text-slate-400 block">Coverage</span>
                      <span className="font-bold text-rose-400 font-mono tabular-nums">
                        {product.stockCoverage} days
                      </span>
                    </div>
                    <div className="rounded bg-[#0A0F1D] p-2 border border-[#182338]">
                      <span className="text-[10px] text-slate-400 block">Lead Time</span>
                      <span className="font-bold text-white font-mono tabular-nums">
                        {product.supplierLeadTime} days
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 rounded bg-rose-950/20 border border-rose-500/20 p-2.5 text-xs text-rose-300">
                    <p className="leading-snug">
                      Stock may run out before restocking. Delivery takes {product.supplierLeadTime} days, and coverage is only {product.stockCoverage} days.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#182338] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onAnalyzeProduct(product)}
                    className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-semibold cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>View Reason</span>
                  </button>

                  <button
                    onClick={() => onReplenishProduct(product)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Replenish</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1A263D] pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>What-If Scenario Simulator</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Test how supplier delays or sudden marketing demand spikes impact stock-out probability.
            </p>
          </div>
          <select
            value={simProduct}
            onChange={(e) => setSimProduct(e.target.value)}
            className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                Simulate: {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">
                  Supplier Delivery Delay (+Days)
                </span>
                <span className="font-mono text-indigo-300 font-bold">
                  +{simLeadTimeDelta} days (Total: {simulatedLeadTime} days)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={simLeadTimeDelta}
                onChange={(e) => setSimLeadTimeDelta(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-[#162138] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 days (On time)</span>
                <span>+3 days</span>
                <span>+7 days (Major disruption)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">
                  Demand Acceleration Surge (%)
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  +{simDemandSurge}% ({simulatedDailyOrders} units/day)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={simDemandSurge}
                onChange={(e) => setSimDemandSurge(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-[#162138] rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>Normal velocity</span>
                <span>+50% campaign spike</span>
                <span>+100% viral surge</span>
              </div>
            </div>
          </div>

          {/* Outcome Result */}
          <div className={`rounded-xl border p-4.5 flex flex-col justify-between ${
            isSimulatedHigh
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              : 'bg-[#0F1728] border-[#1E2D4A] text-slate-300'
          }`}>
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
                Simulated Outcome
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-lg font-bold ${isSimulatedHigh ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isSimulatedHigh ? 'CRITICAL RISK DETECTED' : 'COVERAGE STABLE'}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed">
                Stock coverage compresses to <strong className="font-mono">{simulatedCoverage} days</strong> against a <strong className="font-mono">{simulatedLeadTime} day</strong> lead time.
              </p>
            </div>

            <button
              onClick={() => onAnalyzeProduct({
                ...activeSimProduct,
                dailyOrders: simulatedDailyOrders,
                supplierLeadTime: simulatedLeadTime,
              })}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Analyze in Engine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
