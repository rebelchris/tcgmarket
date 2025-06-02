import Image from 'next/image';
import { getCard, getListingsByCard } from '@/app/actions';
import Link from 'next/link';
import PriceChart from '@/app/components/PriceChart';

type Listing = {
  price: number;
  quantity: number;
  created_at: string;
};

type PriceDataPoint = {
  day: number;
  price: number;
};

function filterByDays(listings: Listing[], days: number): Listing[] {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);
  return listings.filter((l) => new Date(l.created_at) >= cutoff);
}

function weightedAverage(listings: Listing[]): number {
  const totalQuantity = listings.reduce((sum, l) => sum + (l.quantity || 0), 0);
  const totalValue = listings.reduce(
    (sum, l) => sum + l.price * (l.quantity || 0),
    0
  );
  return totalQuantity > 0 ? totalValue / totalQuantity : 0;
}

function getPriceTrendData(
  listings: Listing[],
  days: number
): PriceDataPoint[] {
  const now = new Date();
  // Create an array for each day, 0 = oldest (30 days ago), days = today
  const dayBuckets: { day: number; prices: number[] }[] = Array.from(
    { length: days + 1 },
    (_, i) => ({
      day: i,
      prices: [],
    })
  );

  listings.forEach((listing) => {
    const created = new Date(listing.created_at);
    // Compare only the calendar day
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdDate = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate()
    );
    const diffDays = Math.floor(
      (nowDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
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
              100
          ) / 100
        : 0,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ tcg: string; card: string }>;
}) {
  const { card, tcg } = await params;
  const data = await getCard(card);
  const listings = await getListingsByCard(card);

  // Normalize listings to correct types for calculations
  const normalizedListings: Listing[] = listings.map((l) => {
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

  const availableItems = normalizedListings.reduce(
    (sum, l) => sum + (l.quantity || 0),
    0
  );

  const avg30 = weightedAverage(filterByDays(normalizedListings, 30));
  const avg7 = weightedAverage(filterByDays(normalizedListings, 7));
  const avg1 = weightedAverage(filterByDays(normalizedListings, 1));

  const priceTrendData = getPriceTrendData(normalizedListings, 30);

  if (!data) {
    return <p className='text-center py-4 text-gray-500'>Card not found</p>;
  }

  const cardData = [
    { label: 'Rarity', value: data.rarity },
    {
      label: 'Set',
      value: (
        <Link
          href={`/${tcg}/singles/${data.set?.slug}`}
          className='text-blue-600 hover:text-blue-800 hover:underline'
        >
          {data.set?.name}
        </Link>
      ),
    },
    { label: 'Number', value: data.number },
    { label: 'Available items', value: availableItems },
    { label: 'From', value: 'R1200' },
    { label: '30 day average', value: `R${avg30.toFixed(2)}` },
    { label: '7 day average', value: `R${avg7.toFixed(2)}` },
    { label: '1 day average', value: `R${avg1.toFixed(2)}` },
  ];

  return (
    <div className='gap-4 flex flex-col'>
      <div className='bg-white p-6 border-gray-200 border rounded-lg'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Card Details */}
          <div className='flex-grow'>
            <dl className='space-y-3'>
              {cardData.map(({ label, value }) => (
                <div
                  key={label}
                  className='flex items-center py-2 border-b border-gray-100'
                >
                  <dt className='w-1/3 font-semibold text-gray-600'>{label}</dt>
                  <dd className='w-2/3 text-gray-900'>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Price Trend Graph */}
          <div className='flex-shrink-0 min-w-[300px] border-l border-gray-100 pl-6'>
            <h3 className='font-semibold text-gray-700 mb-2'>
              Price Trend (30 days)
            </h3>
            <PriceChart data={priceTrendData} days={30} currencySymbol='R' />
          </div>
        </div>
      </div>
    </div>
  );
}
