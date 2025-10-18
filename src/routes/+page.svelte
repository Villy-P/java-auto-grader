<script lang="ts">
	import Cookies from "$lib/components/Cookies.svelte";
	import CourseSelection from "$lib/components/CourseSelection.svelte";
	import CourseWorkSelection from "$lib/components/CourseWorkSelection.svelte";
	import Dashboard from "$lib/components/Dashboard.svelte";
	import Google from "$lib/components/Google.svelte";

    let tokenResponse: any = $state(null);

    let courseSelected: gapi.client.classroom.Course | null = $state(null);
    let courseworkSelected: gapi.client.classroom.CourseWork | null = $state(null);

    let appState: string = $state("initial");

    function proceedToDashboard() {
        appState = "dashboard";
    }
</script>

<Cookies/>

{#if appState === "initial"}
    <h1 class="text-center text-5xl p-4">Auto Java Grader</h1>
    <div class="flex justify-center w-full m-auto gap-3">
        <Google bind:tokenResponse/>
    </div>
{/if}
<div class="flex flex-col items-center w-full">
    {#if tokenResponse}
        {#if appState === "initial"}
            <div class="w-2/3">           
                <CourseSelection bind:tokenResponse bind:courseSelected bind:courseworkSelected/>

                {#if courseSelected}
                    <CourseWorkSelection bind:tokenResponse bind:courseSelected bind:courseworkSelected/>

                    {#if courseworkSelected}
                        <p class="my-4">You have selected coursework {courseworkSelected.title} under course {courseSelected.name}. Proceeding will take you to the grading dashboard. If you wish to return here, reload the page.</p>
                        <button type="button" class="btn preset-filled-primary-500" onclick={proceedToDashboard}>Go to dashboard</button>
                    {/if}
                {/if}
            </div>
        {:else if appState === "dashboard"}
            <Dashboard bind:tokenResponse bind:courseSelected bind:courseworkSelected/>
        {/if}
    {/if}
</div>