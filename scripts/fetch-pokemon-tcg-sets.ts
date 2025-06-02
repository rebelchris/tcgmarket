import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.resolve(__dirname, '../db/seeds/pokemon/sets.ts');
const SETS_URL =
  'https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/sets/en.json';

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

interface SetRaw {
  name: string;
  id: string;
  series: string;
  printedTotal: number;
  total: number;
  ptcgoCode?: string;
  releaseDate: string;
  images?: { logo?: string; symbol?: string };
}

async function main() {
  const sets = (await fetchJson(SETS_URL)) as SetRaw[];

  const mapped: Array<Record<string, unknown>> = sets.map((set: SetRaw) => ({
    tcgId: 'pokemon',
    name: set.name,
    id: set.id,
    series: set.series,
    printedTotal: set.printedTotal,
    total: set.total,
    ptcgoid: set.ptcgoCode,
    releaseDate: `new Date('${set.releaseDate}')`,
    logoUrl: set.images?.logo,
    symbolUrl: set.images?.symbol,
  }));

  // Format for TypeScript file
  const ts = `export const setSeed = [\n${mapped
    .map((set) => {
      const { releaseDate, ...rest } = set;
      return `  {\n${Object.entries(rest)
        .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
        .join('\n')}\n    releaseDate: ${releaseDate}\n  }`;
    })
    .join(',\n')}\n]\n`;

  fs.writeFileSync(OUTPUT_PATH, ts, 'utf8');
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main();
