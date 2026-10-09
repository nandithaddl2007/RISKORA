import React, { useState } from 'react';
import { ReplenishmentRequest, ReplenishmentStatus, RiskLevel } from '../types';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  ArrowRight,
  Filter,
  Package,
} from 'lucide-react';

interface ReplenishmentViewProps {
  queue: ReplenishmentRequest[];
  onAdvanceStatus: (id: string, status: ReplenishmentStatus) => void;
  onOpenAnalyzeModal: () => void;
}

export const ReplenishmentView: React.FC<ReplenishmentViewProps> = ({
  queue,
  onAdvanceStatus,
  onOpenAnalyzeModal,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<'ALL' | ReplenishmentStatus>('ALL');

  const filteredQueue = queue.filter(
    (req) => activeStatusTab === 'ALL' || req.status === activeStatusTab
  );

  const recommendedCount = queue.filter((r) => r.status === 'Recommended').length;
  const approvedCount = queue.filter((r) => r.status === 'Approved').length;
  const processingCount = queue.filter((r) => r.status === 'Processing').length;
  const completedCount = queue.filter((r) => r.status === 'Completed').length;

  const totalCapitalAllocated = queue.reduce(
    (sum, r) => sum + (r.costTotal || (r.orderQuantity || r.recommendedQuantity) * 45),
    0
  );

  const getStatusBadge = (status: ReplenishmentStatus) => {
    switch (status) {
      case 'Recommended':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 text-xs font-semibold font-mono">
            <Clock className="h-3 w-3" />
            Recommended
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 text-xs font-semibold font-mono">
            Approved
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2.5 py-1 text-xs font-semibold font-mono">
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 text-xs font-semibold font-mono">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-indigo-400" />
            <span>Replenishment Orders</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Track and manage orders created to prevent stock-outs.
          </p>
        </div>

        <button
          onClick={onOpenAnalyzeModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/30 cursor-pointer self-start sm:self-auto"
        >
          <Send className="h-3.5 w-3.5" />
          <span>+ Generate New Order</span>
        </button>
      </div>

      {/* 4 Status KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-4">
          <span className="text-xs text-slate-400 font-medium">Recommended</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
              {recommendedCount}
            </span>
            <span className="text-[11px] text-slate-400">Awaiting approval</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-4">
          <span className="text-xs text-slate-400 font-medium">Approved</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-300 font-mono tabular-nums">
              {approvedCount}
            </span>
            <span className="text-[11px] text-slate-400">Sent to vendor</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-4">
          <span className="text-xs text-slate-400 font-medium">Processing</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-300 font-mono tabular-nums">
              {processingCount}
            </span>
            <span className="text-[11px] text-slate-400">In production</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-4">
          <span className="text-xs text-slate-400 font-medium">Completed</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {completedCount}
            </span>
            <span className="text-[11px] text-slate-400">Received at dock</span>
          </div>
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {(['ALL', 'Recommended', 'Approved', 'Processing', 'Completed'] as const).map(
            (tab) => {
              const isActive = activeStatusTab === tab;
              const count =
                tab === 'ALL'
                  ? queue.length
                  : tab === 'Recommended'
                  ? recommendedCount
                  : tab === 'Approved'
                  ? approvedCount
                  : tab === 'Processing'
                  ? processingCount
                  : completedCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121B2F]'
                  }`}
                >
                  <span>{tab === 'ALL' ? 'All Orders' : tab}</span>
                  <span className="text-[10px] font-mono opacity-80">({count})</span>
                </button>
              );
            }
          )}
        </div>

        <div className="px-3 text-xs text-slate-400 font-mono">
          Total Order Value:{' '}
          <span className="font-bold text-white">
            ${totalCapitalAllocated.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#172338] bg-[#090E1A] text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3.5 px-6">Order ID & Product</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right font-mono">Units Ordered</th>
                <th className="py-3.5 px-4">Reason / Trigger</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 font-mono">Estimated Arrival</th>
                <th className="py-3.5 px-6 text-right">Workflow Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152136]">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No replenishment requests in this state.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((req) => (
                  <tr key={req.id} className="hover:bg-[#0F182E] transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">
                          {req.productName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <span className="text-indigo-300 font-semibold">{req.id}</span>
                          <span>·</span>
                          <span>{req.createdAt}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getRiskBadge(req.risk)}</td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-indigo-300 font-bold text-sm">
                      {req.orderQuantity || req.recommendedQuantity} units
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {req.reason}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {req.supplier}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {req.estimatedArrival}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      {req.status === 'Recommended' && (
                        <button
                          onClick={() => onAdvanceStatus(req.id, 'Approved')}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-[11px] font-bold text-white transition-colors cursor-pointer"
                        >
                          Approve PO
                        </button>
                      )}
                      {req.status === 'Approved' && (
                        <button
                          onClick={() => onAdvanceStatus(req.id, 'Processing')}
                          className="rounded-lg bg-[#142038] hover:bg-[#1C2C4D] border border-[#233558] px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors cursor-pointer"
                        >
                          Mark Processing
                        </button>
                      )}
                      {req.status === 'Processing' && (
                        <button
                          onClick={() => onAdvanceStatus(req.id, 'Completed')}
                          className="rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      {req.status === 'Completed' && (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
