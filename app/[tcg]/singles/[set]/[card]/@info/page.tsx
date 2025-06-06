import { getCard, getListingsByCard } from '@/app/actions';
import Link from 'next/link';
import PriceTrends from '@/app/components/PriceTrends';
import CardImageResponsive from '@/app/components/CardImageResponsive';

type Listing = {
  price: number;
  quantity: number;
  created_at: string;
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
    0,
  );
  return totalQuantity > 0 ? totalValue / totalQuantity : 0;
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
    0,
  );

  const avg30 = weightedAverage(filterByDays(normalizedListings, 30));
  const avg7 = weightedAverage(filterByDays(normalizedListings, 7));
  const avg1 = weightedAverage(filterByDays(normalizedListings, 1));


  if (!data) {
    return <p className="text-center py-4 text-gray-500">Card not found</p>;
  }

  const cardData = [
    { label: 'Rarity', value: data.rarity },
    {
      label: 'Set',
      value: (
        <Link
          href={`/${tcg}/singles/${data.set?.slug}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
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
    <div className="gap-4 flex flex-col">
      <div className="bg-white p-6 border-gray-200 border rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card Details */}
          <div className="flex-grow">
            <CardImageResponsive src={data.images?.large ?? ''} alt={data.name} hideDesktop />
            <dl className="space-y-3">
              {cardData.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center py-2 border-b border-gray-100"
                >
                  <dt className="w-1/3 font-semibold text-gray-600">{label}</dt>
                  <dd className="w-2/3 text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <PriceTrends listings={normalizedListings} hideMobile />
        </div>
      </div>
    </div>
  );
}
