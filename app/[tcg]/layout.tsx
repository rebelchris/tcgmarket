export default function TCGLayout({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    return (
        <>
            <header>Search bar for TCG</header>
            <main>{children}</main>
        </>
    )
}
