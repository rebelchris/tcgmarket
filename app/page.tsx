import "@radix-ui/themes/styles.css";
import Image from "next/image"
import Link from "next/link"
import {HeartHandshake, ShieldCheck, UserCheck} from "lucide-react";
import {Box, Button, Card, Container, Flex, Grid, Heading, Section, Text} from "@radix-ui/themes";

export default function LandingPage() {
    return (
        <Flex direction="column" style={{minHeight: "100vh"}}>
            <Box asChild>
                <header>
                    <Container size="4">
                        <Flex justify="between" align="center" py="4">
                            <Link className="flex items-center justify-center" href="#">
                                <Image src='https://cdn.tcgmarket.co.za/TCGMARKET.png' alt='TCGmarket' width={112}
                                       height={78}/>
                                <span className="sr-only">TCGMarket</span>
                            </Link>
                        </Flex>
                    </Container>
                </header>
            </Box>
            <Box>
                <Section size="3">
                    <Container size="4">
                        <Flex direction="row" align="center" justify="center" gap="8">
                            <Flex direction="column" justify="center" gap="4" style={{maxWidth: "600px"}}>
                                <Heading size="9">
                                    Trade Cards the Lekker Way
                                </Heading>
                                <Text size="5" color="gray">
                                    Catch &apos;em all in one place! Join the ultimate platform for trading
                                    cards in
                                    South Africa.
                                </Text>
                                <Flex gap="4">
                                    <Link href='#learn'>
                                        <Button size="4">Learn more</Button>
                                    </Link>
                                    <Link href='#contact'>
                                        <Button size="4" variant="outline">
                                            Subscribe
                                        </Button>
                                    </Link>
                                </Flex>
                            </Flex>
                            <Box style={{position: "relative", width: "400px", height: "400px"}}>
                                <Box
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(to right, var(--blue-9), var(--purple-9))",
                                        borderRadius: "50%",
                                        animation: "pulse 2s infinite",
                                    }}
                                />
                                <Box
                                    style={{
                                        position: "absolute",
                                        inset: "8px",
                                        background: "var(--color-background)",
                                        borderRadius: "50%",
                                    }}
                                />
                                <Flex align="center" p="2" justify="center"
                                      style={{position: "absolute", inset: 0}}>
                                    <Image
                                        src="https://cdn.tcgmarket.co.za/header.jpg"
                                        width={400}
                                        height={400}
                                        alt="Pokémon Cards"
                                        className="rounded-full"
                                    />
                                </Flex>
                            </Box>
                        </Flex>
                    </Container>
                </Section>
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
                <Section size="3" id="contact">
                    <Container size="4">
                        <Flex direction="column" align="center" gap="6">
                            <Heading size="8" align="center">
                                Stay Updated
                            </Heading>
                            <Text size="5" align="center" style={{maxWidth: "600px"}}>
                                Be the first to know when TCGMarket launches. Sign up for our newsletter to receive
                                exclusive updates
                                and offers.
                            </Text>
                            <Flex direction="column" align="center" gap="2"
                                  style={{width: "100%", maxWidth: "400px"}}>
                                <form style={{width: "100%"}}>
                                    <Flex gap="2">
                                        <input className="max-w-lg flex-1" placeholder="Enter your email"
                                               type="email"/>

                                        <Button type="submit">Subscribe</Button>
                                    </Flex>
                                </form>
                                <Text size="1" color="gray">
                                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                                </Text>
                            </Flex>
                        </Flex>
                    </Container>
                </Section>
            </Box>
            <Box asChild>
                <footer>
                    <Container size="4">
                        <Flex justify="between" align="center" py="4">
                            <Text size="1" color="gray">
                                © 2025 TCGMarket. All rights reserved.
                            </Text>
                            <Flex gap="4">
                                <Link href="#">
                                    <Text size="1">Terms of Service</Text>
                                </Link>
                                <Link href="#">
                                    <Text size="1">Privacy</Text>
                                </Link>
                            </Flex>
                        </Flex>
                    </Container>
                </footer>
            </Box>
        </Flex>
    )
}
