import "@radix-ui/themes/styles.css";
import Image from "next/image"
import Link from "next/link"
import {Input} from "@/components/ui/input"
import {HeartHandshake, ShieldCheck, UserCheck} from "lucide-react";
import {Button, Card, Container, Flex, Grid, Heading, Section, Text} from "@radix-ui/themes";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" href="#">
                    TCGMARKET logo
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
                                        Trade Cards the Lekker Way
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Catch &apos;em all in one place! Join the ultimate platform for trading cards in
                                        South Africa.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href='#learn'>
                                        <Button size="4">Learn more</Button>
                                    </Link>
                                    <Link href='#contact'>
                                        <Button size="4" variant="outline">
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
                                    <div className="absolute inset-0 flex items-center justify-center p-2">
                                        <Image
                                            src="https://cdn.tcgmarket.co.za/header.jpg"
                                            width={400}
                                            height={400}
                                            alt="Pokémon Cards"
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Section id="learn" style={{backgroundColor: "var(--purple-a9)"}}>
                    <Container size="4" px="6">
                        <Heading as="h2" size="8" align="center" mb="6" style={{color: "var(--gray-1)"}}
                        >What to expect</Heading>
                        <Grid columns={{
                            initial: "1",
                            sm: "3",
                        }} gap="3">
                            <Card>
                                <Flex direction="column" align="center" gap="3" p="6">
                                    <UserCheck size={48}/>
                                    <Heading>Connect</Heading>
                                    <Text align="center">Connect with SA&apos;s Card Community</Text>
                                </Flex>
                            </Card>
                            <Card>
                                <Flex direction="column" align="center" gap="3" p="6">
                                    <HeartHandshake size={48}/>
                                    <Heading>Trade</Heading>
                                    <Text align="center">Trade, Collect, and Level Up Your Collection</Text>
                                </Flex>
                            </Card>
                            <Card>
                                <Flex direction="column" align="center" gap="3" p="6">
                                    <ShieldCheck size={48}/>
                                    <Heading>Secure</Heading>
                                    <Text align="center">Safe & Secure Trading, Mzansi Style</Text>
                                </Flex>
                            </Card>
                        </Grid>
                    </Container>
                </Section>
                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay updated</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Be the first to know when TCGMarket launches. Sign up for our newsletter to receive
                                    exclusive updates.
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
