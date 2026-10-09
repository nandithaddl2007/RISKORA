import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShieldAlert,
  RefreshCw,
  Activity,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'inventory' | 'risk-analysis' | 'replenishment' | 'activity' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  highRiskCount: number;
  replenishmentPendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  highRiskCount,
  replenishmentPendingCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    {
      id: 'risk-analysis',
      label: 'Risk Analysis',
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? highRiskCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    },
    {
      id: 'replenishment',
      label: 'Replenishment',
      icon: RefreshCw,
      badge: replenishmentPendingCount > 0 ? replenishmentPendingCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B1222] border-r border-[#1B273F] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-5 border-b border-[#1B273F]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-indigo-700 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  RISKORA
                </span>
                <span className="text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-1.5 py-0.2 rounded">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Predict · Reason · Act · Replenish
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#152138] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/25 to-violet-600/15 text-white border-l-2 border-indigo-500 font-semibold'
                    : 'text-slate-400 hover:bg-[#131E35] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-mono tabular-nums font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent Status Card at Bottom */}
        <div className="p-4 border-t border-[#1B273F]">
          <div className="rounded-xl bg-[#0F182E] p-3.5 border border-[#1E2D4A]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Agent Status
              </span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-2 text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>RISKORA Agent Online</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Monitoring inventory and order levels.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
