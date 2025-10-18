<script lang="ts">
	import Cookies from "$lib/components/Cookies.svelte";
	import CourseSelection from "$lib/components/CourseSelection.svelte";
	import CourseWorkSelection from "$lib/components/CourseWorkSelection.svelte";
	import Dashboard from "$lib/components/Dashboard.svelte";
	import Google from "$lib/components/Google.svelte";

    let tokenResponse: any = $state(null);
    
    let courseSelected: ClassroomCourse | null = $state(null);
    let courseworkSelected: any | null = $state(null);

    let appState: string = $state("initial");

    function proceedToDashboard() {
        appState = "dashboard";
    }
</script>

<Cookies/>

<h1 class="text-center text-5xl p-4">Auto Java Grader</h1>
<div class="flex justify-center w-full m-auto gap-3">
    <Google bind:tokenResponse/>
</div>
<div class="flex flex-col items-center w-full">
    <div class="w-2/3">
        {#if tokenResponse}
            {#if appState === "initial"}
                <CourseSelection bind:tokenResponse bind:courseSelected/>

                {#if courseSelected}
                    <CourseWorkSelection bind:tokenResponse bind:courseSelected bind:courseworkSelected/>

                    {#if courseworkSelected}
                        <p class="my-4">You have selected coursework {courseworkSelected.title} under course {courseSelected.name}. Proceeding will take you to the grading dashboard. If you wish to return here, reload the page.</p>
                        <button type="button" class="btn preset-filled-primary-500" onclick={proceedToDashboard}>Go to dashboard</button>
                    {/if}
                {/if}
            {:else if appState === "dashboard"}
                <Dashboard bind:tokenResponse bind:courseSelected bind:courseworkSelected/>
            {/if}
        {/if}
    </div>
</div>