<script lang="ts">
    import FlaskConical from "@lucide/svelte/icons/flask-conical";
	import { Button, Input } from "@valerius_petrini/corekit-ui";
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

<Button color="sub" onclick={() => modalOpen = true} icon><FlaskConical size={14}/></Button>
<Tooltip placement="bottom">Edit Testcases</Tooltip>

<Modal title="Test Cases" bind:open={modalOpen}>
    <Input bind:value={fileName}>File Name</Input>
    <Input bind:value={fileContent} isTextArea>File Content</Input>
    <Input bind:value={expectedOutput} isTextArea>Expected Output</Input>

    {#snippet footer()}
        <Button color="blue" onclick={() => { modalOpen = false; updateTestCases(); }}>Update Test Cases</Button>
        <Button color="sub" onclick={() => { modalOpen = false; deleteTestCases(); }}>Delete Test Cases</Button>
    {/snippet}
</Modal>