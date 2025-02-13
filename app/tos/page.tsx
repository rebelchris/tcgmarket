import {Box, Container} from "@radix-ui/themes";

export default function TOSPage() {
    return (
        <Container size="1">
            <Box px={{
                initial: '6',
                lg: '0'
            }}>
                <h1>TCGMarket Terms of Service</h1>

                <p>Welcome to TCGMarket! By accessing or using our platform (the &quot;Service&quot;), you agree to be
                    bound by
                    these Terms of Service (&quot;Terms&quot;). Please read them carefully.</p>

                <h2>1. Acceptance of Terms</h2>
                <p>By using the Service, you represent that you are at least 18 years old and have the legal capacity to
                    enter into a binding agreement. If you are using the Service on behalf of a company or other legal
                    entity, you represent that you have the authority to bind such entity to these Terms.</p>

                <h2>2. Description of Service</h2>
                <p>TCGMarket is an online platform that allows users to buy, sell, and trade trading cards. Users can
                    create profiles, list cards for sale, browse listings, connect with other users, and communicate
                    regarding trades. </p>

                <h2>3. User Accounts</h2>
                <p>To use certain features of the Service, you may need to create an account. You are responsible for
                    maintaining the confidentiality of your account credentials and are liable for all activities that
                    occur under your account. You agree to provide accurate and complete information when creating your
                    account.</p>

                <h2>4. User Responsibilities</h2>
                <p>You agree to use the Service in accordance with these Terms and all applicable laws and regulations.
                    You are solely responsible for the content you post or transmit through the Service. You agree not
                    to:</p>
                <ul>
                    <li>List or sell prohibited items (e.g., counterfeit cards, stolen goods).</li>
                    <li>Engage in any unlawful or fraudulent activity.</li>
                    <li>Impersonate another user or misrepresent your identity.</li>
                    <li>Infringe on any intellectual property rights.</li>
                    <li>Interfere with the operation of the Service.</li>
                    <li>Use the Service for any purpose other than its intended purpose.</li>
                </ul>

                <h2>5. Fees and Payments</h2>
                <p>[Clearly describe any fees associated with using the platform, payment methods accepted, and refund
                    policies. Be specific.]</p>

                <h2>6. Intellectual Property</h2>
                <p>All content on the Service, including but not limited to text, graphics, logos, and software, is the
                    property of TCGMarket or its licensors and is protected by copyright and other intellectual property
                    laws.</p>

                <h2>7. Limitation of Liability</h2>
                <p>[This section is crucial and legally complex. Consult with a lawyer to draft appropriate language
                    limiting your liability.]</p>

                <h2>8. Indemnification</h2>
                <p>[This section is also crucial and legally complex. Consult with a lawyer to draft appropriate
                    language regarding indemnification.]</p>

                <h2>9. Termination</h2>
                <p>We may terminate your access to the Service at any time, with or without cause, including but not
                    limited to your violation of these Terms.</p>

                <h2>10. Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of South Africa.</p>

                <h2>11. Changes to Terms</h2>
                <p>We may update these Terms at any time. We will notify you of any material changes by [describe your
                    notification method, e.g., posting a notice on the Service, sending an email]. Your continued use of
                    the Service after such notice constitutes your acceptance of the revised Terms.</p>

                <h2>12. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at: [Your Contact Information]</p>
            </Box>
        </Container>
    )
}
