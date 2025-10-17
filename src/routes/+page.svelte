<script lang="ts">
	import CourseSelection from "$lib/components/CourseSelection.svelte";
	import Google from "$lib/components/Google.svelte";

    let tokenResponse: any = $state(null);
    
    async function getCourseWork() {
        if (!tokenResponse || !tokenResponse.access_token || !courseSelected)
            return null;
        const data = await fetch(`https://classroom.googleapis.com/v1/courses/${courseSelected}/courseWork`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        console.log(result);
        return result;
    }

    let classroomCourseWork = $derived(getCourseWork());
    
    let courseSelected: number | null = $state(null);
</script>
<h1 class="text-center text-5xl p-4">Auto Java Grader</h1>

<div class="flex justify-center w-2/3 m-auto gap-3">
    <label class="label">
        <span class="label-text">Server Location</span>
        <input class="input" type="text" placeholder="e.x. localhost:3000" />
    </label>
    <Google bind:tokenResponse/>
</div>
<div class="flex flex-col items-center w-full">
    <div class="w-2/3">
        {#if tokenResponse}
            <CourseSelection bind:tokenResponse bind:courseSelected/>

            {#await classroomCourseWork}
                <p>Loading your classwork...</p>
            {:then courseWork} 
                <h2 class="text-2xl mt-4 mb-2">Next, select an assignment:</h2>
                {#if courseWork && courseWork.courseWork && courseWork.courseWork.length > 0}
                    <label class="label">
                        <span class="label-text">Course Work</span>
                        <select class="select">
                            {#each courseWork.courseWork as work}
                                <option value={work.id}>{work.title}</option>
                            {/each}
                        </select>
                    </label>
                {:else}
                    <p>Couldn't find any coursework.</p>
                {/if}
            {/await}
        {/if}
    </div>
</div>