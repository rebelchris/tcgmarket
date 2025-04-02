import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Interface for One Piece set
interface OnePieceSet {
  tcgId: string;
  name: string;
  id: string;
  series: string;
  printedTotal: number;
  total: number;
  ptcgoid: string;
  releaseDate: Date;
  logoUrl?: string;
  symbolUrl?: string;
}

// Interface for One Piece card
interface OnePieceCard {
  tcgId: string;
  setId: string;
  name: string;
  searchName: string;
  tcgApiId: string;
  number: string;
  rarity: string;
  metadata: {
    color: string;
    type: string;
    power: string;
    attribute: string[];
    cost: string;
  };
  images: {
    large: string;
    small: string;
  };
}

// Function to fetch One Piece sets from official website
async function fetchOnePieceSets(): Promise<OnePieceSet[]> {
  console.log('Fetching One Piece sets...');

  try {
    // Fetch from the official One Piece card game website
    const response = await axios.get(
      'https://en.onepiece-cardgame.com/cardlist/'
    );
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Get the expansion select dropdown which contains all set info
    const expansionSelect = document.querySelector('#expansion');
    if (!expansionSelect) {
      throw new Error('Could not find expansion select on One Piece website');
    }

    const sets: OnePieceSet[] = [];
    const options = expansionSelect.querySelectorAll('option');

    // Process each option in the dropdown
    for (const option of options) {
      const value = option.getAttribute('value');
      const name = option.textContent?.trim();

      // Skip placeholder options
      if (!value || !name || value === '0') continue;

      // Determine set ID and series from the value
      const id = value.toLowerCase();
      let series = 'Booster';

      if (id.startsWith('st')) {
        series = 'Starter Deck';
      } else if (id.startsWith('op')) {
        series = 'Booster';
      } else if (id.startsWith('p')) {
        series = 'Promo';
      } else if (id.startsWith('eb')) {
        series = 'Extra booster';
      }

      // We'll need to extract release dates separately since they're not directly available
      // For now we'll use today's date and update it later if possible
      const releaseDate = new Date();

      // Create the set object
      const set: OnePieceSet = {
        tcgId: 'one-piece',
        name,
        id,
        series,
        // We don't know exact counts from the website alone, so estimate initially
        printedTotal: 120, // Will be updated later
        total: 120, // Will be updated later
        ptcgoid: '-',
        releaseDate,
        logoUrl: `https://en.onepiece-cardgame.com/images/products/expansions/${id}.png`,
        symbolUrl: `https://en.onepiece-cardgame.com/images/products/expansions/${id}.png`,
      };

      sets.push(set);
    }

    console.log(`Found ${sets.length} One Piece sets`);

    // Sort sets by ID for consistent ordering
    return sets.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error('Error fetching One Piece sets:', error);

    // Fallback to the existing hardcoded sets if we can't fetch from the website
    return FALLBACK_SETS;
  }
}

