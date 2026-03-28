<script lang="ts">
	import { FloatingSelect } from "@valerius_petrini/corekit-ui";

    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() }: {
        tokenResponse: any,
        courseSelected: gapi.client.classroom.Course | null,
        courseworkSelected: gapi.client.classroom.CourseWork | null
    } = $props();

    async function getCourses() {
        if (!tokenResponse || !tokenResponse.access_token)
            return null;
        const data = await fetch('https://classroom.googleapis.com/v1/courses?teacherId=me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        return result;
    }

    let classroomCourses: Promise<{courses: gapi.client.classroom.Course[]}> = $derived(getCourses());
</script>

{#await classroomCourses}
    <p>Loading your courses...</p>
{:then courses} 
    <h2 class="text-2xl mt-4 mb-2">First, select a course:</h2>
    {#if courses && courses.courses && courses.courses.length > 0}
        <FloatingSelect options={courses.courses.map((c) => ({ value: c, label: c.name || "" }))} bind:value={courseSelected} divName="w-full">Courses</FloatingSelect>
    {:else}
        <p>Couldn't find a course you teach.</p>
    {/if}
{:catch error}
    <p class="text-red-500">Error fetching courses: {error.message}</p>
{/await}