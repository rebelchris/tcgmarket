# TCG Market Seed Data Process

This guide explains how to collect and add seed data for new Trading Card Games (TCGs) to the TCG Market platform.

## Currently Supported TCGs

The platform currently supports the following TCGs:

1. **Pokémon** - Extensive seed data already available
2. **Magic: The Gathering** - Scripts prepared to generate data
3. **One Piece** - Basic seed data available
4. **Digimon** - Scripts prepared to generate data

## Adding Seed Data for a New TCG

### Step 1: Setup Database Entry

First, add the TCG to the database in the `db/seed.ts` file:

```typescript
await db.insert(tcgs).values([
  // ... existing TCGs ...
  {
    id: 'your-tcg-id',
    name: 'Your TCG Name',
    logoUrl: 'https://path-to-logo-image.png',
  },
]);
```

### Step 2: Collect Sets Data

For collecting sets data, you have two options:

#### Option A: Using an API (if available)

For TCGs with good API support (like Pokémon and Magic: The Gathering), you can use the API to fetch all sets data:

1. Create a script in the `scripts` folder (see example: `scripts/fetch-mtg-sets.ts`)
2. Run the script to generate the sets data file:

```bash
npx tsx scripts/fetch-mtg-sets.ts
npx tsx scripts/fetch-digimon-data.ts
npx tsx scripts/fetch-onepiece-data.ts
```

#### Option B: Manual Data Collection

For TCGs without good API support, you'll need to manually collect sets data:

1. Create a script that defines static sets data (see example: `scripts/create-digimon-sets.ts`)
2. Structure the data following this format:

```typescript
{
  id: 'set-code',
  name: 'Set Name',
  series: 'Set Series or Block',
  printedTotal: 123, // Number of cards printed in set
  total: 123, // Total number of cards including variants
  releaseDate: new Date('YYYY/MM/DD'),
  logoUrl: 'https://path-to-set-logo.png',
  symbolUrl: 'https://path-to-set-symbol.png',
}
```

3. Run the script to generate the sets data file:

```bash
npx tsx scripts/create-digimon-sets.ts
```

### Step 3: Collect Cards Data

Cards require more detailed data and generally follow the same pattern as sets:

#### For API-backed TCGs:

1. Create a script that fetches cards data for each set (see `scripts/fetch-mtg-data.ts` for a complete example)
2. The script should save individual files for each set in a dedicated folder structure:
   - `db/seeds/{tcg}/cards/{set-code}.ts`
   - `db/seeds/{tcg}/cards/index.ts` (exports all cards)

#### For Manually Collected Data:

1. Create individual files for sets with the card data following this format:

```typescript
export const cardSeed = [
  {
    tcgId: 'your-tcg-id',
    setId: 'set-code',
    name: 'Card Name',
    searchName: 'card name', // lowercase for searching
    tcgApiId: 'external-id',
    number: '123',
    rarity: 'Rare',
    metadata: {
      // TCG-specific metadata fields
    },
    images: {
      large: 'https://path-to-large-image.png',
      small: 'https://path-to-small-image.png',
    },
  },
  // more cards...
];
```

### Step 4: Update Import Files

Once you have your sets and cards data, update the main seed files:

1. Update `db/seeds/sets.ts`:

```typescript
import { setSeed as yourTcgSets } from '@/db/seeds/your-tcg/sets';
// ...other imports

export const setsSeed = [
  ...pokemonSets,
  ...onePieceSets,
  ...yourTcgSets,
  // ...other TCGs
];
```

2. Update `db/seeds/cards.ts`:

```typescript
import { cardSeed as yourTcgCards } from '@/db/seeds/your-tcg/cards';
// ...other imports

export const cardsSeed = [
  ...pokemonCards,
  ...onePieceCards,
  ...yourTcgCards,
  // ...other TCGs
];
```

### Step 5: Run the Seed Process

Finally, run the seed process to add the data to your database:

```bash
npm run db:seed
```

## Data Sources for TCGs

### Pokémon

- **Pokémon TCG API**: https://pokemontcg.io/
- Already implemented extensively in this project

### Magic: The Gathering

- **Scryfall API**: https://scryfall.com/docs/api
  - Free, comprehensive database
  - Scripts prepared in this project

### One Piece

- **Official One Piece Card Game website**: https://en.onepiece-cardgame.com/
- **TCGplayer API**: https://developer.tcgplayer.com/docs/ (requires registration)

### Digimon

- **Official Digimon Card Game website**: https://en.digimoncard.com/
- **DigimonCard.io**: https://digimoncard.io/ (community resource)
- Manual data collection scripts prepared

## Best Practices

1. **Use static data** when possible, as TCG sets and cards don't change often
2. **Keep consistent structure** across all TCGs
3. **Organize data by set** to make updates and maintenance easier
4. **Include high-quality images** for better user experience
5. **Add missing TCG-specific metadata** fields that are important to collectors
