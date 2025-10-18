export class Student {
    id: string;
    data: gapi.client.classroom.UserProfile;
    javaContent: string | null;

    constructor(id: string, data: gapi.client.classroom.UserProfile, javaContent: string | null = null) {
        this.id = id;
        this.data = data;
        this.javaContent = javaContent;
    }
}