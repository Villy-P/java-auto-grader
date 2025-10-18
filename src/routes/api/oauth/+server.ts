import type { RequestHandler } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID } from '$env/static/private';

const clientId = GOOGLE_CLIENT_ID;
console.log("Client ID:", clientId);
const redirectUri = 'http://localhost:5173/api/oauth/callback';
const scopes = [
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    "https://www.googleapis.com/auth/drive.readonly",
].join(' ');

export const GET: RequestHandler = async () => {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent'); // ensures refresh_token is returned

    return new Response(null, {
        status: 302,
        headers: { Location: authUrl.toString() }
    });
};