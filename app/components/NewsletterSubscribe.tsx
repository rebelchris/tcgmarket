"use client"
import React, {FormEvent, useState} from "react";
import {Button, Flex, Text, TextField} from "@radix-ui/themes";

export const NewsletterSubscribe = () => {
    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsError(false);
        try {
            const response = await fetch('/api/subscribe', { // Call your Vercel function
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email.trim().toLowerCase()}),
            });

            if (response.ok) {
                setEmail(''); // Clear the form
            } else {
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setIsError(true);
        }
    };

    return (
        <>
            <form style={{width: "100%"}} onSubmit={handleSubmit}>
                <Flex gap="2">
                    <TextField.Root onChange={(e) => setEmail(e.target.value)} size="3" placeholder="Email address…"
                                    type="email"
                                    color={isError ? 'red' : 'gray'} required
                                    style={{flexGrow: 1}}>
                        <TextField.Slot/>
                    </TextField.Root>
                    <Button size='3' type="submit">Subscribe</Button>
                </Flex>
                {isError && <Text color="red">Something went wrong. Please try again.</Text>}
            </form>
        </>
    );
}
