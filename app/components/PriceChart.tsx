'use client';

import React, { useState } from 'react';

interface PriceDataPoint {
  day: number;
  price: number;
}

interface PriceChartProps {
  data?: PriceDataPoint[];
  days?: number;
  basePrice?: number;
  currencySymbol?: string;
  width?: number;
  height?: number;
}

// Generate static data with a predictable sine wave pattern
const generatePriceData = (days = 30, basePrice = 1200): PriceDataPoint[] => {
  const data: PriceDataPoint[] = [];

  for (let i = 0; i <= days; i += 1) {
    // Use a sine wave pattern for predictable price fluctuation
    const fluctuation = Math.sin(i * 0.5) * (basePrice * 0.05);
    const price = Math.round(basePrice + fluctuation);
    data.push({
      day: days - i, // Reverse so day 0 is today
      price,
    });
  }
  return data;
};

// Function to convert price data to SVG path
const createPricePath = (
  priceData: PriceDataPoint[],
  width: number,
  height: number
): string => {
  const maxPrice = Math.max(...priceData.map((d) => d.price));
  const minPrice = Math.min(...priceData.map((d) => d.price));
  const range = maxPrice - minPrice;
  const padding = range * 0.1; // 10% padding

  // Create the path
  const points = priceData.map((d, i) => {
    const x = (i / (priceData.length - 1)) * width;
    const y =
      height -
      ((d.price - minPrice + padding) / (range + padding * 2)) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
};

// Get Y coordinate for a data point
const getYCoordinate = (
  price: number,
  minPrice: number,
  range: number,
  height: number
): number => {
  const padding = range * 0.1;
  return (
    height - ((price - minPrice + padding) / (range + padding * 2)) * height
  );
};

// Default props to satisfy linter
const defaultProps = {
  data: undefined,
  days: 30,
  basePrice: 1200,
  currencySymbol: 'R',
  width: 300,
  height: 100,
};

export default function PriceChart({
  data,
  days = 30,
  basePrice = 1200,
  currencySymbol = 'R',
  width = 300,
  height = 100,
}: PriceChartProps) {
  // Use provided data or generate static data
  const priceData = data || generatePriceData(days, basePrice);
  const pricePath = createPricePath(priceData, width, height);

  const minPrice = Math.min(...priceData.map((d) => d.price));
  const maxPrice = Math.max(...priceData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;

  // State for the active data point index
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Divide the svg width into segments for hover detection
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();

    // Calculate relative x position
    const relativeX = e.clientX - rect.left;

    // Map x position to discrete data point index
    const segmentWidth = width / priceData.length;
    const dataIndex = Math.min(
      Math.floor(relativeX / segmentWidth),
      priceData.length - 1
    );

    // Ensure index is in bounds
    if (dataIndex >= 0 && dataIndex < priceData.length) {
      setActivePointIndex(dataIndex);
    }
  };

  const handleMouseLeave = () => {
    setActivePointIndex(null);
  };

  return (
    <div className='bg-white rounded-lg p-2 relative'>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className='overflow-visible'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Price trend line */}
        <path
          d={pricePath}
          fill='none'
          stroke='#3b82f6'
          strokeWidth='2'
          strokeLinejoin='round'
        />

        {/* Gradient area under the line */}
        <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.2' />
          <stop offset='100%' stopColor='#3b82f6' stopOpacity='0' />
        </linearGradient>

        <path
          d={`${pricePath} L ${width},${height} L 0,${height} Z`}
          fill='url(#gradient)'
        />

        {/* X-axis */}
        <line
          x1='0'
          y1={height}
          x2={width}
          y2={height}
          stroke='#e5e7eb'
          strokeWidth='1'
        />

        {/* Y-axis */}
        <line
          x1='0'
          y1='0'
          x2='0'
          y2={height}
          stroke='#e5e7eb'
          strokeWidth='1'
        />

        {/* Hover indicator */}
        {activePointIndex !== null && (
          <>
            {/* Vertical line at hover position */}
            <line
              x1={(activePointIndex / (priceData.length - 1)) * width}
              y1='0'
              x2={(activePointIndex / (priceData.length - 1)) * width}
              y2={height}
              stroke='#9ca3af'
              strokeWidth='1'
              strokeDasharray='2,2'
            />

            {/* Data point indicator circle */}
            <circle
              cx={(activePointIndex / (priceData.length - 1)) * width}
              cy={getYCoordinate(
                priceData[activePointIndex].price,
                minPrice,
                priceRange,
                height
              )}
              r='4'
              fill='#3b82f6'
              stroke='#fff'
              strokeWidth='2'
            />
          </>
        )}
      </svg>

      {/* Hover tooltip */}
      {activePointIndex !== null && (
        <div
          className='absolute bg-white border border-gray-200 rounded px-2 py-1 shadow-sm text-xs transform -translate-x-1/2 -translate-y-full pointer-events-none z-10'
          style={{
            left: `${(activePointIndex / (priceData.length - 1)) * width}px`,
            top: `${
              getYCoordinate(
                priceData[activePointIndex].price,
                minPrice,
                priceRange,
                height
              ) - 15
            }px`,
          }}
        >
          <div className='font-medium'>
            {days - priceData[activePointIndex].day} days ago
          </div>
          <div>
            {currencySymbol}
            {priceData[activePointIndex].price}
          </div>
        </div>
      )}

      {/* Price range display */}
      <div className='flex justify-between text-xs text-gray-500 mt-2'>
        <span>{days} days ago</span>
        <span>Today</span>
      </div>
      <div className='flex justify-between text-xs text-gray-500 mt-4'>
        <span>
          Low: {currencySymbol}
          {minPrice}
        </span>
        <span>
          High: {currencySymbol}
          {maxPrice}
        </span>
      </div>
    </div>
  );
}

// Assign default props to satisfy linter
PriceChart.defaultProps = defaultProps;
