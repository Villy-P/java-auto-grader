<script lang="ts">
    let { tokenResponse = $bindable(), courseSelected = $bindable() } = $props();

    async function getCourses() {
        if (!tokenResponse || !tokenResponse.access_token)
            return null;
        const data = await fetch('https://classroom.googleapis.com/v1/courses?teacherId=me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        console.log(result);
        return result;
    }

    let classroomCourses: Promise<{courses: ClassroomCourse[]}> = $derived(getCourses());
</script>

{#await classroomCourses}
    <p>Loading your courses...</p>
{:then courses} 
    <h2 class="text-2xl mt-4 mb-2">First, select a course:</h2>
    {#if courses && courses.courses && courses.courses.length > 0}
        <label class="label">
            <span class="label-text">Courses</span>
            <select class="select" bind:value={courseSelected}>
                {#each courses.courses as course}
                    <option value={course.id}>{course.name}</option>
                {/each}
            </select>
        </label>
    {:else}
        <p>Couldn't find a course you teach.</p>
    {/if}
{:catch error}
    <p class="text-red-500">Error fetching courses: {error.message}</p>
{/await}