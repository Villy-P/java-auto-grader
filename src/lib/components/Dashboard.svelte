<script lang="ts">
    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() }: {
        tokenResponse: any,
        courseSelected: gapi.client.classroom.Course | null,
        courseworkSelected: gapi.client.classroom.CourseWork | null
    } = $props();

    let users: Map<string, any> = new Map();
    
    async function getStudentSubmissions() {
        if (!tokenResponse || !tokenResponse.access_token || !courseSelected || !courseworkSelected)
            return null;
        const data = await fetch(`https://classroom.googleapis.com/v1/courses/${courseSelected.id}/courseWork/${courseworkSelected.id}/studentSubmissions`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        const studentSubmissions = result.studentSubmissions;

        const profiles = await Promise.all(
            studentSubmissions.map((sub: any) => getStudentProfile(sub.userId))
        );

        profiles.forEach((profile, i) => {
            users.set(studentSubmissions[i].userId, profile);
        });

        return result;
    }

    async function getStudentProfile(userId: string) {
        if (users.has(userId))
            return users.get(userId);
        if (!tokenResponse || !tokenResponse.access_token)
            return null;
        const data = await fetch(`https://classroom.googleapis.com/v1/userProfiles/${userId}`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });
        const result = await data.json();
        return result;
    }

    let classroomStudentSubmissions = $derived(getStudentSubmissions());
</script>

<div class="w-full h-screen flex">
    <div class="w-1/3">
        {#await classroomStudentSubmissions}
            <p>Loading your submissions...</p>
        {:then studentSubmissions} 
            {#if studentSubmissions && studentSubmissions.studentSubmissions && studentSubmissions.studentSubmissions.length > 0}
                {#each Array.from(users.values()) as user}
                    <div class="border-b p-2">
                        <p class="font-bold">{user.name.fullName}</p>
                        <p class="text-sm text-gray-600">{user.emailAddress}</p>
                    </div>
                {/each}
            {:else}
                <p>Couldn't find any submissions.</p>
            {/if}
        {/await}
    </div>
    <div class="w-2/3"></div>
</div>