import {getSets} from "@/app/actions";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {tcgs} from "@/db/schema";

export const dynamicParams = false


export async function generateStaticParams() {
    const tcgs = await getSets();
    return tcgs.map((post) => ({
        set: post.slug,
    }))
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ set: string }>
}) {
    const {set} = await params
    const data = await db.query.sets.findFirst({
        where: eq(tcgs.slug, set)
    });
    console.log(data, set)
    if (!data) {
        return <p>not found</p>
    }

    return (
        <p>Hello set {data.name}</p>
    )
}
