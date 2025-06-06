import React from 'react';
import { getTCG, getCard } from '@/app/actions';
import Breadcrumb from '@/app/components/Breadcrumb';
import Image from 'next/image';
import { auth } from 'auth';
import CardTabs from './CardTabs';

export default async function Layout({
  info,
  sell,
  wants,
  listings,
  params,
}: {
  info: React.ReactNode;
  sell: React.ReactNode;
  wants: React.ReactNode;
  listings: React.ReactNode;
  params: Promise<{
    tcg: string;
    set: string;
    card: string;
  }>;
}) {
  const { tcg, set, card } = await params;

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

  const session = await auth();

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
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-row">
          {/* Left: Card Image */}
          <div className="flex-shrink-0 p-6 border-r border-gray-100 flex flex-col items-center">
            {cardData?.images?.large ? (
              <Image
                src={cardData.images.large}
                alt={cardData.name}
                width={200}
                height={280}
                className="rounded-md shadow-sm"
              />
            ) : (
              <div className="w-[200px] h-[280px] bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          {/* Right: Tabs and Content */}
          <div className="flex-grow p-6">
            <CardTabs
              info={info}
              sell={sell}
              wants={wants}
              user={session?.user}
            />
          </div>
        </div>
        {/* Listings always below */}
        <div className="p-6 border-t border-gray-100">{listings}</div>
      </div>
    </div>
  );
}
