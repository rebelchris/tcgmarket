export async function generateStaticParams() {
    return []
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ card: string }>
}) {
    return null
}
