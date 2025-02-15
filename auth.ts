import GoogleProvider from 'next-auth/providers/google';
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {db} from "@/db/drizzle";

export const authOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session({session, user}) {
            session.user.id = user.id
            return session
        },
    }
}
