// Return a list of `params` to populate the [tcg] dynamic segment
import { getSets, getTCGs } from '@/app/actions';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumb.tsx';

export async function generateStaticParams() {
  const tcgs = await getTCGs();
  return tcgs.map((tcg) => ({
    tcg: tcg.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ tcg: string }>;
}) {
  const { tcg } = await params;
  const tcgs = await getTCGs();
  const currentTcg = tcgs.find((t) => t.slug === tcg);

  if (!currentTcg?.id) {
    return (
      <div className='min-h-screen w-full bg-gray-50 flex items-center justify-center'>
        <main className='container mx-auto px-6 py-8'>
          <Breadcrumb
            items={[
              {
                label: 'TCG',
                active: true,
              },
            ]}
          />
          <div className='text-center py-12 bg-white rounded-lg shadow'>
            <p className='text-gray-500'>Trading card game not found.</p>
          </div>
        </main>
      </div>
    );
  }

  const sets = await getSets(currentTcg.id);
  const filteredSets = sets;

  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <main className='container mx-auto px-6 py-8'>
        {/* Breadcrumb navigation */}
        <Breadcrumb
          items={[
            {
              label: currentTcg?.name || 'TCG',
              active: true,
            },
          ]}
        />

        <div className='mt-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-700 mb-2'>
            Browse Sets
          </h2>
          <p className='text-gray-500'>
            Showing {filteredSets.length} sets from{' '}
            {currentTcg?.name || 'this TCG'}
          </p>
        </div>

        {filteredSets.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-lg shadow'>
            <p className='text-gray-500'>
              No sets available for this trading card game.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {filteredSets.map((set) => (
              <Link
                href={`/${tcg}/singles/${set.slug}`}
                key={set.id}
                className='bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col p-4 items-center text-center'
              >
                {/* Optionally add set symbol or image here if available */}
                <div className='flex-1 flex flex-col justify-center items-center'>
                  <h3
                    className='text-base font-medium text-gray-800 mb-1 truncate'
                    title={set.name}
                  >
                    {set.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
