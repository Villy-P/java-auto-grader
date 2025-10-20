import fetch from 'node-fetch';
import { GOOGLE_REFRESH_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

async function getAccessToken() {
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        })
    });

    const data: any = await res.json();
    console.log(data)
    return data.access_token;  // This is what you can use for Google Drive API calls
}

export async function GET({ params }) {
    const accessToken = await getAccessToken();

    const driveFile = { id: decodeURIComponent(params.fileId), title: `${params.fileId}.java` };

    const fileRes = await fetch(
        `https://drive.google.com/uc?export=download&id=${driveFile.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const code = await fileRes.text();

    return new Response(JSON.stringify(code), {
        headers: { 'Content-Type': 'application/json' }
    });
}