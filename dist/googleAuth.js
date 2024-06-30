"use strict";
// src/googleAuth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuthClient = createOAuthClient;
exports.getAuthUrl = getAuthUrl;
exports.getToken = getToken;
exports.loadToken = loadToken;
exports.setCredentials = setCredentials;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; // Adjust scopes based on your requirements
const CREDENTIALS_PATH = './credentials.json'; // Update with the correct path
const TOKEN_PATH = 'token.json'; // Path to store OAuth tokens
/**
 * Load client credentials from the file.
 */
const credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, 'utf8'));
/**
 * Create an OAuth2 client with the given credentials.
 */
function createOAuthClient() {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    return new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}
/**
 * Get authorization URL for OAuth flow.
 * Redirect user to this URL to obtain authorization code.
 */
function getAuthUrl(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    return authUrl;
}
/**
 * Exchange authorization code for OAuth tokens.
 * Store tokens in the token path specified.
 */
async function getToken(oAuth2Client, code) {
    const { tokens } = await oAuth2Client.getToken(code);
    fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    return tokens;
}
/**
 * Load OAuth tokens from the token path.
 */
function loadToken() {
    const tokenContent = fs_1.default.readFileSync(TOKEN_PATH, 'utf8');
    return JSON.parse(tokenContent);
}
/**
 * Set credentials on an OAuth client.
 */
function setCredentials(oAuth2Client, tokens) {
    oAuth2Client.setCredentials(tokens);
}
