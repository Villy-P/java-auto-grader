<script lang="ts">
    import { onMount } from "svelte";

    let tokenClient: any;
    let { tokenResponse = $bindable() } = $props();

    onMount(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('g_token='));
        if (cookie) {
            const token = cookie.split('=')[1];
            tokenResponse = { access_token: token };
            return;
        }

        // @ts-ignore
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '315808916557-goudv1fmntb5d1vukuc2jf4lvkq56750.apps.googleusercontent.com',
            scope: [
                'https://www.googleapis.com/auth/classroom.courses.readonly',
                'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
                'https://www.googleapis.com/auth/classroom.rosters.readonly',
                'https://www.googleapis.com/auth/classroom.profile.emails',
                "https://www.googleapis.com/auth/drive.readonly",
            ].join(' '),
            callback: (token: any) => {
                tokenResponse = token;
                document.cookie = `g_token=${token.access_token}; path=/; max-age=${token.expires_in}`;
            },
        });
    });

    function requestAccessToken() {
        tokenClient.requestAccessToken();
    }
</script>

{#if !tokenResponse}
    <button type="button" class="btn preset-tonal-primary flex items-center justify-center" onclick={requestAccessToken}>
        <img src="/google.svg" alt="Google Logo" class="w-6 h-6 mr-2"/>
        <span>Sign in with Google</span>
    </button>
{/if}