import React, { useState } from 'react';
import { Product } from '../types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface DemandChartProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
}

export const DemandChart: React.FC<DemandChartProps> = ({
  products = [],
  selectedProductId,
  onSelectProduct,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fallback demo product if products list is not loaded yet
  const defaultFallbackProduct: Product = {
    id: 'prod-handbag',
    name: 'Leather Handbag',
    sku: 'HB-LUX-001',
    category: 'Accessories',
    currentStock: 100,
    dailyOrders: 25,
    stockCoverage: 4.0,
    supplierLeadTime: 3,
    demandTrend: 'Increasing',
    risk: 'HIGH',
    recommendedAction: 'Replenish 150 units',
    recommendedQuantity: 150,
    sparkline: [10, 12, 15, 18, 25, 30],
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ||
    products[0] ||
    defaultFallbackProduct;

  // Realistic sample order progression
  // Specifically for demo Handbag: Day 1: 10, Day 2: 12, Day 3: 15, Day 4: 18, Day 5: 25, Day 6: 30
  const handbagData = [
    { day: 'Day 1', orders: 10 },
    { day: 'Day 2', orders: 12 },
    { day: 'Day 3', orders: 15 },
    { day: 'Day 4', orders: 18 },
    { day: 'Day 5', orders: 25 },
    { day: 'Day 6', orders: 30 },
  ];

  const isHandbag = selectedProduct?.name?.toLowerCase().includes('handbag');

  const chartData = isHandbag
    ? handbagData
    : (selectedProduct?.sparkline || [15, 18, 20, 22, 28, 32]).map((val, i) => ({
        day: `Day ${i + 1}`,
        orders: val,
      }));

  // Chart dimensions
  const width = 640;
  const height = 210;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const maxVal = Math.max(...chartData.map((d) => d.orders), 35);
  const minVal = 0;

  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (width - paddingX * 2);
    const y =
      paddingTop + (1 - (d.orders - minVal) / (maxVal - minVal)) * (height - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  const isSpike =
    chartData[chartData.length - 1].orders >= chartData[0].orders * 1.5 ||
    selectedProduct?.demandTrend === 'Increasing';

  return (
    <div className="rounded-xl bg-[#0C1322] border border-[#1A263D] p-5 sm:p-6">
      {/* Header with Title and Product Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1A263D] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Demand Trend
            </h3>
            {isSpike && (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
                <AlertCircle className="h-3 w-3" />
                <span>Demand spike detected</span>
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Recent order activity for the selected product.
          </p>
        </div>

        {/* Product selector dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="product-select" className="text-xs text-slate-400 font-medium">
            Product:
          </label>
          <select
            id="product-select"
            value={selectedProductId}
            onChange={(e) => onSelectProduct(e.target.value)}
            className="rounded-lg bg-[#0F1728] border border-[#1E2D4A] px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.risk} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs">
        <div>
          <span className="text-slate-400">Current Velocity:</span>{' '}
          <span className="font-bold text-white font-mono tabular-nums">
            {chartData[chartData.length - 1].orders} orders/day
          </span>
        </div>
        <div>
          <span className="text-slate-400">6-Day Change:</span>{' '}
          <span className="font-bold text-rose-400 font-mono tabular-nums flex-inline items-center gap-1">
            <TrendingUp className="inline h-3 w-3 ml-1" />+
            {Math.round(
              ((chartData[chartData.length - 1].orders - chartData[0].orders) /
                chartData[0].orders) *
                100
            )}
            %
          </span>
        </div>
        <div>
          <span className="text-slate-400">Demand:</span>{' '}
          <span className="text-slate-200 font-bold font-mono">Increasing</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="mt-4 relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30].map((tick) => {
            const y =
              paddingTop +
              (1 - (tick - minVal) / (maxVal - minVal)) *
                (height - paddingTop - paddingBottom);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#172338"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible hover target */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                {/* Point dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#FFFFFF' : '#818CF8'}
                  stroke="#4F46E5"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* X-axis label */}
                <text
                  x={pt.x}
                  y={height - 12}
                  fill="#94A3B8"
                  fontSize="11"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {pt.day}
                </text>

                {/* Tooltip on point */}
                {isHovered && (
                  <g>
                    <rect
                      x={pt.x - 32}
                      y={pt.y - 30}
                      width="64"
                      height="22"
                      rx="4"
                      fill="#0B1322"
                      stroke="#4F46E5"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      fill="#FFFFFF"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                      className="font-mono tabular-nums"
                    >
                      {pt.orders} orders
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
