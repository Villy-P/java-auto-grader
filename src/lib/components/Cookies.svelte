<script>
	import Cookie from "@lucide/svelte/icons/cookie";

    function clearCookies() {
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        location.reload();
    }
</script>


<button type="button" class="btn-icon preset-filled absolute right-5 top-5 w-fit" title="Go" aria-label="Go" onclick={clearCookies}><Cookie size={18} /></button>