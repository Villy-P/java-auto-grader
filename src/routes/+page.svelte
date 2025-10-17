<script lang="ts">
	import Google from "$lib/components/Google.svelte";

    let tokenResponse: any = $state(null);

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

    let classroomCourses: Promise<{courses: ClassroomCourse[]}> = $derived(getCourses());
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