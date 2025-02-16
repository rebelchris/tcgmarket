import GoogleProvider from 'next-auth/providers/google';
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {db} from "@/db/drizzle";
import {NextAuthOptions} from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
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
}
