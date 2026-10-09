import React, { useState } from 'react';
import { AgentMode } from '../types';
import { Sliders, Shield, Clock, Cpu, Webhook, Check, Copy, Save } from 'lucide-react';

interface SettingsViewProps {
  agentMode: AgentMode;
  onAgentModeChange: (mode: AgentMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  agentMode,
  onAgentModeChange,
}) => {
  const [criticalCoverageDays, setCriticalCoverageDays] = useState(4.0);
  const [leadTimeBufferDays, setLeadTimeBufferDays] = useState(1.5);
  const [safetyStockMultiplier, setSafetyStockMultiplier] = useState(1.25);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('https://n8n.riskora.internal/webhook/inventory-replenishment');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const samplePayload = JSON.stringify(
    {
      event: "riskora.replenishment.requested",
      timestamp: "2026-10-08T10:36:00Z",
      agent_mode: agentMode,
      product: {
        id: "prod-handbag",
        name: "Leather Handbag",
        sku: "HB-LUX-001",
        current_stock: 100,
        daily_orders: 25,
        stock_coverage_days: 4.0,
        supplier_lead_time_days: 3,
        demand_trend: "Increasing"
      },
      analysis: {
        risk_level: "HIGH",
        recommended_quantity: 150,
        reason: "Current inventory covers approximately 4 days of demand, while replenishment takes 3 days. Demand is increasing, leaving very little safety margin."
      }
    },
    null,
    2
  );

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="h-5 w-5 text-indigo-400" />
          <span>Settings</span>
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">
          Adjust risk rules, delivery buffers, and integration webhooks.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk Thresholds Card */}
        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#182338] pb-3">
            <Shield className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Risk Thresholds</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Critical Coverage Cutoff</span>
              <span className="font-mono text-rose-400 font-bold">{criticalCoverageDays} days</span>
            </div>
            <input
              type="range"
              min="2"
              max="7"
              step="0.5"
              value={criticalCoverageDays}
              onChange={(e) => setCriticalCoverageDays(parseFloat(e.target.value))}
              className="w-full accent-rose-500 bg-[#162138] rounded-lg h-2 cursor-pointer"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              When stock coverage falls below this value (adjusted for lead time), risk automatically elevates to HIGH.
            </p>
          </div>
        </div>

        {/* Supplier Lead Time Buffer Card */}
        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#182338] pb-3">
            <Clock className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Supplier Lead Time Buffer</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Safety Lead Margin Buffer</span>
              <span className="font-mono text-indigo-300 font-bold">+{leadTimeBufferDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={leadTimeBufferDays}
              onChange={(e) => setLeadTimeBufferDays(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-[#162138] rounded-lg h-2 cursor-pointer"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Accounts for port customs, freight variance, and supplier dispatch delays.
            </p>
          </div>
        </div>

        {/* Safety Stock Formula Card */}
        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#182338] pb-3">
            <Cpu className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Safety Stock Buffer Multiplier</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Demand Acceleration Factor</span>
              <span className="font-mono text-amber-400 font-bold">{safetyStockMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={safetyStockMultiplier}
              onChange={(e) => setSafetyStockMultiplier(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-[#162138] rounded-lg h-2 cursor-pointer"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Multiplier applied to replenishment recommendations when demand trend is tagged as 'Increasing'.
            </p>
          </div>
        </div>

        {/* Agent Operational Mode */}
        <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#182338] pb-3">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Default Agent Mode</h3>
          </div>

          <div className="space-y-2">
            {(['Monitor', 'Recommend', 'Autonomous'] as const).map((mode) => (
              <label
                key={mode}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                  agentMode === mode
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                    : 'bg-[#0F1728] border-[#182338] text-slate-300 hover:bg-[#121B2F]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="agentMode"
                    checked={agentMode === mode}
                    onChange={() => onAgentModeChange(mode)}
                    className="accent-indigo-500"
                  />
                  <span className="font-semibold">{mode}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {mode === 'Recommend' ? 'Default Policy' : ''}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* n8n Webhook / API Integration Ready Section */}
      <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#182338] pb-3">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                n8n Webhook & Orchestrator Integration
              </h3>
              <p className="text-xs text-slate-400">
                Replace simulated local calls with an external n8n workflow for ERP or supplier EDI dispatch.
              </p>
            </div>
          </div>
          <span className="rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 text-xs font-mono font-semibold">
            Ready to Connect
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            n8n Webhook Target Endpoint
          </label>
          <input
            type="url"
            value={n8nWebhookUrl}
            onChange={(e) => setN8nWebhookUrl(e.target.value)}
            className="w-full rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            When a replenishment order is triggered, RISKORA broadcasts the calculated reasoning schema to this endpoint.
          </p>
        </div>

        {/* Payload Schema Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300">
              Outgoing Payload Schema Preview (JSON)
            </span>
            <button
              onClick={handleCopyPayload}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Schema</span>
                </>
              )}
            </button>
          </div>
          <pre className="rounded-lg bg-[#070B14] border border-[#182338] p-4 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
            {samplePayload}
          </pre>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Settings updated successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
