<script lang="ts">
    import FlaskConical from "@lucide/svelte/icons/flask-conical";
    import { Tooltip, Modal } from "flowbite-svelte";
    import { onMount } from "svelte";

    let { fileName = $bindable(), fileContent = $bindable(), expectedOutput = $bindable() } = $props();
    let modalOpen = $state(false);

    async function updateTestCases() {
        onTestCaseChange();
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

    function onTestCaseChange() {
        const testCase = {
            fileName,
            fileContent,
            expectedOutput
        };
        localStorage.setItem('testCase', JSON.stringify(testCase));
    }

    function deleteTestCases() {
        fileName = '';
        fileContent = '';
        expectedOutput = '';
        localStorage.removeItem('testCase');
    }

    onMount(() => {
        const savedTestCase = localStorage.getItem('testCase');
        if (savedTestCase) {
            const testCase = JSON.parse(savedTestCase);
            fileName = testCase.fileName;
            fileContent = testCase.fileContent;
            expectedOutput = testCase.expectedOutput;
        }
    })
</script>

<button type="button" class="btn-icon preset-filled w-fit h-fit" onclick={() => modalOpen = true}><FlaskConical size={14}/></button>
<Tooltip placement="bottom">Edit Testcases</Tooltip>

<Modal title="Test Cases" bind:open={modalOpen}>
    <label class="label">
        <span class="label-text">File Name</span>
        <input class="input" type="text" placeholder="e.x. test.txt" bind:value={fileName}/>
    </label>
    <label class="label">
        <span class="label-text">File Content</span>
        <textarea class="textarea" rows="4" bind:value={fileContent}></textarea>
    </label>
    <label class="label">
        <span class="label-text">Expected Output</span>
        <textarea class="textarea" rows="4" bind:value={expectedOutput}></textarea>
    </label>

    {#snippet footer()}
        <button class="btn btn-primary" onclick={() => { modalOpen = false; updateTestCases(); }}>Update Test Cases</button>
        <button class="btn btn-ghost" onclick={() => { modalOpen = false; deleteTestCases(); }}>Delete Test Cases</button>
    {/snippet}
</Modal>