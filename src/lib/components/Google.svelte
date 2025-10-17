<script lang="ts">
    import { onMount } from "svelte";

    let tokenClient: any;

    onMount(() => {
        // @ts-ignore
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '315808916557-l71t37pku56pahaumffp45o11h1u145f.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/classroom.courses.readonly',
            callback: (tokenResponse: any) => {
                console.log('Access Token:', tokenResponse.access_token);
                fetch('https://classroom.googleapis.com/v1/courses', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
            },
        });

        // @ts-ignore
        google.accounts.id.renderButton( document.getElementById("g_id_signin"), { theme: "filled_black", colorScheme: "dark", size: "large" } );
    });

    function requestAccessToken() {
        tokenClient.requestAccessToken();
    }
</script>

<button type="button" class="btn preset-filled" on:click={requestAccessToken}>Sign in with Google</button>