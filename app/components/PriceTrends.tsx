'use client'

import { ReactNode } from 'react';
import { useMediaQuery } from '@kickass-coderz/react';
import PriceChart from './PriceChart';

type Listing = {
    price: number;
    quantity: number;
    created_at: string;
  };
  
  type PriceDataPoint = {
    day: number;
    price: number;
  };

function getPriceTrendData(
  listings: Listing[],
  days: number,
): PriceDataPoint[] {
  const now = new Date();
  // Create an array for each day, 0 = oldest (30 days ago), days = today
  const dayBuckets: { day: number; prices: number[] }[] = Array.from(
    { length: days + 1 },
    (_, i) => ({
      day: i,
      prices: [],
    }),
  );
  
  listings.forEach((listing) => {
    const created = new Date(listing.created_at);
    // Compare only the calendar day
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdDate = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate(),
    );
    const diffDays = Math.floor(
      (nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const bucketIndex = days - diffDays;
    if (bucketIndex >= 0 && bucketIndex <= days) {
      let i = 0;
      while (i < (listing.quantity || 1)) {
        dayBuckets[bucketIndex].prices.push(listing.price);
        i += 1;
      }
    }
  });
  
  return dayBuckets.map((bucket) => ({
    day: bucket.day,
    price:
        bucket.prices.length > 0
          ? Math.round(
            (bucket.prices.reduce((a, b) => a + b, 0) / bucket.prices.length) *
                100,
          ) / 100
          : 0,
  }));
}

export default function PriceTrends({ listings, hideMobile = false }: { listings: Listing[], hideMobile?: boolean }): ReactNode {
  const { matches } = useMediaQuery('(max-width: 1024px)', { initialValue: false })

  // Normalize listings to correct types for calculations
  const normalizedListings: Listing[] = listings.map((l: Listing) => {
    let createdAtString: string;
    if (!l.created_at) {
      createdAtString = new Date().toISOString();
    } else if (typeof l.created_at === 'string') {
      createdAtString = l.created_at;
    } else {
      createdAtString = new Date(l.created_at).toISOString();
    }
    return {
      price: typeof l.price === 'string' ? parseFloat(l.price) : l.price,
      quantity: l.quantity ?? 1,
      created_at: createdAtString,
    };
  });

  const priceTrendData = getPriceTrendData(normalizedListings, 30);
  
  if (hideMobile && matches) return null;
  return (
    <div className="flex-shrink-0 min-w-[300px] border-l border-gray-100 pl-6">
      <h3 className="font-semibold text-gray-700 mb-2">
      Price Trend (30 days)
      </h3>
      <PriceChart data={priceTrendData} days={30} currencySymbol="R" />
    </div>);
}