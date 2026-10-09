import React from 'react';
import { Eye, Search, CheckSquare, Send, CheckCircle2, ChevronRight } from 'lucide-react';

export const AgentWorkflow: React.FC = () => {
  const stages = [
    {
      name: 'MONITOR',
      desc: 'Checks inventory and orders',
      icon: Eye,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      name: 'ANALYZE',
      desc: 'Finds stock-out risk',
      icon: Search,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      name: 'DECIDE',
      desc: 'Chooses the next action',
      icon: CheckSquare,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      name: 'ACT',
      desc: 'Creates replenishment request',
      icon: Send,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      name: 'CHECK',
      desc: 'Monitors the result',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6">
      <div className="border-b border-[#1A263D] pb-3">
        <h2 className="text-base font-bold text-white tracking-tight">
          How RISKORA Works
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">
          A clear 5-step process from stock detection to restocking.
        </p>
      </div>

      {/* Horizontal Workflow Process */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;
          return (
            <div key={stage.name} className="relative flex-1">
              <div className={`h-full rounded-lg border p-4 bg-[#0F1728] transition-colors ${stage.bgColor} hover:border-slate-600`}>
                <div className="flex items-center justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-[#090E1A] border border-[#1E2C48] ${stage.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step 0{idx + 1}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    {stage.name}
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-snug">
                    “{stage.desc}”
                  </p>
                </div>
              </div>

              {!isLast && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
