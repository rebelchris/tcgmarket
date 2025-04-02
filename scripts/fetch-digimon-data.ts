import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Interface for Digimon set data
interface DigimonSet {
  tcgId: string;
  name: string;
  id: string;
  series: string;
  printedTotal: number;
  total: number;
  ptcgoid: string;
  releaseDate: Date;
  logoUrl: string;
  symbolUrl: string;
  followUrl: string;
}

// Interface for Digimon card data
interface DigimonCard {
  tcgId: string;
  setId: string;
  name: string;
  searchName: string;
  tcgApiId: string;
  number: string;
  rarity: string;
  metadata: {
    colors: string[];
    type: string;
    level?: string;
    attribute?: string;
    dp?: string;
    playCost?: string;
    evolveCost?: string;
  };
  images: {
    large: string;
    small: string;
  };
}

// Function to fetch all Digimon sets from the wiki
async function fetchDigimonSets(): Promise<DigimonSet[]> {
  console.log('Fetching Digimon sets from wiki...');

  try {
    // First, fetch the main Digimon Card Game page
    const mainResponse = await axios.get(
      'https://digimoncardgame.fandom.com/wiki/Digimon_Card_Game'
    );
    const mainDom = new JSDOM(mainResponse.data);
    const { document: mainDoc } = mainDom.window;

    // Find the Expansion Sets and Starter Decks section by ID
    const setsSection = mainDoc.getElementById(
      'Expansion_Sets_and_Starter_Decks'
    );
    if (!setsSection) {
      console.error('Could not find Expansion Sets and Starter Decks section');
      return [];
    }

    // Get all category links after this section until the next h2
    const categoryLinks: Element[] = [];
    let currentElement = setsSection.parentElement?.nextElementSibling;

    while (currentElement && currentElement.tagName !== 'H2') {
      if (currentElement.tagName === 'A') {
        categoryLinks.push(currentElement);
      } else {
        // Also get links from within other elements
        const nestedLinks = currentElement.querySelectorAll('a');
        categoryLinks.push(...Array.from(nestedLinks));
      }
      currentElement = currentElement.nextElementSibling;
    }

    // Fetch sets from each category page
    const allSets: DigimonSet[] = [];
    const uniqueSetIds = new Set<string>();

    for (const categoryLink of categoryLinks) {
      const categoryUrl = categoryLink.getAttribute('href');
      if (!categoryUrl) continue;

      console.log(`Fetching sets from category: ${categoryUrl}`);
      const categoryResponse = await axios.get(
        `https://digimoncardgame.fandom.com${categoryUrl}`
      );
      const categoryDom = new JSDOM(categoryResponse.data);
      const { document: categoryDoc } = categoryDom.window;

      // Find the table with set information
      const setTable = categoryDoc.querySelector('table.NavFrame');
      if (!setTable) {
        console.log(`No set table found in category ${categoryUrl}`);
        continue;
      }

      // Get all set links from the table
      const setLinks = Array.from(setTable.querySelectorAll('a'));

      for (const setLink of setLinks) {
        const setName = setLink.textContent?.trim() || '';
        const setUrl = setLink.getAttribute('href');
        if (!setName || !setUrl) continue;

        // Extract set code from URL or name
        const setCode = setName.match(/^([A-Z]+-\d+)/)?.[1] || '';
        if (!setCode) continue;

        // Skip if we've already seen this set ID
        if (uniqueSetIds.has(setCode)) {
          console.log(`Skipping duplicate set: ${setCode}`);
          continue;
        }

        // Determine series based on set code
        let series = 'Booster';
        if (setCode.startsWith('ST')) {
          series = 'Starter Deck';
        } else if (setCode.startsWith('EX')) {
          series = 'Expert Deck';
        } else if (setCode.startsWith('P')) {
          series = 'Promo';
        }

        // Add set to the list and mark its ID as seen
        allSets.push({
          tcgId: 'digimon',
          name: setName,
          id: setCode,
          series,
          printedTotal: 0, // Will be updated when fetching cards
          total: 0, // Will be updated when fetching cards
          ptcgoid: '-',
          releaseDate: new Date(), // Will be updated when fetching cards
          logoUrl: `https://digimoncardgame.fandom.com/wiki/File:${setCode}_logo.png`,
          symbolUrl: `https://digimoncardgame.fandom.com/wiki/File:${setCode}_symbol.png`,
          followUrl: `https://digimoncardgame.fandom.com${setUrl}`,
        });
        uniqueSetIds.add(setCode);
      }

      // Sleep between category requests
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    console.log(`Found ${allSets.length} unique Digimon sets`);
    return allSets;
  } catch (error) {
    console.error('Error fetching Digimon sets:', error);
    return [];
  }
}

// Function to fetch cards from a specific set
async function fetchCardsForSet(
  setId: string,
  setCode: string
): Promise<DigimonCard[]> {
  console.log(`Fetching cards for set ${setCode}...`);

  try {
    const response = await axios.get(setCode);
    const dom = new JSDOM(response.data);
    const { document } = dom.window;

    // Find the table with className "cardlist"
    const cardTable = document.querySelector('table.cardlist');
    if (!cardTable) {
      console.log(`No card list table found for set ${setCode}`);
      return [];
    }

    // Get all rows from the table
    const rows = Array.from(cardTable.querySelectorAll('tr')).slice(1); // Skip header row

    const cards = rows.map((row: unknown) => {
      const cells = Array.from(row.querySelectorAll('th,td'));
      console.log(cells, cells.length);
      if (cells.length < 5) return null;

      const [nameCell, levelCell, colorCell, typeCell, rarityCell] = cells;
      const cardName = nameCell.textContent?.trim() || '';
      const cardRegExp = /\(([^)]+)\)/;
      const cardNumber = cardRegExp.exec(cardName)?.[1] || '';
      const level = levelCell.textContent?.trim() || '';
      const color = colorCell.textContent?.trim() || '';
      const type = typeCell.textContent?.trim() || '';
      const rarity = rarityCell.textContent?.trim() || '';

      console.log(cardName, cardNumber, level, color, type, rarity);

      if (!cardName || !cardNumber) return null;

      // Create card object
      const card: DigimonCard = {
        tcgId: 'digimon',
        setId: setCode,
        name: cardName,
        searchName: cardName.toLowerCase(),
        tcgApiId: cardNumber,
        number: cardNumber.split('-').pop() || '',
        rarity,
        metadata: {
          colors: [color],
          type,
          level,
        },
        images: {
          large: `https://digimoncardgame.fandom.com/wiki/File:${cardNumber}.png`,
          small: `https://digimoncardgame.fandom.com/wiki/File:${cardNumber}.png?format=original&width=200`,
        },
      };

      return card;
    });

    // Filter out null values
    const validCards = cards.filter(
      (card): card is DigimonCard => card !== null
    );
    console.log(`Found ${validCards.length} cards for set ${setCode}`);
    return validCards;
  } catch (error) {
    console.error(`Error fetching cards for set ${setCode}:`, error);
    return [];
  }
}

