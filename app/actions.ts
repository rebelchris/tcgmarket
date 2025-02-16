'use server';

import {db} from '../db/drizzle';
import {cards, listings, sets, tcgs, users} from '../db/schema';
import {eq, sql} from 'drizzle-orm';

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

export const getTCGs = async () => {
    return await db.select({id: tcgs.id, name: tcgs.name, slug: tcgs.slug}).from(tcgs);
}

export const getSets = async () => {
    return await db.select({id: sets.id, name: sets.name, slug: sets.slug}).from(sets);
}

export const getCards = async () => {
    return await db
        .select({
            id: cards.id,
            name: cards.name,
            searchName: cards.searchName,
            images: cards.images,
            number: cards.number,
            rarity: cards.rarity,
            set: sets.name,
            setTotal: sets.total,
            slug: cards.slug,
        })
        .from(cards)
        .innerJoin(sets, eq(cards.setId, sets.id));
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
    name: string,
    setName: string,
    setCode: string | null,
    setSlug: string | null,
    setSymbol: string | null,
    number: string | null,
    slug: string | null,
}

export const searchCard = async (query: string): Promise<SearchCard[]> => {
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
        })
        .from(cards)
        .where(
            sql`to_tsvector('english', ${cards.name}) @@ to_tsquery('english', ${endQuery})`
        )
        .innerJoin(sets, eq(cards.setId, sets.id));
    return data;
};
