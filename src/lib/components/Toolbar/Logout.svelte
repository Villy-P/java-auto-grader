<script lang="ts">
    import LogOut from "@lucide/svelte/icons/log-out";
    import { Student, SubmissionStatus } from "$lib/scripts/user";
    import { Tooltip } from "flowbite-svelte";

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

<button type="button" class="btn-icon preset-filled w-fit h-fit" onclick={logout}><LogOut size={14}/></button>
<Tooltip placement="bottom">Sign out</Tooltip>