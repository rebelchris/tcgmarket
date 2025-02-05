import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {MountainIcon, SearchIcon, ShieldIcon, UsersIcon} from "@/app/components/icons"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" href="#">
                    <MountainIcon className="h-6 w-6"/>
                    <span className="sr-only">TCGMarket</span>
                </Link>
            </header>
            <main className="flex-1">
                <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        TCGMarket: Your South African Trading Card Marketplace
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Catch 'em all in one place! Join the ultimate platform for trading Trading cards
                                        in South Africa.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href='#learn'>
                                        <Button size="lg">Learn more</Button>
                                    </Link>
                                    <Link href='#contact'>
                                        <Button size="lg" variant="outline">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-2 bg-white rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Image
                                            src="/placeholder.svg?height=300&width=300"
                                            width={200}
                                            height={200}
                                            alt="Pokémon Cards"
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex justify-center"
                         id="learn">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What to
                            expect</h2>
                        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <SearchIcon className="h-12 w-12 text-primary"/>
                                    <h3 className="text-xl font-bold">Vast collection</h3>
                                    <p className="text-center text-muted-foreground">
                                        Explore a wide range of Pokémon cards from classic to modern sets.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <ShieldIcon className="h-12 w-12 text-primary"/>
                                    <h3 className="text-xl font-bold">Sell your cards</h3>
                                    <p className="text-center text-muted-foreground">
                                        Options to sell or trade your cards with other collectors.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <UsersIcon className="h-12 w-12 text-primary"/>
                                    <h3 className="text-xl font-bold">Community</h3>
                                    <p className="text-center text-muted-foreground">
                                        Connect with fellow Pokémon enthusiasts across South Africa.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay updated</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Be the first to know when TCGMarket launches. Sign up for our newsletter to receive
                                    exclusive updates
                                    and offers.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex space-x-2">
                                    <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email"/>
                                    <Button type="submit">Subscribe</Button>
                                </form>
                                <p className="text-xs text-muted-foreground">
                                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer id="contact"
                    className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">© 2025 TCGMarket. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
