import { db } from '@/db/drizzle';
import { cards, sets, tcgs, listings } from '@/db/schema';
import { setsSeed } from '@/db/seeds/sets';
import { cardsSeed } from '@/db/seeds/cards';
import generateListingsSeed from '@/db/seeds/listings';

const BATCH_SIZE = 100;

async function batchInsert<T>(table: any, values: T[]) {
  const batches = [];
  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    batches.push(db.insert(table).values(values.slice(i, i + BATCH_SIZE)));
  }
  await Promise.all(batches);
}

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
    // {
    //   id: 'digimon',
    //   name: 'Digimon',
    //   logoUrl: 'https://cdn.tcgmarket.co.za/digimon.jpg',
    // },
  ]);

  await db.insert(sets).values(setsSeed);

  // Batch insert cards
  await batchInsert(cards, cardsSeed);

  // Generate and insert the listings
  console.log('Generating listings...');
  const listingsSeed = await generateListingsSeed();

  const typedListings = listingsSeed.map((listing) => ({
    ...listing,
    price: Number(listing.price),
  }));

  // Batch insert listings
  await batchInsert(listings, typedListings);
  console.log(`Created ${listingsSeed.length} listings`);

  console.log('Seed done');
  process.exit(0);
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
