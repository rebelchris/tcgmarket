import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import {Box, Container, Flex, Text, Theme} from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TCGmarket",
    description: "Your South African Trading Card Marketplace",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Theme accentColor="purple" grayColor="sand" panelBackground="solid" radius="large">
            <Flex direction="column" style={{minHeight: "100vh"}}>
                <Box asChild>
                    <header>
                        <Container size="4">
                            <Flex justify="between" align="center" py="4" px={{
                                initial: '4',
                                lg: '0'
                            }}>
                                <Link href="/">
                                    <Image src='https://cdn.tcgmarket.co.za/TCGMARKET.png' alt='TCGmarket' width={112}
                                           height={78}/>
                                    <span className="sr-only">TCGmarket</span>
                                </Link>
                            </Flex>
                        </Container>
                    </header>
                </Box>
                {children}
                <Box asChild>
                    <footer>
                        <Container size="4">
                            <Flex justify="between" align="center" py="4" px={{
                                initial: '6',
                                lg: '0'
                            }}>
                                <Text size="1" color="gray">
                                    © 2025 TCGmarket. All rights reserved.
                                </Text>
                                <Flex gap="4">
                                    <Link href="/tos">
                                        <Text size="1">Terms of Service</Text>
                                    </Link>
                                    <Link href="/privacy">
                                        <Text size="1">Privacy</Text>
                                    </Link>
                                </Flex>
                            </Flex>
                        </Container>
                    </footer>
                </Box>
            </Flex>
        </Theme>
        </body>
        </html>
    );
}