// Function to fetch cards for a specific set
async function fetchCardsForSet(setId: string): Promise<OnePieceCard[]> {
  console.log(`Fetching cards for One Piece set ${setId}...`);

  try {
    // Fetch all cards for the given set ID
    const url = `https://en.onepiece-cardgame.com/cardlist/?expansion=${setId}`;
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Find all card elements on the page
    const cardElements = document.querySelectorAll('.card_img');
    const cards: OnePieceCard[] = [];

    // For each card element, extract the necessary information
    for (const cardElement of cardElements) {
      try {
        // Extract card number and image URL
        const cardLink = cardElement.querySelector('a');
        if (!cardLink) continue;

        const cardUrl = cardLink.getAttribute('href');
        if (!cardUrl) continue;

        // Extract card ID from URL (format: /cardlist/?cardno=OP01-001)
        const cardNumberMatch = cardUrl.match(/cardno=([A-Za-z0-9-]+)/);
        if (!cardNumberMatch || !cardNumberMatch[1]) continue;

        const cardId = cardNumberMatch[1];
        const cardNumber = cardId.split('-')[1] || '';

        // Get card image
        const cardImg = cardElement.querySelector('img');
        const imageUrl = cardImg?.getAttribute('src') || '';

        // Fetch individual card details to get more information
        const cardDetailResponse = await axios.get(
          `https://en.onepiece-cardgame.com${cardUrl}`
        );
        const cardDom = new JSDOM(cardDetailResponse.data);
        const cardDoc = cardDom.window.document;

        // Extract card name
        const cardName =
          cardDoc.querySelector('.card_name')?.textContent?.trim() || '';

        // Extract card attributes from the table
        const attributeItems = cardDoc.querySelectorAll('.card_status_item');

        let color = '';
        let type = '';
        let power = '';
        let cost = '';
        const attributes: string[] = [];

        for (const item of attributeItems) {
          const label = item
            .querySelector('.card_status_key')
            ?.textContent?.trim();
          const value =
            item.querySelector('.card_status_value')?.textContent?.trim() || '';

          if (label?.includes('Color')) {
            color = value;
          } else if (label?.includes('Card Type')) {
            type = value;
          } else if (label?.includes('Power')) {
            power = value;
          } else if (label?.includes('Cost')) {
            cost = value;
          } else if (label?.includes('Attribute') && value) {
            // Split attributes which may be comma separated
            attributes.push(...value.split(',').map((attr) => attr.trim()));
          }
        }

        // Determine rarity from card number or image
        let rarity = 'C'; // Default to Common
        if (cardNumber.includes('SEC')) {
          rarity = 'SEC';
        } else if (cardNumber.includes('SR')) {
          rarity = 'SR';
        } else if (cardNumber.includes('R')) {
          rarity = 'R';
        } else if (cardNumber.includes('UC')) {
          rarity = 'UC';
        }

        // Create card object
        const card: OnePieceCard = {
          tcgId: 'one-piece',
          setId: setId.toLowerCase(),
          name: cardName,
          searchName: cardName.toLowerCase(),
          tcgApiId: cardId,
          number: cardNumber,
          rarity,
          metadata: {
            color,
            type,
            power,
            attribute: attributes,
            cost,
          },
          images: {
            large: imageUrl.replace('/thumb/', '/'),
            small: imageUrl,
          },
        };

        cards.push(card);

        // Sleep to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (detailError) {
        console.error(`Error processing card detail:`, detailError);
        // Continue to next card
      }
    }

    console.log(`Found ${cards.length} cards for set ${setId}`);

    // Update set total if we found cards
    if (cards.length > 0) {
      updateSetTotal(setId, cards.length);
    }

    return cards;
  } catch (error) {
    console.error(`Error fetching cards for set ${setId}:`, error);
    return [];
  }
}

// Function to update set totals based on actual card counts
function updateSetTotal(setId: string, cardCount: number) {
  const setFilePath = path.join(__dirname, '../db/seeds/one-piece/sets.ts');

  if (fs.existsSync(setFilePath)) {
    try {
      const setsContent = fs.readFileSync(setFilePath, 'utf8');
      const updatedContent = setsContent.replace(
        new RegExp(
          `(id:\\s*['"]${setId}['"][^}]*printedTotal:\\s*)(\\d+)([^}]*total:\\s*)(\\d+)`
        ),
        `$1${cardCount}$3${cardCount}`
      );

      fs.writeFileSync(setFilePath, updatedContent);
      console.log(`Updated set ${setId} with actual card count: ${cardCount}`);
    } catch (error) {
      console.error(`Error updating set total for ${setId}:`, error);
    }
  }
}

// Fallback sets if API fails
const FALLBACK_SETS: OnePieceSet[] = [
  {
    tcgId: 'one-piece',
    name: 'Memorial collection',
    id: 'eb01',
    series: 'Extra booster',
    printedTotal: 80,
    total: 80,
    ptcgoid: '-',
    releaseDate: new Date('2024/05/03'),
  },
  {
    tcgId: 'one-piece',
    name: 'Romance Dawn',
    id: 'op01',
    series: 'Booster',
    printedTotal: 121,
    total: 121,
    ptcgoid: '-',
    releaseDate: new Date('2022/12/02'),
    logoUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op01.png',
    symbolUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op01.png',
  },
  {
    tcgId: 'one-piece',
    name: 'Paramount War',
    id: 'op02',
    series: 'Booster',
    printedTotal: 120,
    total: 120,
    ptcgoid: '-',
    releaseDate: new Date('2023/03/03'),
    logoUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op02.png',
    symbolUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op02.png',
  },
  {
    tcgId: 'one-piece',
    name: 'Pillars of Strength',
    id: 'op03',
    series: 'Booster',
    printedTotal: 131,
    total: 131,
    ptcgoid: '-',
    releaseDate: new Date('2023/05/26'),
    logoUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op03.png',
    symbolUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op03.png',
  },
  {
    tcgId: 'one-piece',
    name: 'Alabasta Kingdom',
    id: 'op07',
    series: 'Booster',
    printedTotal: 131,
    total: 131,
    ptcgoid: '-',
    releaseDate: new Date('2024/05/24'),
    logoUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op07.png',
    symbolUrl:
      'https://en.onepiece-cardgame.com/images/products/expansions/op07.png',
  },
];

