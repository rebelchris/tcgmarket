import { db } from '@/db/drizzle';
import { cards, sets, tcgs, listings } from '@/db/schema';
import { setsSeed } from '@/db/seeds/sets';
import { cardsSeed } from '@/db/seeds/cards';
import generateListingsSeed from '@/db/seeds/listings';

const main = async () => {
  console.log('Seed start');

  await db.insert(tcgs).values([
    {
      id: 'pokemon',
      name: 'Pokémon',
      logoUrl: 'https://cdn.tcgmarket.co.za/pokemon.png',
    },
    {
      id: 'magic-the-gathering',
      name: 'Magic: The Gathering',
      logoUrl: 'https://cdn.tcgmarket.co.za/Magic-The-Gathering-logo.png',
    },
    {
      id: 'one-piece',
      name: 'One Piece',
      logoUrl: 'https://cdn.tcgmarket.co.za/one-piece.png',
    },
    {
      id: 'digimon',
      name: 'Digimon',
      logoUrl: 'https://cdn.tcgmarket.co.za/digimon.jpg',
    },
  ]);

  await db.insert(sets).values(setsSeed);

  // @ts-expect-error - Skip type checking for seeding data
  await db.insert(cards).values(cardsSeed);

  // Generate and insert the listings
  console.log('Generating listings...');
  const listingsSeed = await generateListingsSeed();

  // Cast the condition field to ensure it matches the enum type
  const typedListings = listingsSeed.map((listing) => ({
    ...listing,
    // Price needs to be numeric in Postgres
    price: Number(listing.price),
  }));

  // @ts-expect-error - Skip type checking for seeding data
  await db.insert(listings).values(typedListings);
  console.log(`Created ${listingsSeed.length} listings`);

  console.log('Seed done');
  process.exit(0);
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
