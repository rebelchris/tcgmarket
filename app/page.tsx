import React from 'react';
import Link from 'next/link';
import { getTCGs } from '@/app/actions';
import Image from 'next/image';

export default async function LandingPage() {
  const data = await getTCGs();

  return (
    <div className='bg-gradient-to-b from-white to-gray-50'>
      <header className='bg-white shadow-sm py-6'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-bold text-gray-800'>TCG Market</h1>
          <p className='text-gray-600 mt-2'>
            Your marketplace for trading card game singles
          </p>
        </div>
      </header>

      <main className='container mx-auto py-12 px-4'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-8 text-center'>
          Choose your game
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {data.map((tcg) => (
            <Link
              key={tcg.id}
              href={`/${tcg.slug}`}
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group'
            >
              <div className='h-48 bg-gray-100 flex items-center justify-center p-4 relative'>
                {tcg.logo ? (
                  <Image
                    src={tcg.logo}
                    alt={`${tcg.name} Logo`}
                    width={200}
                    height={200}
                    className='h-40 object-contain group-hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <div className='w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-gray-400'>
                      {tcg.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  {tcg.name}
                </h3>
                <div className='mt-4 text-blue-600 group-hover:text-blue-800 font-medium flex items-center'>
                  Browse cards
                  <svg
                    className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 5l7 7m0 0l-7 7m7-7H3'
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {data.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>
              No trading card games available right now.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
