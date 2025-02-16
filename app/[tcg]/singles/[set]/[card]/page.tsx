import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {tcgs} from "@/db/schema";
import Image from "next/image";
import {getCards} from "@/app/actions";

export const dynamicParams = false


export async function generateStaticParams() {
    const tcgs = await getCards();
    return tcgs.map((post) => ({
        card: post.slug,
    }))
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ card: string }>
}) {
    const {card} = await params
    const data = await db.query.cards.findFirst({
        where: eq(tcgs.slug, card)
    });
    console.log(data, card)
    if (!data) {
        return <p>not found</p>
    }

    return (
        <div>
            <p>Hello card {data.searchName}</p>
            {data.images?.large && (
                <Image src={data.images.large} alt={data.name} width={300} height={600}/>
            )}
        </div>
    )
}
