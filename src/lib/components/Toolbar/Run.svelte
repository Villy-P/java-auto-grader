<script lang="ts">
    import Play from "@lucide/svelte/icons/play";
    import { Tooltip } from "flowbite-svelte";
    import { Student, SubmissionStatus } from "$lib/scripts/user";
    import { getSubmissionStatus } from "$lib/scripts/output";
	import { Button } from "@valerius_petrini/corekit-ui";

    let { users = $bindable(), expectedOutput }: {
        users: Student[],
        expectedOutput: string
    } = $props();

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
</script>

<Button color="sub" onclick={runAllJavaFiles} icon><Play size={14}/></Button>
<Tooltip placement="bottom">Run all Java Files</Tooltip>