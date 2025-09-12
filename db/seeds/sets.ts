import { setSeed as pokemonSets } from '@/db/seeds/pokemon/sets';
import { setSeed as onePieceSets } from '@/db/seeds/one-piece/sets';
import { setSeed as magicSets } from '@/db/seeds/magic/sets';

export const setsSeed = [
  ...pokemonSets,
  ...onePieceSets,
  ...magicSets,
];
