// src/googleAuth.ts

import { google, Auth } from 'googleapis';
import { OAuth2Client, Credentials } from 'google-auth-library';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; // Adjust scopes based on your requirements

const CREDENTIALS_PATH = './credentials.json'; // Update with the correct path

const TOKEN_PATH = 'token.json'; // Path to store OAuth tokens

/**
 * Load client credentials from the file.
 */
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

/**
 * Create an OAuth2 client with the given credentials.
 */
export function createOAuthClient(): OAuth2Client {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  if (!redirect_uris || redirect_uris.length === 0) {
    throw new Error('Invalid redirect URIs in credentials file.');
  }
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

/**
 * Get authorization URL for OAuth flow.
 * Redirect user to this URL to obtain authorization code.
 */
export function getAuthUrl(oAuth2Client: OAuth2Client): string {
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
export async function getToken(oAuth2Client: OAuth2Client, code: string): Promise<Credentials> {
  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return tokens;
}

/**
 * Load OAuth tokens from the token path.
 */
export function loadToken(): Credentials | null {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokenContent = fs.readFileSync(TOKEN_PATH, 'utf8');
    return JSON.parse(tokenContent);
  }
  return null;
}

/**
 * Set credentials on an OAuth client.
 */
export function setCredentials(oAuth2Client: OAuth2Client, tokens: Credentials) {
  oAuth2Client.setCredentials(tokens);
}




// import { google, Auth } from 'googleapis';
// import { OAuth2Client, Credentials } from 'google-auth-library';
// import fs from 'fs';

// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; // Adjust scopes based on your requirements

// const CREDENTIALS_PATH = './credentials.json'; // Update with the correct path

// const TOKEN_PATH = 'token.json'; // Path to store OAuth tokens

// /**
//  * Load client credentials from the file.
//  */
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

// /**
//  * Create an OAuth2 client with the given credentials.
//  */
// export function createOAuthClient(): OAuth2Client {
//   const { client_secret, client_id, redirect_uris } = credentials.web;
//   return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// }

// /**
//  * Get authorization URL for OAuth flow.
//  * Redirect user to this URL to obtain authorization code.
//  */
// export function getAuthUrl(oAuth2Client: OAuth2Client): string {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   return authUrl;
// }

// /**
//  * Exchange authorization code for OAuth tokens.
//  * Store tokens in the token path specified.
//  */
// export async function getToken(oAuth2Client: OAuth2Client, code: string): Promise<Credentials> {
//   const { tokens } = await oAuth2Client.getToken(code);
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
//   return tokens;
// }

// /**
//  * Load OAuth tokens from the token path.
//  */
// export function loadToken(): Credentials {
//   const tokenContent = fs.readFileSync(TOKEN_PATH, 'utf8');
//   return JSON.parse(tokenContent);
// }

// /**
//  * Set credentials on an OAuth client.
//  */
// export function setCredentials(oAuth2Client: OAuth2Client, tokens: Credentials) {
//   oAuth2Client.setCredentials(tokens);
// }
// {/*** */}