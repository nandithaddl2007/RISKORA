import React, { useState } from 'react';
import { Product, RiskLevel } from '../types';
import { Sparkles, ArrowRight, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InventoryRiskTableProps {
  products: Product[];
  onAnalyzeProduct: (product: Product) => void;
  onReplenishProduct: (product: Product) => void;
  title?: string;
  showFilters?: boolean;
}

export const InventoryRiskTable: React.FC<InventoryRiskTableProps> = ({
  products,
  onAnalyzeProduct,
  onReplenishProduct,
  title = 'Inventory Risk Overview',
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
    return matchesSearch && matchesRisk;
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

  const getTrendIcon = (trend: Product['demandTrend']) => {
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
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-[#1A263D]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Current stock coverage compared against supplier delivery times.
            </p>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-52"
                />
              </div>

              {/* Risk Filter Segmented Tabs */}
              <div className="flex items-center rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-0.5 text-xs">
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      riskFilter === r
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r === 'ALL' ? 'All' : r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#172338] bg-[#090E1A] text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3.5 px-4 sm:px-6">Product</th>
              <th className="py-3.5 px-4 text-right font-mono">Current Stock</th>
              <th className="py-3.5 px-4 text-right font-mono">Daily Orders</th>
              <th className="py-3.5 px-4 text-right font-mono">Stock Coverage</th>
              <th className="py-3.5 px-4 text-right font-mono">Lead Time</th>
              <th className="py-3.5 px-4">Demand Trend</th>
              <th className="py-3.5 px-4">Risk</th>
              <th className="py-3.5 px-4">Recommended Action</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152136]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No products found matching the criteria.
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
                    {/* Product Name & SKU */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-100 text-sm">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono">{p.sku}</span>
                          <span>·</span>
                          <span>{p.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200 font-semibold">
                      {p.currentStock.toLocaleString()}
                    </td>

                    {/* Daily Orders */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      {p.dailyOrders}/day
                    </td>

                    {/* Stock Coverage */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`font-semibold ${
                          isUnderLeadTime
                            ? 'text-rose-400'
                            : p.stockCoverage <= 6
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.stockCoverage} days
                      </span>
                    </td>

                    {/* Supplier Lead Time */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      {p.supplierLeadTime} days
                    </td>

                    {/* Demand Trend */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        {getTrendIcon(p.demandTrend)}
                        <span>{p.demandTrend}</span>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4">{getRiskBadge(p.risk)}</td>

                    {/* Recommended Action */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">
                        {p.recommendedAction}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onAnalyzeProduct(p)}
                          className="flex items-center gap-1 rounded-md bg-[#131E35] border border-[#1F2F50] px-2.5 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-[#1A294A] hover:text-white transition-colors cursor-pointer"
                          title="Run Agentic AI analysis"
                        >
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          <span>Analyze</span>
                        </button>

                        {p.risk === 'HIGH' && (
                          <button
                            onClick={() => onReplenishProduct(p)}
                            className="flex items-center gap-1 rounded-md bg-indigo-600/90 hover:bg-indigo-500 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors cursor-pointer shadow-xs"
                            title="Initiate replenishment"
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
  );
};
