<script lang="ts">
    import LogOut from "@lucide/svelte/icons/log-out";
    import { Student, SubmissionStatus } from "$lib/scripts/user";
    import { Tooltip } from "flowbite-svelte";
	import { Button } from "@valerius_petrini/corekit-ui";

    let { selectedStudent = $bindable() }: {
        selectedStudent: Student | undefined,
    } = $props();

    function logout() {
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        location.reload();
    }
</script>

<Button color="sub" onclick={logout} icon><LogOut size={14}/></Button>
<Tooltip placement="bottom">Sign out</Tooltip>