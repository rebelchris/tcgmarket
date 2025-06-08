import { getListingsByCard } from '@/app/actions';
import ConditionTag from '@/app/components/ConditionTag';
import Link from 'next/link';
import { auth } from 'auth';
import Tooltip, { TooltipProvider } from '@/app/components/Tooltip';

export default async function Page({
  params,
}: {
  params: Promise<{ tcg: string; set: string; card: string }>;
}) {
  const { tcg, card } = await params;
  const listings = await getListingsByCard(card);
  const session = await auth();
  const userId = session?.user?.id;

  let userListings: typeof listings = [];
  let otherListings: typeof listings = listings;
  if (userId) {
    userListings = listings
      .filter((l) => l.user_id === userId)
      .sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime(),
      );
    otherListings = listings.filter((l) => l.user_id !== userId);
  }

  return (
    <div className="gap-4 flex flex-col">
      <h2 className="font-bold text-xl">Available Listings</h2>
      {listings.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No listings available</p>
      ) : (
        <div className="p-6 border-gray-200 border rounded-lg">
          <TooltipProvider>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Cond.</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider"><span className='hidden md:inline-block'>Description</span></th>
                    {userListings.length > 0 && (
                      <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Options</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userListings.map((listing, index) => (
                    <tr
                      key={listing.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{listing.quantity}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">R{listing.price}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <ConditionTag condition={listing.condition ?? ''} size="sm" />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                        <Link href={`/${tcg}/users/${listing.user_id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {listing.name ?? ''}
                        </Link>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500 hidden md:table-cell">{listing.notes ?? '-'}</td>
                      <td className="px-3 py-2 md:hidden text-center">
                        <Tooltip content={listing.notes ?? '-'}>
                          <span className="inline-block text-blue-500" aria-label="Show description">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                            </svg>
                          </span>
                        </Tooltip>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500 hidden md:table-cell">
                        <div className="flex gap-2 items-center">
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs border border-gray-200">-</button>
                          <span>{listing.quantity}</span>
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs border border-gray-200">+</button>
                          <button type="button" className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs border border-gray-200">Edit</button>
                          <button type="button" className="px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-xs border border-red-200 text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {userListings.length > 0 && otherListings.length > 0 && (
                    <tr>
                      <td colSpan={userListings.length > 0 ? 6 : 5} className="py-2 text-center text-xs text-gray-400 bg-gray-100">
                        Other Sellers
                      </td>
                    </tr>
                  )}
                  {otherListings.map((listing, index) => (
                    <tr
                      key={listing.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{listing.quantity}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">R{listing.price}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <ConditionTag condition={listing.condition ?? ''} size="sm" />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                        <Link href={`/${tcg}/users/${listing.user_id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {listing.name ?? ''}
                        </Link>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500 hidden md:table-cell">{listing.notes ?? '-'}</td>
                      <td className="px-3 py-2 md:hidden text-center">
                        <Tooltip content={listing.notes ?? '-'}>
                          <span className="inline-block text-blue-500" aria-label="Show description">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                            </svg>
                          </span>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
