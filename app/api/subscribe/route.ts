export async function POST(req) { // Use POST for POST requests
    const {email} = await req.json();

    if (!email) {
        return Response.json({error: "Email is required"}, {status: 400});
    }

    const response = await fetch("https://api.sendfox.com/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SENDFOX_TOKEN}`,
        },
        body: JSON.stringify({
            email,
            lists: [562103]
        }),
    });

    if (!response.ok) {
        return Response.json({error: "Failed to subscribe"}, {status: 500});
    }

    return Response.json({message: "Subscribed successfully"});
}
