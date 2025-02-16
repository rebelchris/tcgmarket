import {db} from "@/db/drizzle";
import {cards, sets, tcgs} from "@/db/schema";
import {setSeed} from "@/db/seeds/sets";
import {cardSeed} from "@/db/seeds/cards";

const main = async () => {
    console.log("Seed start");

    await db.insert(tcgs).values({
        id: 1,
        name: 'Pokémon'
    });

    await db.insert(sets).values(setSeed);

    // @ts-ignore
    await db.insert(cards).values(cardSeed);

    console.log("Seed done");
    process.exit(1)
};

main().catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
})
