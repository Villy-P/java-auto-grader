<script lang="ts">
	import { SubmissionStatus } from "$lib/scripts/user";
	import { Tooltip } from "flowbite-svelte";

    let { submissionStatus = $bindable() }: {
        submissionStatus: SubmissionStatus
    } = $props();
</script>

<div class="flex items-center justify-center ml-auto mr-3 h-5 w-5">
    {#if submissionStatus === SubmissionStatus.NOT_SUBMITTED}
        <span class="text-yellow-500">❔</span>
        <Tooltip placement="right">Not submitted</Tooltip>
    {:else if submissionStatus === SubmissionStatus.RUNTIME_ERROR || submissionStatus === SubmissionStatus.COMPILE_ERROR}
        <span class="text-red-500">❌</span>
        <Tooltip placement="right">Error in submission</Tooltip>
    {:else if submissionStatus === SubmissionStatus.WRONG_OUTPUT}
        <span class="text-orange-500">⚠️</span>
        <Tooltip placement="right">Wrong output</Tooltip>
    {:else if submissionStatus === SubmissionStatus.SUCCESS}
        <span class="text-green-500">✅</span>
        <Tooltip placement="right">Correct submission</Tooltip>
    {/if}
</div>