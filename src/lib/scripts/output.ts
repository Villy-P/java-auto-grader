import { SubmissionStatus } from "./user";

export function getSubmissionStatus(output: string, expectedOutput: string): SubmissionStatus {
    if (output.replace("Program output:", "").replaceAll(/\s/g, "").trim() != expectedOutput.replaceAll(/\s/g, "").trim())
        return SubmissionStatus.WRONG_OUTPUT;
    else if (output.startsWith('Compilation error'))
        return SubmissionStatus.COMPILE_ERROR;
    else if (output.startsWith('Runtime error'))
        return SubmissionStatus.RUNTIME_ERROR;
    else if (output.startsWith('Program output'))
        return SubmissionStatus.SUCCESS;
    else
        return SubmissionStatus.UNKNOWN;
}