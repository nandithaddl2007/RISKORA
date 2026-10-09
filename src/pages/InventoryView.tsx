import React, { useState } from 'react';
import { Product, RiskLevel, DemandTrend } from '../types';
import {
  Boxes,
  Plus,
  Search,
  ArrowUpDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onOpenAddProductModal: () => void;
  onAnalyzeProduct: (product: Product) => void;
  onReplenishProduct: (product: Product) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddProductModal,
  onAnalyzeProduct,
  onReplenishProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [trendFilter, setTrendFilter] = useState<'ALL' | DemandTrend>('ALL');
  const [sortBy, setSortBy] = useState<'coverage-asc' | 'coverage-desc' | 'stock-desc' | 'orders-desc'>('coverage-asc');

  // Filter & Sort
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
      const matchesTrend = trendFilter === 'ALL' || p.demandTrend === trendFilter;
      return matchesSearch && matchesRisk && matchesTrend;
    })
    .sort((a, b) => {
      if (sortBy === 'coverage-asc') return a.stockCoverage - b.stockCoverage;
      if (sortBy === 'coverage-desc') return b.stockCoverage - a.stockCoverage;
      if (sortBy === 'stock-desc') return b.currentStock - a.currentStock;
      if (sortBy === 'orders-desc') return b.dailyOrders - a.dailyOrders;
      return 0;
    });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            LOW
          </span>
        );
    }
  };

  const getTrendIcon = (trend: DemandTrend) => {
    switch (trend) {
      case 'Increasing':
        return <TrendingUp className="h-3.5 w-3.5 text-rose-400" />;
      case 'Decreasing':
        return <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />;
      case 'Stable':
        return <Minus className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-400" />
            <span>Product Inventory</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Monitor stock levels, daily orders, and replenishment needs across your 8 products.
          </p>
        </div>

        <button
          onClick={onOpenAddProductModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Control Bar: Filters, Search, Sort */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product title, SKU, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as 'ALL' | RiskLevel)}
              className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Demand Trend Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Trend:</span>
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value as 'ALL' | DemandTrend)}
              className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Trends</option>
              <option value="Increasing">Increasing</option>
              <option value="Stable">Stable</option>
              <option value="Decreasing">Decreasing</option>
            </select>
          </div>

          {/* Sort By Stock Coverage */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="coverage-asc">Coverage (Lowest First)</option>
              <option value="coverage-desc">Coverage (Highest First)</option>
              <option value="stock-desc">Stock (Highest First)</option>
              <option value="orders-desc">Daily Demand (Highest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#172338] bg-[#090E1A] text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3.5 px-6">Product & SKU</th>
                <th className="py-3.5 px-4 text-right font-mono">On Hand Stock</th>
                <th className="py-3.5 px-4 text-right font-mono">Daily Velocity</th>
                <th className="py-3.5 px-4 text-right font-mono">Coverage (Days)</th>
                <th className="py-3.5 px-4 text-right font-mono">Supplier Lead</th>
                <th className="py-3.5 px-4">Demand Trend</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Recommended Action</th>
                <th className="py-3.5 px-6 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152136]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-sm">
                    No catalog items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isUnderLeadTime = p.stockCoverage <= p.supplierLeadTime + 1.2;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#0F182E] transition-colors group"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-sm">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-indigo-300">{p.sku}</span>
                            <span>·</span>
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200 font-bold text-sm">
                        {p.currentStock.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {p.dailyOrders}/day
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <span
                          className={`font-bold text-sm ${
                            isUnderLeadTime
                              ? 'text-rose-400'
                              : p.stockCoverage <= 6
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.stockCoverage} d
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {p.supplierLeadTime} d
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                          {getTrendIcon(p.demandTrend)}
                          <span>{p.demandTrend}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getRiskBadge(p.risk)}</td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {p.recommendedAction}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onAnalyzeProduct(p)}
                            className="flex items-center gap-1 rounded-md bg-[#131E35] border border-[#1F2F50] px-2.5 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-[#1A294A] hover:text-white transition-colors cursor-pointer"
                          >
                            <Sparkles className="h-3 w-3 text-indigo-400" />
                            <span>Analyze</span>
                          </button>

                          {p.risk === 'HIGH' && (
                            <button
                              onClick={() => onReplenishProduct(p)}
                              className="flex items-center gap-1 rounded-md bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors cursor-pointer shadow-xs"
                            >
                              <span>Replenish</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
