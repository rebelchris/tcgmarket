import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/app/components/Breadcrumb';
import { getUserCardsForTCG } from '@/app/actions';

export default async function Page({
  params,
}: {
  params: Promise<{ tcg: string; user: string }>;
}) {
  const { tcg, user } = await params;
  const userCards = await getUserCardsForTCG(tcg, user);

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumb
        items={[
          {
            label: tcg.charAt(0).toUpperCase() + tcg.slice(1),
            href: `/${tcg}`,
          },
          { label: 'Users', href: `/${tcg}/users` },
          { label: user, active: true },
        ]}
      />
      <div className="mt-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Cards owned by {user}
        </h2>
        <p className="text-gray-500">
          Showing {userCards.length} cards for this user in {tcg}
        </p>
      </div>
      {userCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No cards found for this user.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {userCards.map((card: any) => (
            <Link
              href={`/${tcg}/singles/${card.sxetSlug}/${card.slug}`}
              key={card.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
            >
              <div className="h-40 sm:h-48 md:h-56 bg-gray-100 flex items-center justify-center p-2 relative">
                {card.images?.large ? (
                  <Image
                    src={card.images.large}
                    alt={card.name}
                    width={250}
                    height={350}
                    className="max-h-full w-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3
                  className="text-sm font-medium text-gray-800 mb-1 truncate"
                  title={card.name}
                >
                  {card.name}
                </h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {card.number}/{card.setTotal}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {card.rarity}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
