import pokemonCards from '@/db/seeds/pokemon/cards';
// import { cardSeed as onePieceCards } from '@/db/seeds/one-piece/cards';
import  magicCards from '@/db/seeds/magic/cards';
import digimonCards from '@/db/seeds/digimon/cards';

// eslint-disable-next-line import/prefer-default-export
export const cardsSeed = [
  ...pokemonCards,
  //   ...onePieceCards,
  ...magicCards,
  ...digimonCards,
];
