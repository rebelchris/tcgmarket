import SignIn from "@/app/components/SignIn";
import {auth} from "auth";
import {Profile} from "@/app/components/profile/Profile";

export default async function UserOrLogin() {
    const session = await auth()

    if (!session?.user) return <SignIn/>

    return (
        <Profile user={session.user}/>
    )
}
