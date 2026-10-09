import React, { useState } from 'react';
import { DemandTrend } from '../types';
import { X, Plus, Loader2 } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: {
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    dailyOrders: number;
    supplierLeadTime: number;
    demandTrend: DemandTrend;
    pendingOrders?: number;
  }) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [currentStock, setCurrentStock] = useState<number>(120);
  const [dailyOrders, setDailyOrders] = useState<number>(20);
  const [supplierLeadTime, setSupplierLeadTime] = useState<number>(4);
  const [demandTrend, setDemandTrend] = useState<DemandTrend>('Increasing');
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddProduct({
        name: name.trim(),
        sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        currentStock,
        dailyOrders,
        supplierLeadTime,
        demandTrend,
        pendingOrders,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0C1322] border border-[#1E2D4A] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1A263D] px-6 py-4 bg-[#090E1A]">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Add New Product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#152138] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ergonomic Office Chair"
              className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. OFF-CHR-01"
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Apparel">Apparel</option>
                <option value="Footwear">Footwear</option>
                <option value="Home Goods">Home Goods</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Stock (units)
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daily Orders (units/day)
              </label>
              <input
                type="number"
                min="1"
                value={dailyOrders}
                onChange={(e) => setDailyOrders(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Supplier Lead Time (days)
              </label>
              <input
                type="number"
                min="1"
                value={supplierLeadTime}
                onChange={(e) => setSupplierLeadTime(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Demand Trend
              </label>
              <select
                value={demandTrend}
                onChange={(e) => setDemandTrend(e.target.value as DemandTrend)}
                className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Decreasing">Decreasing</option>
                <option value="Stable">Stable</option>
                <option value="Increasing">Increasing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pending Inbound Stock (units)
            </label>
            <input
              type="number"
              min="0"
              value={pendingOrders}
              onChange={(e) => setPendingOrders(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#182338]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding SKU...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