// Main function to save the data
async function main() {
  try {
    // Create directories if they don't exist
    const digimonDir = path.join(__dirname, '../db/seeds/digimon');
    const digimonCardsDir = path.join(digimonDir, 'cards');

    if (!fs.existsSync(digimonDir)) {
      fs.mkdirSync(digimonDir, { recursive: true });
    }

    if (!fs.existsSync(digimonCardsDir)) {
      fs.mkdirSync(digimonCardsDir, { recursive: true });
    }

    // Fetch and save sets data
    const sets = await fetchDigimonSets();

    // Generate the sets data as proper JavaScript code, not JSON
    const setsContent = sets.reduce((acc, set) => {
      const releaseDate =
        set.releaseDate instanceof Date
          ? set.releaseDate
          : new Date(set.releaseDate);

      return `${acc}  {
  tcgId: "${set.tcgId}",
  name: "${set.name.replace(/"/g, '\\"')}",
  id: "${set.id}",
  series: "${set.series}",
  printedTotal: ${set.printedTotal},
  total: ${set.total},
  ptcgoid: "${set.ptcgoid}",
  releaseDate: new Date("${releaseDate.toISOString()}"),
  logoUrl: "${set.logoUrl}",
  symbolUrl: "${set.symbolUrl}",
},
`;
    }, 'export const setSeed = [\n');

    fs.writeFileSync(path.join(digimonDir, 'sets.ts'), `${setsContent}];\n`);

    console.log(`Saved ${sets.length} Digimon sets to sets.ts`);

    // Create cards index file
    let indexImports = '';
    let indexExports = 'export const cardSeed = [\n';

    // Process only the first set for testing
    const firstSet = sets[0];
    if (firstSet) {
      const setId = firstSet.id;
      try {
        // Fetch cards for this set
        const cards = await fetchCardsForSet(setId, firstSet.followUrl);
        console.log('Found cards:', cards.length);
        console.log('First card:', cards[0]);

        if (cards.length > 0) {
          // Generate card content directly as JavaScript, not JSON
          const cardsContent = cards.reduce((acc, card) => {
            const colors =
              card.metadata.colors && card.metadata.colors.length > 0
                ? card.metadata.colors
                    .map((color) => `"${color.replace(/"/g, '\\"')}"`)
                    .join(', ')
                : '';

            return `${acc}  {
  tcgId: "${card.tcgId}",
  setId: "${setId}",
  name: "${card.name.replace(/"/g, '\\"')}",
  searchName: "${card.searchName.replace(/"/g, '\\"')}",
  tcgApiId: "${card.tcgApiId}",
  number: "${card.number}",
  rarity: "${card.rarity}",
  metadata: {
    colors: [${colors}],
    type: "${card.metadata.type.replace(/"/g, '\\"')}",
    ${card.metadata.level ? `level: "${card.metadata.level}",` : ''}
    ${card.metadata.attribute ? `attribute: "${card.metadata.attribute}",` : ''}
    ${card.metadata.dp ? `dp: "${card.metadata.dp}",` : ''}
    ${card.metadata.playCost ? `playCost: "${card.metadata.playCost}",` : ''}
    ${
      card.metadata.evolveCost
        ? `evolveCost: "${card.metadata.evolveCost}",`
        : ''
    }
  },
  images: {
    
  },
},
`;
          }, 'export const cardSeed = [\n');

          fs.writeFileSync(
            path.join(digimonCardsDir, `${setId}.ts`),
            `${cardsContent}];\n`
          );

          // Update index imports and exports
          const safeSetId = setId.replace(/-/g, '_');
          indexImports += `import { cardSeed as ${safeSetId}Cards } from './${setId}';\n`;
          indexExports += `  ...${safeSetId}Cards,\n`;

          console.log(`Saved ${cards.length} cards for set ${setId}`);
        } else {
          console.log(`No cards found for set ${setId}, skipping`);
        }
      } catch (error) {
        console.error(`Error processing set ${setId}:`, error);
      }
    }

    indexExports += '];\n';
    fs.writeFileSync(
      path.join(digimonCardsDir, 'index.ts'),
      `${indexImports}\n${indexExports}`
    );

    console.log('Digimon data fetching complete!');
  } catch (error) {
    console.error('Error fetching Digimon data:', error);
  }
}

// Run the script
main();
