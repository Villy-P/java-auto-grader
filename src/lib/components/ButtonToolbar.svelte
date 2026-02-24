<script lang="ts">
    import LogOut from "@lucide/svelte/icons/log-out";
    import RefreshCCW from "@lucide/svelte/icons/refresh-ccw";
    import { Student, SubmissionStatus } from "$lib/scripts/user";
    import { Tooltip } from "flowbite-svelte";
	import { getSubmissionStatus } from "$lib/scripts/output";

    let { selectedStudent = $bindable(), expectedOutput }: {
        selectedStudent: Student | undefined,
        expectedOutput: string
    } = $props();

    function logout() {
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        location.reload();
    }

    async function rerunSubmission() {
        if (selectedStudent == null) return;
        selectedStudent.submissionStatus = 
            selectedStudent.submissionStatus == SubmissionStatus.NOT_SUBMITTED ? 
            selectedStudent.submissionStatus : 
            SubmissionStatus.UNKNOWN;
        if (selectedStudent.javaContent && selectedStudent.javaContent !== '') {
            const response = await fetch('/api/run-java', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: selectedStudent.javaContent,
                    fileName: selectedStudent.javaFileName || 'Main.java'
                })
            });
            const result = await response.text();
            selectedStudent.javaResponse = result;
            selectedStudent.submissionStatus = getSubmissionStatus(result, expectedOutput);
        }
    }
</script>

<div class="ml-auto"></div>
{#if selectedStudent && selectedStudent.javaContent && selectedStudent.javaContent !== ''}
    <button type="button" class="btn-icon preset-filled w-fit h-fit z-50" onclick={rerunSubmission}><RefreshCCW size={14}/></button>
    <Tooltip placement="bottom">Re-run Student Submission</Tooltip>
{/if}
<button type="button" class="btn-icon preset-filled w-fit h-fit" onclick={logout}><LogOut size={14}/></button>
<Tooltip placement="bottom">Sign out</Tooltip>