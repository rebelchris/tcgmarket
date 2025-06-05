'use server';

import { cache } from 'react';
import { and, eq, sql } from 'drizzle-orm';
import { auth } from 'auth';
import { db } from '../db/drizzle';
import { cards, listings, sets, tcgs, users, userLists } from '../db/schema';

export const getListings = async () => {
  try {
    return db
      .select({
        id: listings.id,
        name: cards.name,
        price: listings.price,
        email: users.email,
      })
      .from(listings)
      .innerJoin(cards, eq(listings.cardId, cards.id))
      .innerJoin(users, eq(listings.userId, users.id));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTCGs = cache(async () =>
  db
    .select({
      id: tcgs.id,
      name: tcgs.name,
      slug: tcgs.slug,
      logo: tcgs.logoUrl,
    })
    .from(tcgs)
    .orderBy(tcgs.name)
);

export const getSets = cache(async (tcgId: string) =>
  db
    .select({
      id: sets.id,
      name: sets.name,
      slug: sets.slug,
      tcgId: sets.tcgId,
    })
    .from(sets)
    .where(eq(sets.tcgId, tcgId))
);

export const getTCG = cache(async (slug: string) =>
  db.query.tcgs.findFirst({ where: eq(tcgs.slug, slug) })
);

export const getCards = async (tcgId: string) =>
  db
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

export const getCardsBySet = async (setId: string) =>
  db
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

export const getCard = cache(async (slug: string) =>
  db.query.cards.findFirst({
    where: eq(cards.slug, slug),
    with: {
      set: true,
    },
  })
);

export const getListingsByCard = async (slug: string) =>
  db
    .select({
      id: listings.id,
      price: listings.price,
      name: users.name,
      condition: listings.condition,
      quantity: listings.quantity,
      created_at: listings.createdAt,
      user_id: users.id,
      notes: listings.notes,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(cards, eq(listings.cardId, cards.id))
    .where(eq(cards.slug, slug));

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

export const getUserCardsForTCG = async (tcgId: string, userId: string) =>
  db
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
    .from(listings)
    .innerJoin(cards, eq(listings.cardId, cards.id))
    .innerJoin(sets, eq(cards.setId, sets.id))
    .where(and(eq(listings.userId, userId), eq(cards.tcgId, tcgId)));

export async function createListing(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('Not authenticated');

  const cardId = formData.get('cardId') as string;
  const quantity = Number(formData.get('quantity'));
  const language = formData.get('language') as string;
  const condition = formData.get('condition') as string;
  const comments = formData.get('comments') as string;
  const price = Number(formData.get('price'));
  const isReverse = formData.get('isReverse') === 'on';
  const isSigned = formData.get('isSigned') === 'on';
  const isFirstEdition = formData.get('isFirstEdition') === 'on';
  const isAltered = formData.get('isAltered') === 'on';

  // Find the user's first list
  const userList = await db
    .select()
    .from(userLists)
    .where(eq(userLists.userId, session.user.id!))
    .limit(1);
  if (!userList.length) throw new Error('No list found for user');
  const listId = userList[0].id;

  await db.insert(listings).values({
    userId: String(session.user.id!),
    cardId: String(cardId),
    listId: String('tst'),
    quantity,
    language,
    condition,
    notes: comments,
    price: price.toString(),
    isReverse,
    isSigned,
    isFirstEdition,
    isAltered,
  });
}
