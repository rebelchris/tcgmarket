import fs from 'fs';
import path from 'path';

// Define types for Scryfall API responses
interface ScryfallCard {
  id: string;
  name: string;
  collector_number: string;
  rarity: string;
  colors: string[];
  type_line?: string;
  mana_cost?: string;
  cmc?: number;
  oracle_text?: string;
  flavor_text?: string;
  image_uris?: {
    large: string;
    small: string;
  };
  card_faces?: Array<{
    image_uris?: {
      large: string;
      small: string;
    };
  }>;
}

interface ScryfallSet {
  name: string;
  code: string;
  block?: string;
  parent_set_code?: string;
  card_count: number;
  released_at: string;
  icon_svg_uri?: string;
  digital: boolean;
  set_type: string;
}

interface ScryfallResponse<T> {
  data: T[];
  has_more: boolean;
}

// Function to fetch all MTG sets from Scryfall
async function fetchMTGSets() {
  console.log('Fetching MTG sets from Scryfall...');
  const response = await fetch('https://api.scryfall.com/sets');
  const data = (await response.json()) as ScryfallResponse<ScryfallSet>;

  // Transform to match the schema structure
  return data.data
    .filter((set) => !set.digital && set.set_type !== 'token') // Filter out digital-only sets and token sets
    .map((set) => ({
      tcgId: 'magic-the-gathering',
      name: set.name,
      id: set.code,
      series: set.block || set.parent_set_code || 'Other',
      printedTotal: set.card_count,
      total: set.card_count,
      ptcgoid: '-',
      releaseDate: new Date(set.released_at),
      logoUrl: set.icon_svg_uri || '',
      symbolUrl: set.icon_svg_uri || '',
    }));
}

// Function to fetch cards from a specific set
async function fetchCardsForSet(setCode: string) {
  console.log(`Fetching cards for set ${setCode}...`);
  let page = 1;
  let hasMore = true;
  const allCards = [];

  while (hasMore) {
    const url = `https://api.scryfall.com/cards/search?q=set:${setCode}&page=${page}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        // Handle API errors (e.g., 404, 429)
        if (response.status === 429) {
          console.log('Rate limit hit, waiting before retry...');
          await new Promise<void>((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        if (response.status === 404) {
          console.log(`No cards found for set ${setCode}`);
          break;
        }

        console.error(`API error: ${response.status} for set ${setCode}`);
        break;
      }

      const data = (await response.json()) as ScryfallResponse<ScryfallCard>;

      if (data.data) {
        const transformedCards = data.data.map((card) => ({
          tcgId: 'magic-the-gathering',
          setId: setCode,
          name: card.name,
          searchName: card.name.toLowerCase(),
          tcgApiId: card.id,
          number: card.collector_number,
          rarity: card.rarity,
          metadata: {
            colors: card.colors || [],
            type: card.type_line || '',
            manaCost: card.mana_cost || '',
            cmc: card.cmc || 0,
            oracleText: card.oracle_text || '',
            flavorText: card.flavor_text || '',
          },
          images: {
            large:
              card.image_uris?.large ||
              card.card_faces?.[0]?.image_uris?.large ||
              '',
            small:
              card.image_uris?.small ||
              card.card_faces?.[0]?.image_uris?.small ||
              '',
          },
        }));

        allCards.push(...transformedCards);
      }

      hasMore = data.has_more;
      page++;

      // Sleep to respect rate limits
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching cards for set ${setCode}:`, error);
      break;
    }
  }

  return allCards;
}

