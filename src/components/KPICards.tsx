import React from 'react';
import { Boxes, AlertTriangle, ShoppingCart, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface KPICardsProps {
  totalProducts: number;
  highRiskCount: number;
  replenishmentRequired: number;
  safeCount: number;
  onNavigateToRisk?: () => void;
  onNavigateToReplenishment?: () => void;
  onNavigateToInventory?: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalProducts = 8,
  highRiskCount = 3,
  replenishmentRequired = 2,
  safeCount = 3,
  onNavigateToRisk,
  onNavigateToReplenishment,
  onNavigateToInventory,
}) => {
  const cards = [
    {
      title: 'Products Monitored',
      value: totalProducts,
      subtext: 'Active inventory items',
      icon: Boxes,
      iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      accentColor: 'text-indigo-400',
      onClick: onNavigateToInventory,
    },
    {
      title: 'High-Risk Products',
      value: highRiskCount,
      subtext: 'May run out before restocking',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      accentColor: 'text-rose-400',
      onClick: onNavigateToRisk,
    },
    {
      title: 'Replenishment Needed',
      value: replenishmentRequired,
      subtext: 'Products needing action',
      icon: ShoppingCart,
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      accentColor: 'text-amber-400',
      onClick: onNavigateToReplenishment,
    },
    {
      title: 'Products Safe',
      value: safeCount,
      subtext: 'Healthy stock coverage',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      accentColor: 'text-emerald-400',
      onClick: onNavigateToInventory,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.onClick);
        return (
          <div
            key={idx}
            onClick={card.onClick}
            className={`group rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 transition-all duration-200 hover:border-[#273859] ${
              isClickable ? 'cursor-pointer hover:bg-[#0F172A]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                {card.value}
              </span>
              {isClickable && (
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500 group-hover:bg-indigo-400 transition-colors"></span>
              <span>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
