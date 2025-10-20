<script lang="ts">
	import { Student } from "$lib/scripts/user";
	import { onMount } from "svelte";

    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() }: {
        tokenResponse: any,
        courseSelected: gapi.client.classroom.Course | null,
        courseworkSelected: gapi.client.classroom.CourseWork | null
    } = $props();

    let users: Student[] = $state([]);

    onMount(async () => {
        classroomStudentSubmissions = await getStudentSubmissions();
    });
    
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

        users = await Promise.all(
            studentSubmissions.map(async (sub: any, index: number) => {
                let javaContent = '';
                if (sub.assignmentSubmission && sub.assignmentSubmission.attachments) {
                    for (const attachment of sub.assignmentSubmission.attachments) {
                        if (attachment.driveFile) {
                            const fileContent = await downloadFile(attachment.driveFile.id);
                            javaContent += `// File: ${attachment.driveFile.title}\n${fileContent}\n\n`;
                        }
                    }
                }
                return {
                    id: sub.userId,
                    data: profiles[index],
                    javaContent: javaContent.trim()
                } as Student;
            })
        );


        return result;
    }

    async function downloadFile(fileId: string) {
        const token = document.cookie.split('; ').find(row => row.startsWith('g_token='))?.split('=')[1];
        tokenResponse = { access_token: token };
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`
            }
        });

        if (!res.ok) {
        throw new Error('Failed to download file');
        }

        const text = await res.text();
        return text;
    }

    async function getStudentProfile(userId: string) {
        const user = users.find(u => u.id === userId);
        if (user)
            return user.data;
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

    let classroomStudentSubmissions = $state<any>(null);

    let selectedStudent: Student | undefined = $state(undefined);
</script>

<div class="w-full h-screen flex">
    <div class="w-1/3 max-h-screen overflow-y-auto border-r">
        {#await classroomStudentSubmissions}
            <p>Loading your submissions...</p>
        {:then studentSubmissions} 
            {#if studentSubmissions && studentSubmissions.studentSubmissions && studentSubmissions.studentSubmissions.length > 0}
                {#each users as user}
                    <button class:bg-gray-900={selectedStudent === user} class="border-b p-2 cursor-pointer w-full text-left" onclick={() => selectedStudent = user}>
                        <p class="font-bold">{user.data.name?.fullName}</p>
                        <p class="text-sm">{user.data.emailAddress}</p>
                    </button>
                {/each}
            {:else}
                <p>Couldn't find any submissions.</p>
            {/if}
        {/await}
    </div>
    <div class="w-2/3">
        <label class="label h-full">
            <textarea class="bg-[#121212] text-area w-full h-full p-4 font-mono" readonly>{selectedStudent?.javaContent}</textarea>
        </label>
    </div>
</div>