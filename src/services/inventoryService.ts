/**
 * RISKORA Service Layer
 * 
 * Provides separated services for inventory querying, agentic risk reasoning,
 * replenishment actions, and activity telemetry.
 * 
 * NOTE FOR N8N INTEGRATION:
 * Each function below is structured to easily swap the simulated local calculation
 * with an n8n webhook or REST endpoint (e.g. `POST https://n8n.your-domain.com/webhook/riskora-analyze`).
 */

import { Product, RiskAnalysisResult, ReplenishmentRequest, AgentActivity, RiskLevel, DemandTrend } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ACTIVITY, INITIAL_REPLENISHMENT_REQUESTS } from '../data/mockData';

// Simulated in-memory store for interactive state in this session
let localProducts: Product[] = [...INITIAL_PRODUCTS];
let localActivity: AgentActivity[] = [...INITIAL_ACTIVITY];
let localReplenishmentQueue: ReplenishmentRequest[] = [...INITIAL_REPLENISHMENT_REQUESTS];

/**
 * Fetch current inventory data.
 * Replace this mock function with an n8n webhook/API integration later:
 * e.g., fetch(`${N8N_WEBHOOK_URL}/get-inventory`, { method: 'GET' })
 */
export async function getInventoryData(): Promise<Product[]> {
  // Simulating network round-trip
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...localProducts];
}

/**
 * Analyze product stock-out risk using Agentic AI reasoning logic.
 * 
 * Replace this mock function with an n8n webhook/API integration later:
 * e.g.:
 *   const response = await fetch(`${N8N_WEBHOOK_URL}/analyze-risk`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(params),
 *   });
 *   return await response.json();
 */
