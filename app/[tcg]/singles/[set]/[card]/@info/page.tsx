import Image from 'next/image';
import { getCard } from '@/app/actions';
import Link from 'next/link';
import PriceChart from '@/app/components/PriceChart';

export default async function Page({
  params,
}: {
  params: Promise<{ tcg: string; card: string }>;
}) {
  const { card, tcg } = await params;
  const data = await getCard(card);

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
    { label: 'Available items', value: '800' },
    { label: 'From', value: 'R1200' },
    { label: '30 day average', value: 'R1200' },
    { label: '7 day average', value: 'R1200' },
    { label: '1 day average', value: 'R1200' },
  ];

  return (
    <div className='gap-4 flex flex-col'>
      <div className='bg-white p-6 border-gray-200 border rounded-lg'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Card Image */}
          <div className='flex-shrink-0'>
            {data.images?.large ? (
              <Image
                src={data.images.large}
                alt={data.name}
                width={200}
                height={280}
                className='rounded-md shadow-sm'
              />
            ) : (
              <div className='w-[200px] h-[280px] bg-gray-200 rounded-md flex items-center justify-center'>
                <span className='text-gray-400'>No image</span>
              </div>
            )}
          </div>

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
            <PriceChart days={30} basePrice={1200} currencySymbol='R' />
          </div>
        </div>
      </div>
    </div>
  );
}
