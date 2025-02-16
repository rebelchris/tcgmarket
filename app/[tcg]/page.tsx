// Return a list of `params` to populate the [set] dynamic segment
import {getCards, getTCGs} from "@/app/actions";
import Image from "next/image";

export async function generateStaticParams() {
    const tcgs = await getTCGs();
    return tcgs.map((tcg) => ({
        tcg: tcg.slug,
    }))
}

export default async function Page({}: {
    params: Promise<{ tcg: string }>
}) {
    // const {tcg} = await params
    // const data = await db.query.tcgs.findFirst({
    //     where: eq(tcgs.slug, tcg)
    // })

    const cards = await getCards();
    return (
        <div
            className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
            <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
                <div className='grid grid-cols-6 gap-4'>
                    {cards.map((card) => (
                        <div key={card.id}>
                            {card.images?.large && (
                                <Image src={card.images?.large} alt={card.name} width={300} height={600}/>
                            )}
                            <h1>
                                {card.name} - {card.number}/{card.setTotal}
                            </h1>
                            <p>{card.rarity}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
