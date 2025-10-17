<script lang="ts">
    import { onMount } from "svelte";

    let tokenClient: any;
    let { tokenResponse = $bindable() } = $props();

    onMount(() => {
        // @ts-ignore
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '315808916557-l71t37pku56pahaumffp45o11h1u145f.apps.googleusercontent.com',
            scope: [
                'https://www.googleapis.com/auth/classroom.courses.readonly',
                'https://www.googleapis.com/auth/classroom.coursework.students.readonly'
            ].join(' '),
            callback: (token: any) => {
                tokenResponse = token;
            },
        });

        // @ts-ignore
        google.accounts.id.renderButton( document.getElementById("g_id_signin"), { theme: "filled_black", colorScheme: "dark", size: "large" } );
    });

    function requestAccessToken() {
        tokenClient.requestAccessToken();
    }
</script>

{#if !tokenResponse}
    <button type="button" class="btn preset-filled" onclick={requestAccessToken}>Sign in with Google</button>
{/if}