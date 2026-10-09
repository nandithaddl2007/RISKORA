import React, { useState } from 'react';
import { AgentActivity } from '../types';
import { Activity, Radio, AlertTriangle, Sparkles, Send, CheckCircle2, Filter } from 'lucide-react';

interface ActivityViewProps {
  activities: AgentActivity[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ activities }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = activities.filter(
    (act) => filterType === 'ALL' || act.type === filterType
  );

  const getActivityIcon = (type: AgentActivity['type']) => {
    switch (type) {
      case 'detection':
        return <Radio className="h-4 w-4 text-indigo-400" />;
      case 'risk_change':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'recommendation':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'replenishment':
        return <Send className="h-4 w-4 text-emerald-400" />;
      case 'verification':
        return <CheckCircle2 className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getBadgeStyle = (type: AgentActivity['type']) => {
    switch (type) {
      case 'risk_change':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'recommendation':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'replenishment':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      default:
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>Recent Activity</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Recent updates on demand changes, risk alerts, and restocking requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-lg bg-[#0C1322] border border-[#1A263D] p-1 text-xs">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'detection', label: 'Detections' },
            { id: 'risk_change', label: 'Risk Changes' },
            { id: 'recommendation', label: 'Recommendations' },
            { id: 'replenishment', label: 'Replenishments' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filterType === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-6 sm:p-8">
        <div className="relative pl-6 border-l-2 border-[#1A2742] space-y-7">
          {filtered.length === 0 ? (
            <div className="py-8 text-slate-500 text-xs">
              No activity logs match the selected event type.
            </div>
          ) : (
            filtered.map((act) => (
              <div key={act.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1222] border-2 border-indigo-500/50 group-hover:border-indigo-400 transition-colors shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                </div>

                <div className="rounded-xl bg-[#0F1728] border border-[#1B273F] p-4.5 group-hover:border-[#273859] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#182338] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        {act.timestamp}
                      </span>
                      <span className="text-slate-600">·</span>
                      <h4 className="text-sm font-bold text-slate-100">
                        {act.title}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono font-semibold border ${getBadgeStyle(
                        act.type
                      )} self-start sm:self-auto`}
                    >
                      {getActivityIcon(act.type)}
                      <span className="capitalize">{act.type.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed font-normal">
                    {act.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
