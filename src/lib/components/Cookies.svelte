<script>
	import Cookie from "@lucide/svelte/icons/cookie";
    import LogOut from "@lucide/svelte/icons/log-out";
    import { Tooltip } from "flowbite-svelte";

    function clearCookies() {
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        location.reload();
    }
</script>


<button type="button" class="btn-icon preset-filled w-fit" onclick={clearCookies}><LogOut size={18} /></button>
<Tooltip placement="bottom">Sign out</Tooltip>