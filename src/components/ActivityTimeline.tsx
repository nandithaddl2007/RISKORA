import React from 'react';
import { AgentActivity } from '../types';
import { Activity, Radio, AlertTriangle, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface ActivityTimelineProps {
  activities: AgentActivity[];
  limit?: number;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  limit,
}) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const getActivityIcon = (type: AgentActivity['type']) => {
    switch (type) {
      case 'detection':
        return <Radio className="h-3.5 w-3.5 text-indigo-400" />;
      case 'risk_change':
        return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
      case 'recommendation':
        return <Sparkles className="h-3.5 w-3.5 text-amber-400" />;
      case 'replenishment':
        return <Send className="h-3.5 w-3.5 text-emerald-400" />;
      case 'verification':
        return <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />;
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
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-[#1A263D] pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <span>Recent Agent Activity</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Recent updates and restocking actions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-300">Live</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="mt-5 relative pl-4 border-l border-[#19263E] space-y-5">
        {displayActivities.map((act) => {
          return (
            <div key={act.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B1120] border border-[#233558] group-hover:border-indigo-400 transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              </div>

              {/* Event Content */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 font-mono tracking-tight">
                    {act.timestamp}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {act.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-medium border ${getBadgeStyle(
                      act.type
                    )}`}
                  >
                    {getActivityIcon(act.type)}
                    <span className="capitalize">{act.type.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {act.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
