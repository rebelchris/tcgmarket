import {Search} from "@/app/components/Search";

export default function TCGLayout({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Search/>
            <main>{children}</main>
        </>
    )
}