// Main function to execute the fetching and saving
async function main() {
  try {
    // Create directories if they don't exist
    const mtgDir = path.join(__dirname, '../db/seeds/magic');
    const mtgCardsDir = path.join(mtgDir, 'cards');

    if (!fs.existsSync(mtgDir)) {
      fs.mkdirSync(mtgDir, { recursive: true });
    }

    if (!fs.existsSync(mtgCardsDir)) {
      fs.mkdirSync(mtgCardsDir, { recursive: true });
    }

    // Fetch sets from Scryfall
    const sets = await fetchMTGSets();

    // Write sets data directly as JavaScript
    let setsContent = 'export const setSeed = [\n';

    for (const set of sets) {
      setsContent += '  {\n';
      setsContent += `    tcgId: "${set.tcgId}",\n`;
      setsContent += `    name: "${set.name.replace(/"/g, '\\"')}",\n`;
      setsContent += `    id: "${set.id}",\n`;
      setsContent += `    series: "${set.series}",\n`;
      setsContent += `    printedTotal: ${set.printedTotal},\n`;
      setsContent += `    total: ${set.total},\n`;
      setsContent += `    ptcgoid: "${set.ptcgoid}",\n`;

      // Write the date as a JavaScript Date object
      setsContent += `    releaseDate: new Date("${set.releaseDate.toISOString()}"),\n`;

      setsContent += `    logoUrl: "${set.logoUrl}",\n`;
      setsContent += `    symbolUrl: "${set.symbolUrl}",\n`;
      setsContent += '  },\n';
    }

    setsContent += '];\n';

    fs.writeFileSync(path.join(mtgDir, 'sets.ts'), setsContent);
    console.log(`Saved ${sets.length} MTG sets to sets.ts`);

    // Create cards index file
    let indexImports = '';
    let indexExports = 'export const cardSeed = [\n';

    // Sort sets by release date to process newest first
    const sortedSets = [...sets].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    // Process only the 5 most recent sets
    const limitedSets = sortedSets.slice(0, 5);
    console.log(`Limiting to 5 most recent sets for initial testing`);

    // Process sets
    for (const set of limitedSets) {
      const setCode = set.id;
      console.log(`Processing set ${setCode} - ${set.name}`);

      try {
        // Fetch cards for this set from Scryfall
        const cards = await fetchCardsForSet(setCode);

        if (cards.length > 0) {
          // Generate card content directly as JavaScript
          let cardsContent = 'export const cardSeed = [\n';

          for (const card of cards) {
            cardsContent += '  {\n';
            cardsContent += `    tcgId: "${card.tcgId}",\n`;
            cardsContent += `    setId: "${card.setId}",\n`;
            cardsContent += `    name: "${card.name.replace(/"/g, '\\"')}",\n`;
            cardsContent += `    searchName: "${card.searchName.replace(
              /"/g,
              '\\"'
            )}",\n`;
            cardsContent += `    tcgApiId: "${card.tcgApiId}",\n`;
            cardsContent += `    number: "${card.number}",\n`;
            cardsContent += `    rarity: "${card.rarity}",\n`;

            // Metadata object
            cardsContent += '    metadata: {\n';

            // Handle the colors array
            cardsContent += '      colors: [';
            if (card.metadata.colors && card.metadata.colors.length > 0) {
              cardsContent += card.metadata.colors
                .map((color) => `"${color.replace(/"/g, '\\"')}"`)
                .join(', ');
            }
            cardsContent += '],\n';

            cardsContent += `      type: "${(card.metadata.type || '').replace(
              /"/g,
              '\\"'
            )}",\n`;
            cardsContent += `      manaCost: "${(
              card.metadata.manaCost || ''
            ).replace(/"/g, '\\"')}",\n`;
            cardsContent += `      cmc: ${card.metadata.cmc || 0},\n`;
            cardsContent += `      oracleText: "${(
              card.metadata.oracleText || ''
            )
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')}",\n`;
            cardsContent += `      flavorText: "${(
              card.metadata.flavorText || ''
            )
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')}",\n`;
            cardsContent += '    },\n';

            // Images object
            cardsContent += '    images: {\n';
            cardsContent += `      large: "${card.images.large}",\n`;
            cardsContent += `      small: "${card.images.small}",\n`;
            cardsContent += '    },\n';

            cardsContent += '  },\n';
          }

          cardsContent += '];\n';

          fs.writeFileSync(
            path.join(mtgCardsDir, `${setCode}.ts`),
            cardsContent
          );
          console.log(`Saved ${cards.length} cards for set ${setCode}`);

          // Update index imports and exports
          indexImports += `import { cardSeed as ${setCode}Cards } from './${setCode}';\n`;
          indexExports += `  ...${setCode}Cards,\n`;
        } else {
          console.log(`No cards found for set ${setCode}, skipping`);
        }

        // Sleep to respect rate limits between sets
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing set ${setCode}:`, error);
        // Continue with next set
      }
    }

    indexExports += '];\n';

    fs.writeFileSync(
      path.join(mtgCardsDir, 'index.ts'),
      `${indexImports}\n${indexExports}`
    );

    console.log('MTG data fetching complete!');
  } catch (error) {
    console.error('Error fetching MTG data:', error);
  }
}

// Run the script
main();
