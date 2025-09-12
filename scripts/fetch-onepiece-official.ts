import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Constants
const SETS_URL = 'https://en.onepiece-cardgame.com/products/';
const NEMESIS_JSON_URLS = [
  'https://raw.githubusercontent.com/nemesis312/OnePieceTCGEngCardList/main/CardDb.json',
  'https://raw.githubusercontent.com/nemesis312/OnePieceTCGEngCardList/main/CardDb2.json',
  'https://raw.githubusercontent.com/nemesis312/OnePieceTCGEngCardList/main/CardDb3.json',
];
const SEED_DIR = path.join(__dirname, '../db/seeds/one-piece');
const CARDS_DIR = path.join(SEED_DIR, 'cards');

// Fetch sets from the official site
async function fetchSets() {
  const { data } = await axios.get(SETS_URL);
  const $ = cheerio.load(data);
  const sets: any[] = [];
  
  // Booster, Extra Booster, Starter, etc. selectors
  $('li.productsDetail').each((_, section) => {
    const category = $(section).find('.productsCategory').text().trim();
    if(!['BOOSTERS', 'DECKS'].includes(category)) {
      return;
    }


    const name = $(section).find('.js_productsTit').text().trim();
    const nameSplit = name.split('-');
    const idMatch = name.match(/\[(.*?)\]/);
    const id = idMatch ? idMatch[1] : undefined;
    const releaseDate = $(section).find('.productsDate').text().replace('Release Date', '').trim();
    const dateSplit = releaseDate.split('MSRP');
    const logoUrl = $(section).find('.productsThumnail img').attr('src')?.replace(/^\.\./, '');
    // Use logo as symbol for now
    if (id && name) {
      sets.push({
        id,
        name: nameSplit[1]?.trim() || name,
        releaseDate: dateSplit[0].trim(),
        logoUrl: logoUrl ? `https://en.onepiece-cardgame.com${  logoUrl}` : undefined,
        symbolUrl: logoUrl ? `https://en.onepiece-cardgame.com${  logoUrl}` : undefined,
      });
    }
    
  });
  return sets;
}

// Fetch all cards from nemesis312 JSON
async function fetchAllCards(): Promise<Record<string, unknown>[]> {
  // Fetch all three JSONs and merge their entries
  const allCards: Record<string, unknown>[] = [];
  for (const url of NEMESIS_JSON_URLS) {
    const { data } = await axios.get(url);
    const cards = data.Cards;
    if (Array.isArray(cards)) {
      allCards.push(...cards);
    } else if (typeof cards === 'object' && cards !== null) {
      allCards.push(...(Object.values(cards) as Record<string, unknown>[]));
    }
  }
  return allCards;
}

function extractSetId(cardNum: string): string | undefined {
  // Example: 'OP01-001' => 'OP-01', 'ST01-001' => 'ST-01', etc.
  const match = cardNum.match(/([A-Z]+)(\d+)-/);
  if (!match) return undefined;
  const prefix = match[1];
  const num = match[2];
  return `${prefix}-${num}`;
}

// Write sets seed file
function writeSetsFile(sets: any[]) {
  let content = 'export const setSeed = [\n';
  sets.forEach(set => {
    content += '  {\n';
    content += `    tcgId: "one-piece",\n`;
    content += `    id: "${set.id}",\n`;
    content += `    name: "${set.name}",\n`;
    content += `    series: "${set.series}",\n`;
    content += set.releaseDate ? `    releaseDate: new Date("${set.releaseDate}"),\n` : '';
    content += set.logoUrl ? `    logoUrl: "${set.logoUrl}",\n` : '';
    content += set.symbolUrl ? `    symbolUrl: "${set.symbolUrl}",\n` : '';
    content += '  },\n';
  });
  content += '];\n';
  fs.writeFileSync(path.join(SEED_DIR, 'sets.ts'), content);
}

function mapCardToSeed(card: Record<string, unknown>, setId: string): Record<string, unknown> {
  const name = card.Name || '';
  // Extract card number from CardNum (e.g., OP01-001 => 1)
  let number = '';
  if (typeof card.CardNum === 'string') {
    const match = card.CardNum.match(/-(\d+)/);
    if (match) number = String(parseInt(match[1], 10));
  }
  // Compose searchName as 'name (OP01 1)'
  const searchName = `${name.toString().toLowerCase()} (${setId.replace('-', '')} ${number})`;
  // Use ImageUrl for both large and small
  const imageUrl = card.Img || '';
  return {
    tcgId: 'one-piece',
    setId,
    name,
    searchName,
    tcgApiId: card.CardId || card.CardNum || '',
    number,
    rarity: card.Rarity || '',
    metadata: {
      color: card.Color,
      type: card.Type,
      cost: card.Cost,
      power: card.Power,
      counter: card.Counter,
      attribute: card.Attribute,
      effect: card.Effect,
      trigger: card.Trigger,
      ...card, // include all other fields for extra info
    },
    images: {
      large: imageUrl,
      small: imageUrl,
    },
  };
}

function writeCardsFile(setId: string, cards: Record<string, unknown>[]) {
  const mapped = cards.map(card => mapCardToSeed(card, setId));
  const fileContent = `export const cardSeed = ${JSON.stringify(mapped, null, 2)};\n`;
  fs.writeFileSync(path.join(CARDS_DIR, `${setId}.ts`), fileContent, 'utf8');
}

async function main() {
  if (!fs.existsSync(SEED_DIR)) fs.mkdirSync(SEED_DIR, { recursive: true });
  if (!fs.existsSync(CARDS_DIR)) fs.mkdirSync(CARDS_DIR, { recursive: true });

  console.log('Fetching sets from official site...');
  const sets = await fetchSets();
  writeSetsFile(sets);
  console.log(`Saved ${sets.length} sets.`);

  console.log('Fetching all cards from nemesis312...');
  const allCards = await fetchAllCards();

  for (const set of sets) {
    const setId = set.id;
    const cards = allCards.filter((card: Record<string, unknown>) => extractSetId(card.CardNum as string) === setId);
    writeCardsFile(setId, cards);
    console.log(`Saved ${cards.length} cards for set ${setId}.`);
  }

  // Generate index.ts for all sets
  const cardFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  let imports = '';
  let spreads = '';
  for (const file of cardFiles) {
    const baseName = file.replace('.ts', '');
    const importName = `cardSeed${baseName.replace(/[^a-zA-Z0-9]/g, '')}`;
    imports += `import { cardSeed as ${importName} } from './${baseName}';\n`;
    spreads += `  ...${importName},\n`;
  }
  const indexContent = `${imports}
export const cardSeed = [
${spreads}];
export default cardSeed;
`;
  fs.writeFileSync(path.join(CARDS_DIR, 'index.ts'), indexContent, 'utf8');
  console.log('Wrote index.ts');

  console.log('Done!');
}

main().catch((err) => {
  console.error('Error:', err);
}); 