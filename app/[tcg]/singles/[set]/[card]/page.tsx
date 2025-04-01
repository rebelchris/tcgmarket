import {getCards} from "@/app/actions";

export const dynamic = 'force-static'

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
    return null
}
