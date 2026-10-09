import React, { useState } from 'react';
import { ReplenishmentRequest, RiskLevel } from '../types';
import { ShoppingCart, CheckCircle2, Clock, Send, Loader2, ArrowRight } from 'lucide-react';

interface ReplenishmentQueueProps {
  queue: ReplenishmentRequest[];
  onCreateRequest: (req: ReplenishmentRequest) => Promise<void>;
  onAdvanceStatus?: (id: string, status: ReplenishmentRequest['status']) => void;
  title?: string;
}

export const ReplenishmentQueue: React.FC<ReplenishmentQueueProps> = ({
  queue,
  onCreateRequest,
  onAdvanceStatus,
  title = 'Replenishment Queue',
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmedModal, setConfirmedModal] = useState<{
    isOpen: boolean;
    productName: string;
    quantity: number;
    requestId: string;
  } | null>(null);

  const handleActionClick = async (req: ReplenishmentRequest) => {
    setLoadingId(req.id);
    try {
      await onCreateRequest(req);
      setConfirmedModal({
        isOpen: true,
        productName: req.productName,
        quantity: req.orderQuantity || req.recommendedQuantity,
        requestId: req.id,
      });
    } finally {
      setLoadingId(null);
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold uppercase bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
            LOW RISK
          </span>
        );
    }
  };

  const getStatusBadge = (status: ReplenishmentRequest['status']) => {
    switch (status) {
      case 'Recommended':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 text-[11px] font-medium font-mono">
            <Clock className="h-3 w-3" />
            Awaiting Action
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 text-[11px] font-medium font-mono">
            Approved
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2 py-0.5 text-[11px] font-medium font-mono">
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 text-[11px] font-medium font-mono">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1A263D] pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-indigo-400" />
            <span>{title}</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Recommended reorders to prevent products from running out.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Orders in queue: <span className="font-bold text-white">{queue.length}</span>
        </span>
      </div>

      {/* Cards Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {queue.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-slate-500 text-xs">
            No replenishment orders pending. All inventory levels are optimal.
          </div>
        ) : (
          queue.map((req) => {
            const isLoading = loadingId === req.id;
            return (
              <div
                key={req.id}
                className="rounded-xl bg-[#0F1728] border border-[#1E2D4A] p-4.5 hover:border-[#273859] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {req.productName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {req.id}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {getRiskBadge(req.risk)}
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Reason */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-[#0A0F1D] border border-[#18243A] px-3 py-2">
                      <span className="text-slate-400">Recommended:</span>
                      <span className="font-bold text-indigo-300 font-mono tabular-nums text-sm">
                        {req.recommendedQuantity || req.orderQuantity} units
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#0A0F1D] border border-[#18243A] p-2.5">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-0.5 uppercase tracking-wide">
                        Reason:
                      </span>
                      <p className="text-xs text-slate-300 leading-snug">
                        {req.reason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                      <span>Supplier: <strong className="text-slate-300">{req.supplier}</strong></span>
                      <span>ETA: <strong className="text-slate-300">{req.estimatedArrival}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-[#18243A] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {req.createdAt}
                  </span>

                  {req.status === 'Recommended' ? (
                    <button
                      onClick={() => handleActionClick(req)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Creating Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Create Replenishment Request</span>
                        </>
                      )}
                    </button>
                  ) : onAdvanceStatus && req.status !== 'Completed' ? (
                    <button
                      onClick={() => {
                        const next = req.status === 'Approved' ? 'Processing' : 'Completed';
                        onAdvanceStatus(req.id, next);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-[#142038] hover:bg-[#1E2E4E] border border-[#233558] px-2.5 py-1 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Mark {req.status === 'Approved' ? 'Processing' : 'Completed'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Dispatched
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmedModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#0C1322] border border-[#1E2D4A] p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Replenishment request created successfully.
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Order request for <strong className="text-slate-200">{confirmedModal.quantity} units</strong> of <strong className="text-slate-200">{confirmedModal.productName}</strong> has been transmitted.
              </p>
            </div>

            <div className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] p-3 text-xs text-left font-mono space-y-1">
              <div className="text-slate-400 flex justify-between">
                <span>Request ID:</span>
                <span className="text-indigo-300 font-bold">{confirmedModal.requestId}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Webhook Integration:</span>
                <span className="text-emerald-400 font-semibold">Simulated (n8n Ready)</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Telemetry Status:</span>
                <span className="text-slate-200">Activity Log Updated</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedModal(null)}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