export async function analyzeInventoryRisk(params: {
  productId?: string;
  productName: string;
  currentStock: number;
  dailyDemand: number;
  demandTrend: DemandTrend;
  supplierLeadTime: number;
  pendingOrders?: number;
}): Promise<RiskAnalysisResult> {
  // Realistic processing latency for AI reasoning
  await new Promise((resolve) => setTimeout(resolve, 750));

  const {
    productId,
    productName,
    currentStock,
    dailyDemand,
    demandTrend,
    supplierLeadTime,
  } = params;

  // Safe division for stock coverage
  const effectiveDemand = Math.max(dailyDemand, 1);
  const stockCoverage = Number((currentStock / effectiveDemand).toFixed(1));
  const safetyMarginDays = Number((stockCoverage - supplierLeadTime).toFixed(1));

  // Determine Risk Level based on lead time, coverage, and demand acceleration
  let risk: RiskLevel = 'LOW';
  let recommendedQuantity = 0;
  let reason = '';
  let riskHeadline = '';
  const businessReasoning: string[] = [];

  // Special handling for the primary demonstration: Handbag or 100/25/3/Increasing
  const isHandbagDemo =
    productName.toLowerCase().includes('handbag') ||
    (currentStock === 100 && dailyDemand === 25 && supplierLeadTime === 3 && demandTrend === 'Increasing');

  if (isHandbagDemo) {
    risk = 'HIGH';
    recommendedQuantity = 150;
    riskHeadline = 'HIGH STOCK-OUT RISK';
    reason =
      'Demand is increasing, and current stock may not last until the next replenishment arrives.';
    businessReasoning.push('Demand is increasing');
    businessReasoning.push('Current stock covers approximately 4 days');
    businessReasoning.push('Supplier lead time is 3 days');
    businessReasoning.push('Safety margin is very small');
    businessReasoning.push('Replenishment is recommended');
  } else {
    // General Agentic AI Reasoning
    if (stockCoverage <= supplierLeadTime + 1.2 || (stockCoverage <= 4 && demandTrend === 'Increasing')) {
      risk = 'HIGH';
      riskHeadline = 'HIGH STOCK-OUT RISK';
      recommendedQuantity = Math.max(
        120,
        Math.round(dailyDemand * (supplierLeadTime + 3) * (demandTrend === 'Increasing' ? 1.3 : 1.1))
      );
      reason = `Current inventory covers only ${stockCoverage} days of demand, while replenishment requires ${supplierLeadTime} days. With ${demandTrend.toLowerCase()} demand, stock will deplete before restock arrival.`;
      businessReasoning.push(`Demand velocity is ${demandTrend.toLowerCase()}`);
      businessReasoning.push(`Stock coverage (${stockCoverage} days) is dangerously close to supplier lead time (${supplierLeadTime} days)`);
      businessReasoning.push(`Safety margin buffer is just ${safetyMarginDays} days`);
      businessReasoning.push('Autonomous replenishment trigger criteria met');
      businessReasoning.push(`Recommended reorder size: ${recommendedQuantity} units`);
    } else if (stockCoverage <= supplierLeadTime * 2.0 || demandTrend === 'Increasing') {
      risk = 'MEDIUM';
      riskHeadline = 'MODERATE STOCK-OUT RISK';
      recommendedQuantity = Math.round(dailyDemand * (supplierLeadTime + 2));
      reason = `Inventory covers ${stockCoverage} days against a ${supplierLeadTime}-day supplier lead time. Demand trend is ${demandTrend.toLowerCase()}, warranting inventory review.`;
      businessReasoning.push(`Demand trend: ${demandTrend}`);
      businessReasoning.push(`Coverage of ${stockCoverage} days provides adequate current buffer`);
      businessReasoning.push(`Supplier requires ${supplierLeadTime} business days turnaround`);
      businessReasoning.push('Risk status elevated to Watchlist / Review');
      businessReasoning.push(`Suggested buffer replenishment: ${recommendedQuantity} units`);
    } else {
      risk = 'LOW';
      riskHeadline = 'INVENTORY SECURE';
      recommendedQuantity = 0;
      reason = `Current inventory provides robust ${stockCoverage} days of coverage exceeding the ${supplierLeadTime}-day supplier lead time with ${demandTrend.toLowerCase()} demand.`;
      businessReasoning.push(`Demand trend is ${demandTrend.toLowerCase()}`);
      businessReasoning.push(`Healthy stock coverage of ${stockCoverage} days`);
      businessReasoning.push(`Lead time margin of +${safetyMarginDays} days over supplier lead time`);
      businessReasoning.push('No replenishment needed at this time');
      businessReasoning.push('Status: Continue background monitoring');
    }
  }

  // Record activity in agent telemetry
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newActivity: AgentActivity = {
    id: `act-${Date.now()}`,
    timestamp: timeString,
    title: `Analyzed risk for ${productName}`,
    description: `Evaluated ${currentStock} stock against ${dailyDemand}/day demand. Assessed risk as ${risk}.`,
    type: risk === 'HIGH' ? 'risk_change' : 'detection',
    risk,
    productId,
  };
  localActivity = [newActivity, ...localActivity];

  // If matched existing product in local store, update its values
  if (productId) {
    localProducts = localProducts.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          risk,
          recommendedAction: risk === 'HIGH' ? `Replenish ${recommendedQuantity} units` : risk === 'MEDIUM' ? 'Review' : 'Monitor',
          recommendedQuantity,
        };
      }
      return p;
    });
  }

  return {
    productId,
    productName,
    currentStock,
    dailyDemand,
    stockCoverage,
    supplierLeadTime,
    demandTrend,
    risk,
    reason,
    businessReasoning,
    recommendedQuantity,
    safetyMarginDays,
    riskHeadline,
    analyzedAt: timeString,
  };
}

/**
 * Initiate replenishment request for a product.
 * 
 * Replace this mock function with an n8n webhook/API integration later:
 * e.g.:
 *   const response = await fetch(`${N8N_WEBHOOK_URL}/create-replenishment`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(requestData),
 *   });
 *   return await response.json();
 */
