import { cards, users, userLists } from '@/db/schema';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';

// To be used in the main seed.ts file
export default async function generateListingsSeed() {
  // First, create some users
  const userIds = [
    '3f8e7d9c-6b5a-4e2d-9c8b-7a6f5d4b3c2a',
    '2a1b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  ];

  // Create users
  console.log('Creating users...');

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: userId,
        name: `User ${userId.substring(0, 6)}`,
        email: `user-${userId.substring(0, 6)}@example.com`,
      });
      console.log(`Created user ${userId.substring(0, 6)}`);
    }
  }

  // Create user lists
  console.log('Creating user lists...');
  const listIds = [
    'list-001-a1b2-c3d4-e5f6g7h8i9j0',
    'list-002-b2c3-d4e5-f6g7h8i9j0k1',
    'list-003-c3d4-e5f6-g7h8i9j0k1l2',
  ];

  for (let i = 0; i < listIds.length; i++) {
    const listId = listIds[i];
    const existingList = await db
      .select()
      .from(userLists)
      .where(eq(userLists.id, listId));

    if (existingList.length === 0) {
      await db.insert(userLists).values({
        id: listId,
        userId: userIds[i % userIds.length], // Distribute lists among users
        name: `Collection ${i + 1}`,
        isPublic: true,
      });
      console.log(`Created list ${listId}`);
    }
  }

  // Fetch some cards to create listings for
  console.log('Creating listings...');
  const cardItems = await db
    .select({
      id: cards.id,
      name: cards.name,
      setId: cards.setId,
      tcgId: cards.tcgId,
    })
    .from(cards)
    .limit(20);

  if (cardItems.length === 0) {
    console.log('No cards found to create listings for');
    return [];
  }

  // Create listings
  return cardItems.flatMap((card) => {
    // Create 1-3 different listings per card with different conditions and prices
    const numberOfListings = Math.floor(Math.random() * 3) + 1;

    return Array.from({ length: numberOfListings }, (_, i) => {
      // These strings must match the exact values in the conditionEnum
      const conditions = [
        'mint',
        'near_mint',
        'lightly_played',
        'played',
        'heavily_played',
        'poor',
      ] as const;
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const randomListId = listIds[Math.floor(Math.random() * listIds.length)];
      const randomPrice = (Math.random() * 100 + 0.5).toFixed(2);
      const randomQuantity = Math.floor(Math.random() * 10) + 1;

      // Determine if card has special attributes with some probability
      const isReverse = Math.random() > 0.8;
      const isSigned = Math.random() > 0.9;
      const isFirstEdition = Math.random() > 0.85;
      const isAltered = Math.random() > 0.95;

      let notes = '';
      if (i === 0) {
        notes = 'Mint condition card, perfect centering';
      } else if (i === 1) {
        notes = 'Small whitening on back edges';
      } else {
        notes = 'Has a small crease on the top right corner';
      }

      return {
        userId: randomUserId,
        cardId: card.id,
        listId: randomListId,
        condition: randomCondition,
        price: randomPrice,
        quantity: randomQuantity,
        isReverse,
        isSigned,
        isFirstEdition,
        isAltered,
        language: 'English',
        notes,
      };
    });
  });
}
