"use strict";
// src/app.ts
Object.defineProperty(exports, "__esModule", { value: true });
const googleAuth_1 = require("./googleAuth");
const taskScheduler_1 = require("./taskScheduler");
const emailContext_1 = require("./emailContext");
async function main() {
    try {
        // Example: Google OAuth flow
        const oAuth2Client = (0, googleAuth_1.createOAuthClient)();
        const authUrl = (0, googleAuth_1.getAuthUrl)(oAuth2Client);
        console.log('Authorize this app by visiting:', authUrl);
        // Wait for authorization code from the redirect URI
        const code = 'authorization_code_from_redirect_uri';
        const tokens = await (0, googleAuth_1.getToken)(oAuth2Client, code);
        (0, googleAuth_1.setCredentials)(oAuth2Client, tokens);
        // Example: Schedule email processing task
        const emailText = 'Sample email text';
        const recipient = 'recipient@example.com';
        (0, taskScheduler_1.scheduleEmailProcessing)(emailText, recipient, oAuth2Client);
        // Example: Classify email context
        const classifiedCategory = await (0, emailContext_1.classifyEmailContext)(emailText);
        console.log('Classified category:', classifiedCategory);
        // Example: Generate reply
        const generatedReply = await (0, emailContext_1.generateReply)(emailText);
        console.log('Generated reply:', generatedReply);
    }
    catch (error) {
        console.error('Error in main:', error);
    }
}
main();
