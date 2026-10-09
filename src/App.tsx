import React, { useState, useEffect } from 'react';
import {
  Product,
  ReplenishmentRequest,
  AgentActivity,
  AgentMode,
  RiskAnalysisResult,
  DemandTrend,
} from './types';
import {
  getInventoryData,
  getReplenishmentQueue,
  getAgentActivity,
  createReplenishmentRequest,
  updateReplenishmentStatus,
  addProductToInventory,
} from './services/inventoryService';
import {
  INITIAL_PRODUCTS,
  INITIAL_REPLENISHMENT_REQUESTS,
  INITIAL_ACTIVITY,
} from './data/mockData';

import { Sidebar, NavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { AnalyzeModal } from './components/AnalyzeModal';
import { AddProductModal } from './components/AddProductModal';

import { DashboardView } from './pages/DashboardView';
import { InventoryView } from './pages/InventoryView';
import { RiskAnalysisView } from './pages/RiskAnalysisView';
import { ReplenishmentView } from './pages/ReplenishmentView';
import { ActivityView } from './pages/ActivityView';
import { SettingsView } from './pages/SettingsView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Core Data Stores
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [replenishmentQueue, setReplenishmentQueue] = useState<ReplenishmentRequest[]>(INITIAL_REPLENISHMENT_REQUESTS);
  const [activities, setActivities] = useState<AgentActivity[]>(INITIAL_ACTIVITY);
  const [agentMode, setAgentMode] = useState<AgentMode>('Recommend');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-handbag');

  // Modals & User Flows
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [prefillProduct, setPrefillProduct] = useState<Product | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Data
  useEffect(() => {
    async function loadInitialData() {
      const [prods, queue, acts] = await Promise.all([
        getInventoryData(),
        getReplenishmentQueue(),
        getAgentActivity(),
      ]);
      setProducts(prods);
      setReplenishmentQueue(queue);
      setActivities(acts);

      // Default selected product to handbag if present
      const handbag = prods.find((p) => p.name.toLowerCase().includes('handbag'));
      if (handbag) {
        setSelectedProductId(handbag.id);
      }
    }
    loadInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open Analyze modal for a given product
  const handleAnalyzeProduct = (product: Product) => {
    setPrefillProduct(product);
    setSelectedProductId(product.id);
    setIsDemoMode(product.name.toLowerCase().includes('handbag'));
    setIsAnalyzeModalOpen(true);
  };

  // Quick Demo: Handbag Scenario
  const handleTriggerDemo = () => {
    const handbag =
      products.find((p) => p.name.toLowerCase().includes('handbag')) || products[0];
    if (handbag) {
      setSelectedProductId(handbag.id);
      setPrefillProduct(handbag);
    }
    setIsDemoMode(true);
    setIsAnalyzeModalOpen(true);
  };

  // Direct Replenish from table
  const handleReplenishProduct = async (product: Product) => {
    const req = await createReplenishmentRequest({
      productId: product.id,
      productName: product.name,
      risk: product.risk,
      quantity: product.recommendedQuantity || 150,
      reason: `Stock coverage of ${product.stockCoverage} days is critical against ${product.supplierLeadTime}-day supplier lead time.`,
    });

    const [updatedQueue, updatedActs] = await Promise.all([
      getReplenishmentQueue(),
      getAgentActivity(),
    ]);
    setReplenishmentQueue(updatedQueue);
    setActivities(updatedActs);
    showToast(`Replenishment request for ${product.name} created successfully.`);
  };

  // Replenish from within AnalyzeModal
  const handleInitiateReplenishmentFromModal = async (analysis: RiskAnalysisResult) => {
    await createReplenishmentRequest({
      productId: analysis.productId,
      productName: analysis.productName,
      risk: analysis.risk,
      quantity: analysis.recommendedQuantity,
      reason: analysis.reason,
    });

    // Refresh state
    const [updatedQueue, updatedActs, updatedProds] = await Promise.all([
      getReplenishmentQueue(),
      getAgentActivity(),
      getInventoryData(),
    ]);
    setReplenishmentQueue(updatedQueue);
    setActivities(updatedActs);
    setProducts(updatedProds);
    showToast(`Replenishment request created successfully.`);
  };

  // Create replenishment request from queue card button
  const handleCreateReplenishmentRequest = async (req: ReplenishmentRequest) => {
    await updateReplenishmentStatus(req.id, 'Approved');
    const [updatedQueue, updatedActs] = await Promise.all([
      getReplenishmentQueue(),
      getAgentActivity(),
    ]);
    setReplenishmentQueue(updatedQueue);
    setActivities(updatedActs);
  };

  // Advance Replenishment Status (Approved -> Processing -> Completed)
  const handleAdvanceStatus = async (
    id: string,
    nextStatus: ReplenishmentRequest['status']
  ) => {
    await updateReplenishmentStatus(id, nextStatus);
    const [updatedQueue, updatedActs] = await Promise.all([
      getReplenishmentQueue(),
      getAgentActivity(),
    ]);
    setReplenishmentQueue(updatedQueue);
    setActivities(updatedActs);
    showToast(`Order status updated to ${nextStatus}.`);
  };

  // Add new product
  const handleAddProduct = async (productData: {
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    dailyOrders: number;
    supplierLeadTime: number;
    demandTrend: DemandTrend;
    pendingOrders?: number;
  }) => {
    const created = await addProductToInventory(productData);
    const [updatedProds, updatedActs] = await Promise.all([
      getInventoryData(),
      getAgentActivity(),
    ]);
    setProducts(updatedProds);
    setActivities(updatedActs);
    setSelectedProductId(created.id);
    showToast(`Product ${created.name} added to inventory catalog.`);
  };

  const highRiskCount = products.filter((p) => p.risk === 'HIGH').length;
  const replenishmentPendingCount = replenishmentQueue.filter(
    (r) => r.status === 'Recommended'
  ).length;

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        highRiskCount={highRiskCount}
        replenishmentPendingCount={replenishmentPendingCount}
      />

      {/* Main Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopNav
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onOpenAnalyzeModal={() => {
            setPrefillProduct(null);
            setIsDemoMode(false);
            setIsAnalyzeModalOpen(true);
          }}
          onTriggerDemo={handleTriggerDemo}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              replenishmentQueue={replenishmentQueue}
              activities={activities}
              agentMode={agentMode}
              onAgentModeChange={setAgentMode}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
              onAnalyzeProduct={handleAnalyzeProduct}
              onReplenishProduct={handleReplenishProduct}
              onCreateReplenishmentRequest={handleCreateReplenishmentRequest}
              onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
              onAnalyzeProduct={handleAnalyzeProduct}
              onReplenishProduct={handleReplenishProduct}
            />
          )}

          {activeTab === 'risk-analysis' && (
            <RiskAnalysisView
              products={products}
              onAnalyzeProduct={handleAnalyzeProduct}
              onReplenishProduct={handleReplenishProduct}
            />
          )}

          {activeTab === 'replenishment' && (
            <ReplenishmentView
              queue={replenishmentQueue}
              onAdvanceStatus={handleAdvanceStatus}
              onOpenAnalyzeModal={() => {
                setPrefillProduct(null);
                setIsAnalyzeModalOpen(true);
              }}
            />
          )}

          {activeTab === 'activity' && <ActivityView activities={activities} />}

          {activeTab === 'settings' && (
            <SettingsView
              agentMode={agentMode}
              onAgentModeChange={setAgentMode}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#16233B] px-6 py-4 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-mono text-slate-400">
              RISKORA © 2026 — Agentic AI Inventory Replenishment System
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="text-indigo-400 font-semibold font-mono">
                Predict · Reason · Act · Replenish
              </span>
              <span>·</span>
              <span className="text-slate-400">Autonomous Supply Chain Intelligence</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Product Risk Analysis Modal */}
      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onClose={() => setIsAnalyzeModalOpen(false)}
        prefillProduct={prefillProduct}
        onInitiateReplenishment={handleInitiateReplenishmentFromModal}
        availableProducts={products}
        isDemoMode={isDemoMode}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0F172A] border border-indigo-500/40 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
