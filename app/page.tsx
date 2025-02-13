import "@radix-ui/themes/styles.css";
import Image from "next/image"
import Link from "next/link"
import {HeartHandshake, ShieldCheck, UserCheck} from "lucide-react";
import {AspectRatio, Box, Button, Card, Container, Flex, Grid, Heading, Section, Text,} from "@radix-ui/themes";
import React from "react";
import {NewsletterSubscribe} from "@/app/components/NewsletterSubscribe";

export default function LandingPage() {
    return (
        <Flex direction="column" style={{minHeight: "100vh"}}>
            <Box asChild>
                <header>
                    <Container size="4">
                        <Flex justify="between" align="center" py="4" px={{
                            initial: '4',
                            lg: '0'
                        }}>
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
                <Section py={{
                    initial: '4',
                    sm: '5',
                    md: '6',
                    lg: '9',
                }}>
                    <Container py={{
                        initial: '4',
                        sm: '5',
                        md: '6',
                        lg: '9',
                    }} px='8'>
                        <Grid columns={{
                            initial: '1',
                            md: '1fr 400px',
                            xl: '1fr 600px'
                        }} gap='6'>
                            <Flex direction="column" align={{
                                initial: 'center',
                                md: 'start'
                            }} justify="center" gap="4" flexBasis="1">
                                <Heading size="9" align={{
                                    initial: 'center',
                                    md: 'left'
                                }}>
                                    Trade Cards the Lekker Way
                                </Heading>
                                <Text size="5" color="gray" align={{
                                    initial: 'center',
                                    md: 'left'
                                }}>
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
                            <Flex justify="center" align="center">
                                <Box maxWidth="400px" maxHeight="400px" width="100%">
                                    <AspectRatio>
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
                                    </AspectRatio>
                                </Box>
                            </Flex>
                        </Grid>
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
                <Section size="4" id="contact">
                    <Container size="4">
                        <Flex direction="column" align="center" gap="6" px={{
                            initial: '6',
                            lg: '0'
                        }}>
                            <Heading size="8" align="center">
                                Stay Updated
                            </Heading>
                            <Text size="5" align="center" style={{maxWidth: "600px"}}>
                                Be the first to know when TCGMarket launches. Sign up for our newsletter to receive
                                exclusive updates
                                and offers.
                            </Text>
                            <Flex direction="column" align="center" gap="3"
                                  style={{width: "100%", maxWidth: "400px"}}>
                                <NewsletterSubscribe/>
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
                        <Flex justify="between" align="center" py="4" px={{
                            initial: '6',
                            lg: '0'
                        }}>
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
