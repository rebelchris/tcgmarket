import { getListingsByCard } from '@/app/actions';
import ConditionTag from '@/app/components/ConditionTag.tsx';

export default async function Page({
  params,
}: {
  params: Promise<{ card: string }>;
}) {
  const { card } = await params;
  const listings = await getListingsByCard(card);

  return (
    <div className='gap-4 flex flex-col'>
      <h2 className='font-bold text-xl'>Available Listings</h2>
      {listings.length === 0 ? (
        <p className='text-center py-4 text-gray-500'>No listings available</p>
      ) : (
        <div className='bg-white p-6 border-gray-200 border rounded-lg'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Seller
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Condition
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Price
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Quantity
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {listings.map((listing, index) => (
                  <tr
                    key={listing.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {listing.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <ConditionTag condition={listing.condition} size='sm' />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      R{listing.price}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {listing.quantity}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <button
                        type='button'
                        className='text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs'
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
