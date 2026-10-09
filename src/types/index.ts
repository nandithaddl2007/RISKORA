export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DemandTrend = 'Increasing' | 'Stable' | 'Decreasing';

export type ReplenishmentStatus = 'Recommended' | 'Approved' | 'Processing' | 'Completed';

export type AgentMode = 'Monitor' | 'Recommend' | 'Autonomous';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  dailyOrders: number;
  stockCoverage: number; // in days = currentStock / dailyOrders
  supplierLeadTime: number; // in days
  demandTrend: DemandTrend;
  risk: RiskLevel;
  recommendedAction: string;
  recommendedQuantity: number;
  pendingOrders?: number;
  sparkline?: number[];
  unitCost?: number;
}

export interface RiskAnalysisResult {
  productId?: string;
  productName: string;
  currentStock: number;
  dailyDemand: number;
  stockCoverage: number;
  supplierLeadTime: number;
  demandTrend: DemandTrend;
  risk: RiskLevel;
  reason: string;
  businessReasoning: string[];
  recommendedQuantity: number;
  safetyMarginDays: number;
  riskHeadline: string;
  analyzedAt: string;
}

export interface ReplenishmentRequest {
  id: string;
  productId: string;
  productName: string;
  risk: RiskLevel;
  recommendedQuantity: number;
  orderQuantity: number;
  reason: string;
  status: ReplenishmentStatus;
  supplier: string;
  estimatedArrival: string;
  createdAt: string;
  costTotal?: number;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'detection' | 'risk_change' | 'recommendation' | 'replenishment' | 'verification';
  risk?: RiskLevel;
  productId?: string;
}
