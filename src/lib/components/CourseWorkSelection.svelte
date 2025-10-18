<script lang="ts">
    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() } = $props();
    
    async function getCourseWork() {
        if (!tokenResponse || !tokenResponse.access_token || !courseSelected)
            return null;
        const data = await fetch(`https://classroom.googleapis.com/v1/courses/${courseSelected.id}/courseWork`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        return result;
    }

    let classroomCourseWork = $derived(getCourseWork());
</script>

{#await classroomCourseWork}
    <p>Loading your classwork...</p>
{:then courseWork} 
    <h2 class="text-2xl mt-4 mb-2">Next, select an assignment:</h2>
    {#if courseWork && courseWork.courseWork && courseWork.courseWork.length > 0}
        <label class="label">
            <span class="label-text">Course Work</span>
            <select class="select" bind:value={courseworkSelected}>
                {#each courseWork.courseWork as work}
                    <option value={work}>{work.title}</option>
                {/each}
            </select>
        </label>
    {:else}
        <p>Couldn't find any coursework.</p>
    {/if}
{/await}