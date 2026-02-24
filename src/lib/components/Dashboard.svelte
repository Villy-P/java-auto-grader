<script lang="ts">
	import { Student, SubmissionStatus } from "$lib/scripts/user";
	import { onMount } from "svelte";
	import SubmissionStatusIcon from "./SubmissionStatusIcon.svelte";
	import TestCases from "./TestCases.svelte";
	import ButtonToolbar from "./ButtonToolbar.svelte";
    import Logout from "./Toolbar/Logout.svelte";
    import Rerun from "./Toolbar/Rerun.svelte";
	import { getSubmissionStatus } from "$lib/scripts/output";

    let { tokenResponse = $bindable(), courseSelected = $bindable(), courseworkSelected = $bindable() }: {
        tokenResponse: any,
        courseSelected: gapi.client.classroom.Course | null,
        courseworkSelected: gapi.client.classroom.CourseWork | null
    } = $props();

    let users: Student[] = $state([]);

    let monacoEditor: any = null;
    let monaco: any = null;

    let fileName: string = $state('');
    let fileContent: string = $state('');
    let expectedOutput: string = $state('');

    onMount(async () => {
        classroomStudentSubmissions = await getStudentSubmissions();

        monaco = await import('monaco-editor');
        const editorContainer = document.getElementById('editor');
        console.log('Editor container:', editorContainer);
        if (editorContainer) {
            monacoEditor = monaco.editor.create(editorContainer, {
                value: selectedStudent ? selectedStudent.javaContent : '',
                language: 'java',
                theme: 'vs-dark',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
            });

            monacoEditor.onDidChangeModelContent(() => {
                if (selectedStudent)
                    selectedStudent.javaContent = monacoEditor.getValue();
            });
        }
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
                let javaFileName: string | null = null;
                if (sub.assignmentSubmission && sub.assignmentSubmission.attachments) {
                    for (const attachment of sub.assignmentSubmission.attachments) {
                        if (attachment.driveFile) {
                            const fileContent = await downloadFile(attachment.driveFile.id);
                            if (attachment.driveFile.title.endsWith('.java'))
                                javaFileName = attachment.driveFile.title;
                            javaContent += `// File: ${attachment.driveFile.title}\n${fileContent}\n\n`;
                        }
                    }
                }
                return {
                    id: sub.userId,
                    data: profiles[index],
                    javaFileName,
                    javaContent: javaContent.trim(),
                    submissionStatus: javaContent === "" ? SubmissionStatus.NOT_SUBMITTED : SubmissionStatus.UNKNOWN
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

    async function runAllJavaFiles() {
        users.forEach(user => {
            user.submissionStatus = 
                user.submissionStatus == SubmissionStatus.NOT_SUBMITTED ? 
                user.submissionStatus : 
                SubmissionStatus.UNKNOWN;
        });
        const java = await Promise.all(
            users.map(async (user) => {
                if (user.javaContent && user.javaContent !== '') {
                    const response = await fetch('/api/run-java', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: user.javaContent,
                            fileName: user.javaFileName || 'Main.java'
                        })
                    });
                    const result = await response.text();
                    user.javaResponse = result;
                    user.submissionStatus = getSubmissionStatus(result, expectedOutput);
                    return { user, result };
                } else {
                    return { user, result: null };
                }
            })
        );
    }

    let classroomStudentSubmissions = $state<any>(null);

    let selectedStudent: Student | undefined = $state(undefined);

    function onChangeStudent() {
        if (monacoEditor && selectedStudent)
            monacoEditor.setValue(selectedStudent.javaContent);
    }

    function getResultText(user: Student) {
        switch (user.submissionStatus) {
            case SubmissionStatus.NOT_SUBMITTED:
                return "Not Submitted";
            case SubmissionStatus.COMPILE_ERROR:
                return "Compilation Error";
            case SubmissionStatus.RUNTIME_ERROR:
                return "Runtime Error";
            case SubmissionStatus.WRONG_OUTPUT:
                return "Wrong Output";
            case SubmissionStatus.SUCCESS:
                return "Success";
            default:
                return "Unknown";
        }
    }

    function getResultColor(user: Student) {
        switch (user.submissionStatus) {
            case SubmissionStatus.NOT_SUBMITTED:
                return "text-yellow-500";
            case SubmissionStatus.COMPILE_ERROR:
                return "text-red-500";
            case SubmissionStatus.RUNTIME_ERROR:
                return "text-red-500";
            case SubmissionStatus.WRONG_OUTPUT:
                return "text-orange-500";
            case SubmissionStatus.SUCCESS:
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    }
</script>

<div class="w-full h-screen flex overflow-hidden">
    <div class="w-1/3 min-h-0 h-full border-r flex flex-col">
        <div class="grow overflow-y-auto">
            {#if classroomStudentSubmissions === null}
                <p class="flex items-center justify-center w-full h-full">Loading student submissions...</p>
            {:else}
                {#if classroomStudentSubmissions.studentSubmissions && classroomStudentSubmissions.studentSubmissions.length > 0}
                    {#each users as user}
                        <button class:bg-gray-900={selectedStudent === user} class="border-b p-2 cursor-pointer w-full text-left flex items-center" onclick={() => { selectedStudent = user; onChangeStudent(); }}>
                            <div class="flex flex-col">
                                <p class="font-bold">{user.data.name?.fullName}</p>
                                <p class="text-sm">{user.data.emailAddress}</p>
                            </div>
                            <SubmissionStatusIcon submissionStatus={user.submissionStatus}/>
                        </button>
                    {/each}
                {:else}
                    <p>Couldn't find any submissions.</p>
                {/if}
            {/if}
        </div>
        <div class="w-full flex items-center justify-center space-x-2 p-2 border-t">
            <TestCases bind:fileName={fileName} bind:fileContent={fileContent} bind:expectedOutput={expectedOutput}/>
            <button type="button" class="btn preset-tonal-primary w-11/12" onclick={runAllJavaFiles}>Run all Java Files</button>
        </div>
    </div>
    <div class="w-2/3 h-full flex flex-col relative">
        <div class="h-full w-full overflow-hidden flex flex-col">
            <div class="w-full flex p-4 border-b z-50 gap-4">
                <ButtonToolbar bind:selectedStudent={selectedStudent} {expectedOutput}/>

                <div class="ml-auto"></div>
                <Logout bind:selectedStudent={selectedStudent}/>
                <Rerun bind:selectedStudent={selectedStudent} {expectedOutput}/>
            </div>
            {#if selectedStudent == null}
                <div class="flex-grow w-full flex items-center justify-around">
                    <p>Please select a student submission to view the code.</p>
                </div>
            {:else if selectedStudent.javaContent == ''}
                <div class="flex-grow w-full flex items-center justify-around">
                    <p>The selected student has not submitted any Java files.</p>
                </div>
            {/if}
            <div
                id="editor"
                class="flex-grow w-full overflow-hidden relative"
                class:hidden-editor={selectedStudent == null || selectedStudent.javaContent == ''}
            ></div>
        </div>

        <div class="h-1/3 w-full border-t">
            {#if selectedStudent && selectedStudent.javaResponse}
                <div class="p-4 h-full overflow-y-auto">
                    <h2 class="text-2xl mb-2">Output for {selectedStudent.data.name?.fullName}:</h2>
                    <p class={getResultColor(selectedStudent)}>{getResultText(selectedStudent)}</p>
                    <pre class="bg-gray-800 text-white p-4 rounded whitespace-pre-wrap">{selectedStudent.javaResponse}</pre>
                    {#if getResultText(selectedStudent) !== "Success"}
                        <h3 class="text-xl mt-4 mb-2">Expected Output:</h3>
                        <pre class="bg-gray-800 text-white p-4 rounded whitespace-pre-wrap">{expectedOutput}</pre>
                    {/if}
                    <h3 class="text-xl mt-4 mb-2">Override Result:</h3>
                    <div class="flex gap-4">
                        <button onclick={() => selectedStudent!.submissionStatus = SubmissionStatus.SUCCESS} type="button" class="btn preset-filled-success-500">Should be correct</button>
                        <button onclick={() => selectedStudent!.submissionStatus = SubmissionStatus.WRONG_OUTPUT} type="button" class="btn preset-filled-error-500">Should be incorrect</button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .hidden-editor {
        visibility: hidden;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>