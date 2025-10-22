export enum SubmissionStatus {
    NOT_SUBMITTED = "NOT_SUBMITTED",
    COMPILE_ERROR = "COMPILE_ERROR",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    WRONG_OUTPUT = "WRONG_OUTPUT",
    SUCCESS = "SUCCESS",
    UNKNOWN = "UNKNOWN"
}

export class Student {
    id: string;
    data: gapi.client.classroom.UserProfile;
    javaFileName: string | null;
    javaContent: string | null;
    javaResponse: string | null = null;
    submissionStatus: SubmissionStatus;

    constructor(id: string, data: gapi.client.classroom.UserProfile, javaFileName: string | null = null, javaContent: string | null = null, submissionStatus: SubmissionStatus = SubmissionStatus.NOT_SUBMITTED) {
        this.id = id;
        this.data = data;
        this.javaFileName = javaFileName;
        this.javaContent = javaContent;
        this.submissionStatus = submissionStatus;
    }
}