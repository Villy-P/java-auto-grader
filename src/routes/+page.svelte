<script>
	import Google from "$lib/components/Google.svelte";

</script>
<h1 class="text-center text-5xl p-4">Auto Java Grader</h1>

<div class="flex justify-center w-full gap-3">
    <label class="label w-1/2">
        <span class="label-text">Server Location</span>
        <input class="input" type="text" placeholder="e.x. localhost:3000" />
    </label>
    <Google/>
</div>