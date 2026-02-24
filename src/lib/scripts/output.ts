import { Student, SubmissionStatus } from "./user";

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

export function getResultText(user: Student) {
    switch (user.submissionStatus) {
        case SubmissionStatus.NOT_SUBMITTED:
            return "Not Submitted";
        case SubmissionStatus.COMPILE_ERROR:
            return "Compilation Error";
        case SubmissionStatus.RUNTIME_ERROR:
            return "Runtime Error";
        case SubmissionStatus.WRONG_OUTPUT:
            return "Wrong Output";
        case SubmissionStatus.SUCCESS:
            return "Success";
        default:
            return "Unknown";
    }
}

export function getResultColor(user: Student) {
    switch (user.submissionStatus) {
        case SubmissionStatus.NOT_SUBMITTED:
            return "text-yellow-500";
        case SubmissionStatus.COMPILE_ERROR:
            return "text-red-500";
        case SubmissionStatus.RUNTIME_ERROR:
            return "text-red-500";
        case SubmissionStatus.WRONG_OUTPUT:
            return "text-orange-500";
        case SubmissionStatus.SUCCESS:
            return "text-green-500";
        default:
            return "text-gray-500";
    }
}