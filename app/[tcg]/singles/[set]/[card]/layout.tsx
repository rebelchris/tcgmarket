import React from 'react';
import { getTCG, getCard } from '@/app/actions';
import Breadcrumb from '@/app/components/Breadcrumb';
import { auth } from 'auth';
import CardTabs from './CardTabs';
import CardImageResponsive from '../../../../components/CardImageResponsive';

export default async function Layout({
  info,
  sell,
  wants,
  chart,
  listings,
  params,
}: {
  info: React.ReactNode;
  sell: React.ReactNode;
  wants: React.ReactNode;
  chart: React.ReactNode;
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
          <CardImageResponsive src={cardData?.images?.large ?? ''} alt={cardData?.name ?? ''} hideMobile />
          {/* Right: Tabs and Content */}
          <div className="flex-grow p-6">
            <CardTabs
              info={info}
              sell={sell}
              wants={wants}
              chart={chart}
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
