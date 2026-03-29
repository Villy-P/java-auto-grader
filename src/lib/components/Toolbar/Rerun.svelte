<script lang="ts">
    import RefreshCCW from "@lucide/svelte/icons/refresh-ccw";
    import { Student, SubmissionStatus } from "$lib/scripts/user";
    import { Tooltip } from "flowbite-svelte";
	import { getSubmissionStatus } from "$lib/scripts/output";
	import { Button } from "@valerius_petrini/corekit-ui";

    let { selectedStudent = $bindable(), expectedOutput }: {
        selectedStudent: Student | undefined,
        expectedOutput: string
    } = $props();

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

{#if selectedStudent && selectedStudent.javaContent && selectedStudent.javaContent !== ''}
    <Button color="sub" onclick={rerunSubmission} icon><RefreshCCW size={14}/></Button>
    <Tooltip placement="bottom">Re-run Student Submission</Tooltip>
    <div class="h-full bg-white w-[1px]"></div>
{/if}