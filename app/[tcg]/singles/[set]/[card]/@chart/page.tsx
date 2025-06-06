import { getListingsByCard } from '@/app/actions';
import PriceTrends from '@/app/components/PriceTrends';
import React from 'react';

interface ListingRaw {
  price: string | number;
  quantity?: number | null;
  created_at?: string | Date | null;
}

export default async function ChartPanel({
  params,
}: {
  params: Promise<{ tcg: string; card: string }>;
}) {
  const { card } = await params;
  const listings = await getListingsByCard(card);
  const normalizedListings = listings.map((l: ListingRaw) => {
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
  return (
    <PriceTrends listings={normalizedListings} />
  );
}
