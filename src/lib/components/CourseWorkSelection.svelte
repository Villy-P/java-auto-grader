<script lang="ts">
	import { FloatingSelect } from "@valerius_petrini/corekit-ui";

    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() }: {
        tokenResponse: any,
        courseSelected: gapi.client.classroom.Course | null,
        courseworkSelected: gapi.client.classroom.CourseWork | null
    } = $props();
    
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
        <FloatingSelect options={courseWork.courseWork.map((c: any) => ({ value: c, label: c.title || "" }))} bind:value={courseworkSelected} divName="w-full">Course Work</FloatingSelect>
    {:else}
        <p>Couldn't find any coursework.</p>
    {/if}
{/await}