"use strict";
// src/taskScheduler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEmailProcessing = scheduleEmailProcessing;
const bullmq_1 = require("bullmq");
// import { sendEmails } from './emailSender'; // Replace with your actual email sender function
const emailContext_1 = require("./emailContext");
const googleapis_1 = require("googleapis");
// Initialize BullMQ queue
const emailQueue = new bullmq_1.Queue('email-processing');
/**
 * Send email using Gmail API.
 * @param auth OAuth2 client instance.
 * @param recipient Recipient's email address.
 * @param subject Email subject.
 * @param body Email body content.
 */
async function sendEmail(auth, recipient, subject, body) {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
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
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
/**
 * Schedule email processing task.
 * @param emailText Email content.
 * @param recipient Recipient's email address.
 * @param auth OAuth2 client instance.
 */
async function scheduleEmailProcessing(emailText, recipient, auth) {
    try {
        // Example: Classify email context and generate reply
        const classifiedCategory = await (0, emailContext_1.classifyEmailContext)(emailText);
        const generatedReply = await (0, emailContext_1.generateReply)(emailText);
        // Example: Send email with categorized label and generated reply
        await sendEmail(auth, recipient, `Re: ${classifiedCategory}`, generatedReply);
    }
    catch (error) {
        console.error('Error scheduling email processing:', error);
        throw error;
    }
}
// Worker to process email tasks
const emailWorker = new bullmq_1.Worker('email-processing', async (job) => {
    const { emailText, recipient, auth } = job.data;
    console.log(`Processing email for: ${recipient}`);
    try {
        // Example: Classify email context and generate reply
        const classifiedCategory = await (0, emailContext_1.classifyEmailContext)(emailText);
        const generatedReply = await (0, emailContext_1.generateReply)(emailText);
        // Example: Send email with categorized label and generated reply
        await sendEmail(auth, recipient, `Re: ${classifiedCategory}`, generatedReply);
        console.log(`Email processed and sent to ${recipient}`);
    }
    catch (error) {
        console.error(`Error processing email for ${recipient}:`, error);
        throw error;
    }
});
emailWorker.on('completed', job => {
    console.log(`Email processing job ${job.id} completed`);
});
emailWorker.on('failed', (job, error) => {
    if (job) {
        console.error(`Email processing job ${job.id} failed with error: ${error.message}`);
    }
    else {
        console.error(`Email processing job failed with error: ${error.message}`);
    }
});
exports.default = emailQueue;
