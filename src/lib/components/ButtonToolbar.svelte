<script>
    import LogOut from "@lucide/svelte/icons/log-out";
    import RefreshCCW from "@lucide/svelte/icons/refresh-ccw";
    import { Tooltip } from "flowbite-svelte";

    function logout() {
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        location.reload();
    }
</script>

<button type="button" class="btn-icon preset-filled w-fit h-fit z-50 ml-auto"><RefreshCCW size={14}/></button>
<Tooltip placement="bottom">Re-run Student Submission</Tooltip>
<button type="button" class="btn-icon preset-filled w-fit h-fit" onclick={logout}><LogOut size={14}/></button>
<Tooltip placement="bottom">Sign out</Tooltip>