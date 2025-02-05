'use server';

import {db} from '../db/drizzle';
import {cards, listings, sets, tcgs, users} from '../db/schema';
import {eq, sql} from 'drizzle-orm';
import {revalidatePath} from 'next/cache';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/app/api/auth/[...nextauth]/route';

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

export const addListing = async (newListing: any) => {
    const session = await getServerSession(authOptions);
    await db.insert(listings).values({
        userId: session?.user?.id,
        listId: 1,
        cardId: 1,
        ...newListing,
    });
    revalidatePath('/');
};

export const searchCard = async (query: string) => {
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
    console.log(data);
    return data;
};

export const deleteListing = async (id: number) => {
    await db.delete(listings).where(eq(listings.id, id));
    revalidatePath('/');
};
