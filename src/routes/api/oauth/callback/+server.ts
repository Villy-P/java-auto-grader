import type { RequestHandler } from '@sveltejs/kit';
import fetch from 'node-fetch';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

const clientId = GOOGLE_CLIENT_ID!;
const clientSecret = GOOGLE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:5173/api/oauth/callback';

export const GET: RequestHandler = async ({ url }) => {
    const code = url.searchParams.get('code');
    if (!code) return new Response('Missing code', { status: 400 });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        })
    });

    const tokens = await tokenRes.json();

    console.log('Tokens:', tokens); // contains access_token + refresh_token

    // 🔒 Store refresh_token securely (e.g., DB or .env for now)
    return new Response('Authorization complete. Check console for tokens.');
};