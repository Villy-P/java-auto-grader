<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

    let { fileName = $bindable(), fileContent = $bindable(), expectedOutput = $bindable() } = $props();

    async function updateTestCases() {
        const res = await fetch('/api/add-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: fileContent,
                fileName
            })
        });
    }
</script>

<Dialog>
    <Dialog.Trigger class="btn preset-tonal-primary w-11/12">Testcases</Dialog.Trigger>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center">
            <Dialog.Content class="card bg-surface-100-900 w-md p-4 space-y-2 shadow-xl">
                <Dialog.Title class="text-2xl font-bold">Test Cases</Dialog.Title>
                <label class="label">
                    <span class="label-text">File Name</span>
                    <input class="input" type="text" placeholder="e.x. test.txt" bind:value={fileName} />
                </label>
                <label class="label">
                    <span class="label-text">File Content</span>
                    <textarea class="textarea" rows="4" bind:value={fileContent}></textarea>
                </label>
                <label class="label">
                    <span class="label-text">Expected Output</span>
                    <textarea class="textarea" rows="4" bind:value={expectedOutput}></textarea>
                </label>
                <Dialog.CloseTrigger class="btn preset-tonal" onclick={updateTestCases}>Update Testcases</Dialog.CloseTrigger>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>