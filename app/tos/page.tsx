import {Box, Container} from "@radix-ui/themes";

export default function TOSPage() {
    return (
        <Container size="2">
            <Box px={{
                initial: '6',
                lg: '0'
            }} className='prose'>
                <h1>TCGmarket Terms of Service</h1>

                <p>Welcome to TCGmarket (https://tcgmarket.co.za/). By accessing or using our platform, you agree to be
                    bound by these Terms of Service ("Terms"). Please read them carefully. As an individual operating
                    TCGmarket, I, Chris Bongers, am providing this service to connect trading card enthusiasts within
                    South Africa.</p>

                <h2>1. Acceptance of Terms</h2>
                <p>By using TCGmarket, you represent that you are at least 18 years old and have the legal capacity to
                    enter into a binding agreement. If you are accessing TCGmarket on behalf of a minor, you are solely
                    responsible for their actions on the platform.</p>

                <h2>2. Description of Service</h2>
                <p>TCGmarket is an online platform that facilitates connections between individuals interested in
                    trading cards within South Africa. Users can create accounts, upload listings of their cards, browse
                    other users' listings, and leave reviews for other users. TCGmarket does not facilitate direct sales
                    or transactions between users. All trades, sales, or exchanges are conducted directly between
                    users.</p>

                <h2>3. User Accounts</h2>
                <p>To access certain features, you must create an account. You are responsible for maintaining the
                    confidentiality of your account credentials. You agree to provide accurate and complete information
                    during registration. You are responsible for all activity that occurs under your account.</p>

                <h2>4. User Responsibilities</h2>
                <p>You agree to use TCGmarket in accordance with these Terms and all applicable laws. You are solely
                    responsible for the content you upload and your interactions with other users. You agree not to:</p>
                <ul>
                    <li>List or trade prohibited items (e.g., counterfeit cards, stolen goods).</li>
                    <li>Engage in fraudulent activity.</li>
                    <li>Impersonate another user.</li>
                    <li>Infringe on intellectual property rights.</li>
                    <li>Interfere with the operation of TCGmarket.</li>
                    <li>Use TCGmarket for any unlawful purpose.</li>
                    <li>Post harmful, offensive, or inappropriate content.</li>
                    <li>Engage in harassment or bullying.</li>
                    <li>Provide false reviews.</li>
                </ul>

                <h2>5. Content Uploaded by Users</h2>
                <p>You retain ownership of the content you upload to TCGmarket. By uploading content, you grant
                    TCGmarket a non-exclusive, royalty-free, worldwide license to use, display, and distribute your
                    content on the platform. You are responsible for ensuring that your content does not infringe on any
                    third-party rights.</p>

                <h2>6. Reviews</h2>
                <p>Users can leave reviews for other users. You are responsible for ensuring your reviews are truthful
                    and respectful. TCGmarket is not responsible for the content of user reviews.</p>

                <h2>7. Disclaimer of Warranties</h2>
                <p>TCGmarket is provided "as is" and "as available." I make no warranties, express or implied, regarding
                    the operation of TCGmarket or the content available on it. I do not warrant that TCGmarket will be
                    error-free or uninterrupted.</p>

                <h2>8. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, I am not liable for any direct, indirect, incidental,
                    consequential, or punitive damages arising out of your use of TCGmarket. This includes, but is not
                    limited to, damages for loss of profits, data, or other intangible losses. TCGmarket is a platform
                    to facilitate contact. All trades, sales, or exchanges are conducted directly between users, and I
                    am not liable for any issues arising from such interactions.</p>

                <h2>9. Indemnification</h2>
                <p>You agree to indemnify and hold me harmless from any claims, damages, or expenses arising from your
                    use of TCGmarket or your violation of these Terms.</p>

                <h2>10. Termination</h2>
                <p>I may terminate your access to TCGmarket at any time, with or without cause, including if you violate
                    these Terms.</p>

                <h2>11. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of South Africa.</p>

                <h2>12. Changes to Terms</h2>
                <p>I may update these Terms at any time. I will notify you of any material changes by posting a notice
                    on TCGmarket. Your continued use of TCGmarket after such notice constitutes your acceptance of the
                    revised Terms.</p>

                <h2>13. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact me at: chrisbongers@gmail.com</p>
            </Box>
        </Container>
    )
}