// Main function to execute the fetching and saving
async function main() {
  try {
    // Create directories if they don't exist
    const onePieceDir = path.join(__dirname, '../db/seeds/one-piece');
    const onePieceCardsDir = path.join(onePieceDir, 'cards');

    if (!fs.existsSync(onePieceDir)) {
      fs.mkdirSync(onePieceDir, { recursive: true });
    }

    if (!fs.existsSync(onePieceCardsDir)) {
      fs.mkdirSync(onePieceCardsDir, { recursive: true });
    }

    // Fetch sets
    const sets = await fetchOnePieceSets();

    // Generate the sets data as proper JavaScript code, not JSON
    let setsContent = 'export const setSeed = [\n';

    for (const set of sets) {
      // Format each set as a JavaScript object
      setsContent += '  {\n';
      setsContent += `    tcgId: "${set.tcgId}",\n`;
      setsContent += `    name: "${set.name}",\n`;
      setsContent += `    id: "${set.id}",\n`;
      setsContent += `    series: "${set.series}",\n`;
      setsContent += `    printedTotal: ${set.printedTotal},\n`;
      setsContent += `    total: ${set.total},\n`;
      setsContent += `    ptcgoid: "${set.ptcgoid}",\n`;

      // Handle the date properly as a JavaScript Date constructor
      const releaseDate =
        set.releaseDate instanceof Date
          ? set.releaseDate
          : new Date(set.releaseDate);
      setsContent += `    releaseDate: new Date("${releaseDate.toISOString()}"),\n`;

      if (set.logoUrl) {
        setsContent += `    logoUrl: "${set.logoUrl}",\n`;
      }

      if (set.symbolUrl) {
        setsContent += `    symbolUrl: "${set.symbolUrl}",\n`;
      }

      setsContent += '  },\n';
    }

    setsContent += '];\n';

    fs.writeFileSync(path.join(onePieceDir, 'sets.ts'), setsContent);
    console.log(`Saved ${sets.length} One Piece sets to sets.ts`);

    // Create cards index file
    let indexImports = '';
    let indexExports = 'export const cardSeed = [\n';

    // Process all sets
    for (const set of sets) {
      const setId = set.id;

      try {
        // Fetch cards for this set
        const cards = await fetchCardsForSet(setId);

        if (cards.length > 0) {
          // Generate card content directly as JavaScript, not JSON
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
            cardsContent += `      color: "${card.metadata.color}",\n`;
            cardsContent += `      type: "${card.metadata.type}",\n`;
            cardsContent += `      power: "${card.metadata.power}",\n`;

            // Handle the attributes array
            cardsContent += '      attribute: [';
            if (card.metadata.attribute && card.metadata.attribute.length > 0) {
              cardsContent += card.metadata.attribute
                .map((attr) => `"${attr.replace(/"/g, '\\"')}"`)
                .join(', ');
            }
            cardsContent += '],\n';

            cardsContent += `      cost: "${card.metadata.cost}",\n`;
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
            path.join(onePieceCardsDir, `${setId}.ts`),
            cardsContent
          );

          // Update index imports and exports
          const safeSetId = setId.replace(/-/g, '_');
          indexImports += `import { cardSeed as ${safeSetId}Cards } from './${setId}';\n`;
          indexExports += `  ...${safeSetId}Cards,\n`;

          console.log(`Saved ${cards.length} cards for set ${setId}`);
        } else {
          console.log(`No cards found for set ${setId}, skipping`);
        }

        // Sleep to respect rate limits between sets
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing set ${setId}:`, error);
        // Continue with next set
      }
    }

    indexExports += '];\n';
    fs.writeFileSync(
      path.join(onePieceCardsDir, 'index.ts'),
      indexImports + '\n' + indexExports
    );

    console.log('One Piece data fetching complete!');
  } catch (error) {
    console.error('Error fetching One Piece data:', error);
  }
}

// Run the script
main();
