import React from 'react';
import { AgentMode } from '../types';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';

interface AgentModeControlProps {
  currentMode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
}

export const AgentModeControl: React.FC<AgentModeControlProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes: {
    id: AgentMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    dotColor: string;
    activeBorder: string;
    activeBg: string;
    desc: string;
  }[] = [
    {
      id: 'Monitor',
      label: 'Monitor',
      icon: Eye,
      dotColor: 'bg-emerald-500',
      activeBorder: 'border-emerald-500/50',
      activeBg: 'bg-emerald-500/10 text-emerald-300',
      desc: 'Checks inventory and orders without taking action.',
    },
    {
      id: 'Recommend',
      label: 'Recommend',
      icon: ShieldAlert,
      dotColor: 'bg-amber-400',
      activeBorder: 'border-amber-500/50',
      activeBg: 'bg-amber-500/10 text-amber-300',
      desc: 'RISKORA analyzes inventory and recommends the next action before execution.',
    },
    {
      id: 'Autonomous',
      label: 'Autonomous',
      icon: Cpu,
      dotColor: 'bg-rose-500',
      activeBorder: 'border-rose-500/50',
      activeBg: 'bg-rose-500/10 text-rose-300',
      desc: 'Automatically creates replenishment requests when stock-out risk is high.',
    },
  ];

  const currentDesc = modes.find((m) => m.id === currentMode)?.desc;

  return (
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Agent Mode
          </h3>
          <p className="text-xs text-slate-400">Choose how RISKORA acts</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#131D33] px-2.5 py-1 text-xs text-slate-300 border border-[#1F2E4D]">
          <span className={`h-2 w-2 rounded-full ${modes.find((m) => m.id === currentMode)?.dotColor}`} />
          <span className="font-semibold text-white">{currentMode} Active</span>
        </div>
      </div>

      {/* Mode Switcher Segmented Control */}
      <div className="mt-4 grid grid-cols-3 gap-2 p-1 bg-[#080D1A] rounded-lg border border-[#182338]">
        {modes.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? `${mode.activeBg} border ${mode.activeBorder} shadow-sm font-bold`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121B2F]'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${mode.dotColor}`} />
              <span className="truncate">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-[#182338] pt-3">
        “{currentDesc}”
      </p>
    </div>
  );
};
