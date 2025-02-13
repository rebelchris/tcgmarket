"use client"
import React, {useState} from "react";
import {Button, Flex, TextField} from "@radix-ui/themes";

export const NewsletterSubscribe = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/subscribe', { // Call your Vercel function
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email.trim().toLowerCase()}),
            });

            const data = await response.json();
            console.log('data', data)

            if (response.ok) {
                setEmail(''); // Clear the form
            } else {
                // TODO: Something wrong
            }
        } catch (err) {
            // TODO: Something wrong
        }
    };

    return (
        <>
            <form style={{width: "100%"}} onSubmit={handleSubmit}>
                <Flex gap="2">
                    <TextField.Root onChange={(e) => setEmail(e.target.value)} size="3" placeholder="Search the docs…"
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
