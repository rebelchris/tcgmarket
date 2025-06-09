import { getListingsByCard } from '@/app/actions';
import { auth } from 'auth';
import ListingTable from './ListingTable';

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

  return <ListingTable listings={listings} userListings={userListings} otherListings={otherListings} tcg={tcg} />;
}
