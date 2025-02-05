import { NextResponse } from 'next/server'
import { db } from "../../../db/drizzle";
import {listings, users, cards} from "../../../db/schema";
import {eq} from "drizzle-orm";

// GET method handler
export async function GET() {
    const data = await db.select({
        id: listings.id,
        name: cards.name,
        price: listings.price,
        location: listings.location,
        email: users.email,
    }).from(listings)
        .innerJoin(cards, eq(listings.cardId, cards.id))
        .innerJoin(users, eq(listings.userId, users.id))

    return NextResponse.json(data)
}

// POST method handler
export async function POST(request: Request) {
    const newUser = await request.json()
console.log('request', newUser)
    await db.insert(listings).values({
        userId: '328025e9-8a9f-42e8-9afa-bbb5ce8aead5',
        cardId: 1,
        ...newUser,
    });

    // In a real app, you'd typically save to a database
    return NextResponse.json({
        message: 'User created',
        user: newUser
    }, { status: 201 })
}
