import React from 'react';
import { Product, ReplenishmentRequest, AgentActivity, AgentMode } from '../types';
import { KPICards } from '../components/KPICards';
import { AgentWorkflow } from '../components/AgentWorkflow';
import { InventoryRiskTable } from '../components/InventoryRiskTable';
import { DemandChart } from '../components/DemandChart';
import { ProductRiskStory } from '../components/ProductRiskStory';
import { ReplenishmentQueue } from '../components/ReplenishmentQueue';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { AgentModeControl } from '../components/AgentModeControl';

interface DashboardViewProps {
  products: Product[];
  replenishmentQueue: ReplenishmentRequest[];
  activities: AgentActivity[];
  agentMode: AgentMode;
  onAgentModeChange: (mode: AgentMode) => void;
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onAnalyzeProduct: (product: Product) => void;
  onReplenishProduct: (product: Product) => void;
  onCreateReplenishmentRequest: (req: ReplenishmentRequest) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  replenishmentQueue,
  activities,
  agentMode,
  onAgentModeChange,
  selectedProductId,
  onSelectProduct,
  onAnalyzeProduct,
  onReplenishProduct,
  onCreateReplenishmentRequest,
  onNavigateTab,
}) => {
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ||
    products[0] || {
      id: 'prod-handbag',
      name: 'Leather Handbag',
      sku: 'HB-LUX-001',
      category: 'Accessories',
      currentStock: 100,
      dailyOrders: 25,
      stockCoverage: 4.0,
      supplierLeadTime: 3,
      demandTrend: 'Increasing' as const,
      risk: 'HIGH' as const,
      recommendedAction: 'Replenish 150 units',
      recommendedQuantity: 150,
    };

  const highRiskCount = products.filter((p) => p.risk === 'HIGH').length; // 3
  const safeCount = products.filter((p) => p.risk === 'LOW').length; // 3
  const replenishmentRequired = 2; // Medium risk items needing replenishment action

  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards: 8 monitored, 3 high-risk, 2 replenishment needed, 3 safe */}
      <KPICards
        totalProducts={8}
        highRiskCount={highRiskCount || 3}
        replenishmentRequired={replenishmentRequired}
        safeCount={safeCount || 3}
        onNavigateToRisk={() => onNavigateTab('risk-analysis')}
        onNavigateToReplenishment={() => onNavigateTab('replenishment')}
        onNavigateToInventory={() => onNavigateTab('inventory')}
      />

      {/* How RISKORA Works: MONITOR -> ANALYZE -> DECIDE -> ACT -> CHECK */}
      <AgentWorkflow />

      {/* Grid: Demand Trend Chart & Product Risk Story */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DemandChart
            products={products}
            selectedProductId={selectedProductId}
            onSelectProduct={onSelectProduct}
          />
        </div>
        <div className="lg:col-span-1">
          <ProductRiskStory
            product={selectedProduct}
            onViewRecommendation={() => onAnalyzeProduct(selectedProduct)}
            onInitiateReplenishment={async () => {
              await onReplenishProduct(selectedProduct);
            }}
          />
        </div>
      </div>

      {/* Inventory Risk Overview Table (All 8 monitored products) */}
      <InventoryRiskTable
        products={products}
        onAnalyzeProduct={onAnalyzeProduct}
        onReplenishProduct={onReplenishProduct}
        title="Inventory Risk Overview"
      />

      {/* Bottom Grid: Replenishment Queue & Recent Activity / Agent Mode */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ReplenishmentQueue
            queue={replenishmentQueue}
            onCreateRequest={onCreateReplenishmentRequest}
          />
        </div>
        <div className="space-y-6 xl:col-span-1">
          <AgentModeControl
            currentMode={agentMode}
            onModeChange={onAgentModeChange}
          />
          <ActivityTimeline activities={activities} limit={4} />
        </div>
      </div>
    </div>
  );
};
