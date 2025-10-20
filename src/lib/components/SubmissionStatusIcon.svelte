<script lang="ts">
	import { SubmissionStatus } from "$lib/scripts/user";

    let { submissionStatus = $bindable() }: {
        submissionStatus: SubmissionStatus
    } = $props();
</script>

<div class="flex items-center justify-center ml-auto mr-3 h-5 w-5">
    {#if submissionStatus === SubmissionStatus.NOT_SUBMITTED}
        <span class="text-yellow-500">⏳</span>
    {:else if submissionStatus === SubmissionStatus.RETURNED_ERROR}
        <span class="text-red-500">❌</span>
    {:else if submissionStatus === SubmissionStatus.WRONG_OUTPUT}
        <span class="text-orange-500">⚠️</span>
    {:else if submissionStatus === SubmissionStatus.SUCCESS}
        <span class="text-green-500">✅</span>
    {/if}
</div>