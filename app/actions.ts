'use server';

import 'server-only';
import { db } from '../db/drizzle';
import { cards, listings, sets, tcgs, users } from '../db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { cache } from 'react';

export const getListings = async () => {
  return await db
    .select({
      id: listings.id,
      name: cards.name,
      price: listings.price,
      email: users.email,
    })
    .from(listings)
    .innerJoin(cards, eq(listings.cardId, cards.id))
    .innerJoin(users, eq(listings.userId, users.id));
};

export const getTCGs = cache(async () => {
  return await db
    .select({
      id: tcgs.id,
      name: tcgs.name,
      slug: tcgs.slug,
      logo: tcgs.logoUrl,
    })
    .from(tcgs)
    .orderBy(tcgs.name);
});

export const getSets = cache(async () => {
  return await db
    .select({ id: sets.id, name: sets.name, slug: sets.slug })
    .from(sets);
});

export const getTCG = cache(async (slug: string) => {
  return await db.query.tcgs.findFirst({ where: eq(tcgs.slug, slug) });
});

export const getCards = async (tcgId: string) => {
  return await db
    .select({
      id: cards.id,
      name: cards.name,
      searchName: cards.searchName,
      images: cards.images,
      number: cards.number,
      rarity: cards.rarity,
      set: sets.name,
      setSlug: sets.slug,
      setTotal: sets.total,
      slug: cards.slug,
    })
    .from(cards)
    .innerJoin(sets, eq(cards.setId, sets.id))
    .where(eq(cards.tcgId, tcgId));
};

export const getCardsBySet = async (setId: string) => {
  return await db
    .select({
      id: cards.id,
      name: cards.name,
      searchName: cards.searchName,
      images: cards.images,
      number: cards.number,
      rarity: cards.rarity,
      set: sets.name,
      setSlug: sets.slug,
      setTotal: sets.total,
      slug: cards.slug,
    })
    .from(cards)
    .innerJoin(sets, eq(cards.setId, sets.id))
    .where(eq(sets.slug, setId));
};

export const getCard = cache(async (slug: string) => {
  return await db.query.cards.findFirst({
    where: eq(cards.slug, slug),
    with: {
      set: true,
    },
  });
});

export const getListingsByCard = async (slug: string) => {
  return await db
    .select({
      id: listings.id,
      price: listings.price,
      name: users.name,
      condition: listings.condition,
      quantity: listings.quantity,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(cards, eq(listings.cardId, cards.id))
    .where(eq(cards.slug, slug));
};

// export const addListing = async (newListing: any) => {
//     const session = await getServerSession(authOptions);
//     await db.insert(listings).values({
//         userId: session?.user?.id,
//         listId: 1,
//         cardId: 1,
//         ...newListing,
//     });
//     revalidatePath('/');
// };

export type SearchCard = {
  id: string;
  name: string;
  setName: string;
  setCode: string | null;
  setSlug: string | null;
  setSymbol: string | null;
  number: string | null;
  slug: string | null;
  searchName: string;
  images: { large?: string; small?: string } | null;
};

export const searchCard = async ({
  query,
  tcgId,
}: {
  query: string;
  tcgId: string;
}): Promise<SearchCard[]> => {
  const endQuery = `${query}:*`;
  const data = await db
    .select({
      id: cards.id,
      name: cards.name,
      setName: sets.name,
      setCode: sets.ptcgoid,
      setSlug: sets.slug,
      setSymbol: sets.symbolUrl,
      number: cards.number,
      slug: cards.slug,
      searchName: cards.searchName,
      images: cards.images,
    })
    .from(cards)
    .where(
      and(
        sql`to_tsvector('english', ${cards.name}) @@ to_tsquery('english', ${endQuery})`,
        eq(cards.tcgId, tcgId)
      )
    )
    .innerJoin(sets, eq(cards.setId, sets.id));
  return data;
};
