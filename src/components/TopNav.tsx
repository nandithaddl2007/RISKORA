import React, { useEffect, useState } from 'react';
import { Menu, Sparkles, Clock, Play } from 'lucide-react';

interface TopNavProps {
  onOpenMobileSidebar: () => void;
  onOpenAnalyzeModal: (prefillProduct?: string) => void;
  onTriggerDemo: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMobileSidebar,
  onOpenAnalyzeModal,
  onTriggerDemo,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#1B273F] bg-[#080E1C]/90 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: Greeting & Subtext */}
        <div className="flex items-start gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="mt-0.5 rounded-lg border border-[#1E2D4A] p-2 text-slate-300 hover:bg-[#131E35] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Inventory Overview
              </h1>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
              RISKORA is monitoring your inventory and demand to detect stock-out risk.
            </p>
          </div>
        </div>

        {/* Right: Date/Time + Demo & Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Live Date / Time */}
          <div className="hidden xl:flex items-center gap-2 rounded-lg bg-[#0F182E] border border-[#1B273F] px-3 py-1.5 text-xs text-slate-300 font-mono tabular-nums">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>{currentDate}</span>
            <span className="text-slate-600">·</span>
            <span className="text-indigo-300">{currentTime}</span>
          </div>

          {/* Quick Demo: Handbag Scenario */}
          <button
            onClick={onTriggerDemo}
            className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Demonstrate Handbag risk calculation (100 stock / 25 daily / 3 days lead)"
          >
            <Play className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>Quick Demo: Handbag Scenario</span>
          </button>

          {/* Main Action: Analyze Product Risk */}
          <button
            onClick={() => onOpenAnalyzeModal()}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Analyze Product Risk</span>
          </button>
        </div>
      </div>
    </header>
  );
};
