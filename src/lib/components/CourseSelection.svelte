<script lang="ts">
	import { Select, Skeleton } from "@valerius_petrini/corekit-ui";

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
    <Skeleton></Skeleton>
{:then courses} 
    {#if courses && courses.courses && courses.courses.length > 0}
        <Select 
            placeholder="Select a course"
            label="Course"
            options={courses.courses.map((c) => ({ value: c, label: c.name || "" }))} 
            bind:value={courseSelected}>
            Courses
        </Select>
    {:else}
        <p>Couldn't find a course you teach.</p>
    {/if}
{:catch error}
    <p class="text-red-500">Error fetching courses: {error.message}</p>
{/await}