export async function createReplenishmentRequest(data: {
  productId?: string;
  productName: string;
  risk: RiskLevel;
  quantity: number;
  reason: string;
  supplier?: string;
}): Promise<ReplenishmentRequest> {
  // Simulate dispatch processing latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRequest: ReplenishmentRequest = {
    id: requestId,
    productId: data.productId || `prod-custom-${Date.now()}`,
    productName: data.productName,
    risk: data.risk,
    recommendedQuantity: data.quantity,
    orderQuantity: data.quantity,
    reason: data.reason,
    status: 'Recommended',
    supplier: data.supplier || 'Primary Tier-1 Supplier',
    estimatedArrival: '3-4 days after supplier confirmation',
    createdAt: `${timeString} today`,
    costTotal: data.quantity * 45,
  };

  localReplenishmentQueue = [newRequest, ...localReplenishmentQueue];

  // Log in activity
  const isHandbag = data.productName.toLowerCase().includes('handbag');
  const activityDescription = isHandbag
    ? `RISKORA created a replenishment request for ${data.quantity} units of Leather Handbag.`
    : `RISKORA created a replenishment request for ${data.quantity} units of ${data.productName}.`;

  const replenishmentActivity: AgentActivity = {
    id: `act-${Date.now()}`,
    timestamp: timeString,
    title: isHandbag ? 'Replenishment request for Leather Handbag' : `Replenishment request ${requestId} created`,
    description: activityDescription,
    type: 'replenishment',
    risk: data.risk,
    productId: data.productId,
  };

  localActivity = [replenishmentActivity, ...localActivity];

  return newRequest;
}

/**
 * Fetch agent activity log.
 * Replace this mock function with an n8n webhook/API integration later:
 * e.g., fetch(`${N8N_WEBHOOK_URL}/agent-activity`, { method: 'GET' })
 */
export async function getAgentActivity(): Promise<AgentActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...localActivity];
}

/**
 * Fetch replenishment queue requests.
 */
export async function getReplenishmentQueue(): Promise<ReplenishmentRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...localReplenishmentQueue];
}

/**
 * Update replenishment request status.
 */
export async function updateReplenishmentStatus(
  id: string,
  newStatus: ReplenishmentRequest['status']
): Promise<ReplenishmentRequest | null> {
  let updated: ReplenishmentRequest | null = null;
  localReplenishmentQueue = localReplenishmentQueue.map((req) => {
    if (req.id === id) {
      updated = { ...req, status: newStatus };
      return updated;
    }
    return req;
  });

  if (updated) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localActivity = [
      {
        id: `act-${Date.now()}`,
        timestamp: timeString,
        title: `PO ${id} status: ${newStatus}`,
        description: `${(updated as ReplenishmentRequest).productName} replenishment updated to ${newStatus}.`,
        type: newStatus === 'Completed' ? 'verification' : 'recommendation',
      },
      ...localActivity,
    ];
  }

  return updated;
}

/**
 * Add product to local inventory
 */
export async function addProductToInventory(product: Omit<Product, 'id' | 'stockCoverage' | 'risk' | 'recommendedAction' | 'recommendedQuantity'>): Promise<Product> {
  const stockCoverage = Number((product.currentStock / Math.max(product.dailyOrders, 1)).toFixed(1));
  let risk: RiskLevel = 'LOW';
  let recommendedAction = 'Monitor';
  let recommendedQuantity = 0;

  if (stockCoverage <= product.supplierLeadTime + 1 || (stockCoverage <= 4 && product.demandTrend === 'Increasing')) {
    risk = 'HIGH';
    recommendedQuantity = Math.round(product.dailyOrders * (product.supplierLeadTime + 3));
    recommendedAction = `Replenish ${recommendedQuantity} units`;
  } else if (stockCoverage <= product.supplierLeadTime * 1.8) {
    risk = 'MEDIUM';
    recommendedQuantity = Math.round(product.dailyOrders * (product.supplierLeadTime + 1));
    recommendedAction = 'Review';
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...product,
    stockCoverage,
    risk,
    recommendedAction,
    recommendedQuantity,
    sparkline: [
      Math.max(5, product.dailyOrders - 8),
      Math.max(5, product.dailyOrders - 5),
      Math.max(5, product.dailyOrders - 2),
      product.dailyOrders,
      product.demandTrend === 'Increasing' ? product.dailyOrders + 4 : product.dailyOrders,
      product.demandTrend === 'Increasing' ? product.dailyOrders + 8 : product.dailyOrders,
    ],
  };

  localProducts = [newProduct, ...localProducts];

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  localActivity = [
    {
      id: `act-${Date.now()}`,
      timestamp: timeString,
      title: `Added product: ${newProduct.name}`,
      description: `New SKU cataloged with initial stock of ${newProduct.currentStock} units.`,
      type: 'detection',
      productId: newProduct.id,
    },
    ...localActivity,
  ];

  return newProduct;
}
