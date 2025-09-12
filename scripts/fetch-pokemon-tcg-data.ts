import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.resolve(__dirname, '../db/seeds/pokemon/cards');
const GITHUB_BASE =
  'https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master';
const SETS_PATH = path.resolve(__dirname, '../db/seeds/pokemon/sets.ts');

// Helper to fetch JSON from GitHub
async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function getSetIds(): Promise<any[]> {
  // Dynamically import the setSeed array from sets.ts
  const setsModule = await import(SETS_PATH);
  const setSeed = setsModule.setSeed || setsModule.default;
  return setSeed.map((set: any) => set);
}

async function main() {
  const setIds = await getSetIds();

  for (const setId of setIds) {
    const cards: any[] = [];
    const cardUrl = `${GITHUB_BASE}/cards/en/${setId.id}.json`;
    try {
      const loadedCards = await fetchJson(cardUrl);

      for (const card of loadedCards) {
        cards.push({
          tcgId: 'pokemon',
          setId: setId.id,
          name: card.name,
          tcgApiId: card.id,
          number: card.number,
          rarity: card.rarity || '',
          images: JSON.stringify(card.images),
          searchName: `${card.name} (${setId.ptcgoid} ${card.number})`,
        });
      }

      // Output TypeScript file
      const outFile = path.join(OUTPUT_PATH, `${setId.id}.ts`);
      const ts = `export const cardSeed${
        setId.id.charAt(0).toUpperCase() + setId.id.slice(1)
      } = [\n${cards
        .map((card) => `  ${JSON.stringify(card)}`)
        .join(',\n')}\n]\n`;
      fs.writeFileSync(outFile, ts, 'utf8');
      console.log(`Wrote ${outFile}`);
    } catch {
      // Card file probably doesn't exist, skip
    }
  }

  // Generate index.ts
  const files = fs
    .readdirSync(OUTPUT_PATH)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

  let imports = '';
  let spreads = '';
  for (const file of files) {
    const baseName = file.replace('.ts', '');
    const importName = `cardSeed${
      baseName.charAt(0).toUpperCase() + baseName.slice(1)
    }`;
    imports += `import { ${importName} } from './${baseName}.ts';\n`;
    spreads += `  ...${importName},\n`;
  }

  const indexContent = `${imports}\nexport const cardSeed = [\n${spreads}];\n`;
  fs.writeFileSync(path.join(OUTPUT_PATH, 'index.ts'), indexContent, 'utf8');
  console.log('Wrote index.ts');
}

main();
