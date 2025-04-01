import React from 'react';
import { getTCG, getCard } from '@/app/actions';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumb.tsx';

export default async function Layout({
  info,
  listings,
  params,
}: {
  info: React.ReactNode;
  listings: React.ReactNode;
  params: {
    tcg: string;
    set: string;
    card: string;
  };
}) {
  const { tcg, set, card } = params;

  // Fetch data for breadcrumbs if available
  let tcgData;
  let cardData;
  try {
    tcgData = await getTCG(tcg);
    cardData = await getCard(card);
  } catch (error) {
    // Handle error silently
    console.error('Error fetching breadcrumb data:', error);
  }

  // Create breadcrumb items for display
  const breadcrumbItems = [
    {
      label: tcgData?.name || tcg,
      href: `/${tcg}`,
    },
    {
      label: 'Singles',
      href: `/${tcg}/singles`,
    },
    {
      label: cardData?.set?.name || set,
      href: `/${tcg}/singles/${set}`,
    },
    {
      label: cardData?.name || card,
      active: true,
    },
  ];

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Breadcrumb navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div className='mt-6 bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200'>
          <div className='px-6 py-4 sm:px-6'>
            <h1 className='text-xl font-semibold text-gray-800'>
              {cardData?.searchName || 'Card Details'}
            </h1>
          </div>
        </div>

        <div className='p-6'>
          <div className='flex flex-col space-y-6'>{info}</div>
          <div className='mt-6'>{listings}</div>
        </div>
      </div>
    </div>
  );
}
