// src/emailSender.ts

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Send email using Gmail API.
 * @param auth OAuth2 client instance.
 * @param recipient Recipient's email address.
 * @param subject Email subject.
 * @param body Email body content.
 */
export async function sendEmails(auth: OAuth2Client, recipient: string, subject: string, body: string) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const emailContent = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
        const encodedMessage = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            auth,
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
