<script lang="ts">
	import CourseSelection from "$lib/components/CourseSelection.svelte";
	import CourseWorkSelection from "$lib/components/CourseWorkSelection.svelte";
	import Google from "$lib/components/Google.svelte";

    let tokenResponse: any = $state(null);
    
    let courseSelected: number | null = $state(null);
</script>
<h1 class="text-center text-5xl p-4">Auto Java Grader</h1>

<div class="flex justify-center w-full m-auto gap-3">
    <Google bind:tokenResponse/>
</div>
<div class="flex flex-col items-center w-full">
    <div class="w-2/3">
        {#if tokenResponse}
            <CourseSelection bind:tokenResponse bind:courseSelected/>

            {#if courseSelected}
                <CourseWorkSelection bind:tokenResponse bind:courseSelected/>
            {/if}
        {/if}
    </div>
</div>