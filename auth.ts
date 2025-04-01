import NextAuth from "next-auth"
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {db} from "@/db/drizzle";
import Google from "@auth/core/providers/google";

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session({session, user}) {
            if (session.user) {
                // @ts-ignore
                session.user.id = user.id
            }
            return session
        },
    }
})
