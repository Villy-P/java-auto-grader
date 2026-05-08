<script lang="ts">
    import FlaskConical from "@lucide/svelte/icons/flask-conical";
	import { Button, Input, Modal, Text } from "@valerius_petrini/corekit-ui";
    import { Tooltip } from "flowbite-svelte";
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

<Modal bind:open={modalOpen} class="flex flex-col gap-2">
    <Text tag="h2" class="text-2xl mb-4">Edit Test Cases</Text>
    <Input bind:value={fileName} label="File Name" placeholder="Enter file name"/>
    <Input bind:value={fileContent} isTextArea label="File Content" placeholder="Enter file content"/>
    <Input bind:value={expectedOutput} isTextArea label="Expected Output" placeholder="Enter expected output"/>

    <div class="flex gap-4 mt-4">
        <Button color="blue" onclick={() => { modalOpen = false; updateTestCases(); }}>Update Test Cases</Button>
        <Button color="sub" onclick={() => { modalOpen = false; deleteTestCases(); }}>Delete Test Cases</Button>
    </div>
</Modal>