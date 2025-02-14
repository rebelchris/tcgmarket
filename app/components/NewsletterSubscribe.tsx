"use client"
import React, {FormEvent, useState} from "react";
import {Button, Flex, TextField} from "@radix-ui/themes";

export const NewsletterSubscribe = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

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
                // TODO: Something wrong
            }
        } catch (err) {
            // TODO: Something wrong
            console.error(err);
        }
    };

    return (
        <>
            <form style={{width: "100%"}} onSubmit={handleSubmit}>
                <Flex gap="2">
                    <TextField.Root onChange={(e) => setEmail(e.target.value)} size="3" placeholder="Email address…"
                                    type="email"
                                    style={{flexGrow: 1}}>
                        <TextField.Slot/>
                    </TextField.Root>
                    <Button size='3' type="submit">Subscribe</Button>
                </Flex>
            </form>
        </>
    );
}
