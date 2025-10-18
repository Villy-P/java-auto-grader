import fetch from 'node-fetch';
import { GOOGLE_REFRESH_TOKEN } from '$env/static/private';

export async function GET() {
    const accessToken = GOOGLE_REFRESH_TOKEN;
    const courseId = 'YOUR_COURSE_ID';
    const courseworkId = 'YOUR_COURSEWORK_ID';

    // Get all submissions
    const submissionsRes = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseworkId}/studentSubmissions`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const submissions: any = await submissionsRes.json();

    const javaFiles = [];

    for (const sub of submissions.studentSubmissions || []) {
        const attachments = sub.assignmentSubmission?.attachments || [];

        for (const att of attachments) {
            const driveFile = att.driveFile?.driveFile;
            if (!driveFile) continue;

            if (driveFile.title?.endsWith('.java')) {
                // Fetch file contents from Drive
                const fileRes = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${driveFile.id}?alt=media`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const code = await fileRes.text();
                javaFiles.push({
                    userId: sub.userId,
                    fileName: driveFile.title,
                    code
                });
            }
        }
    }

    return new Response(JSON.stringify(javaFiles), {
        headers: { 'Content-Type': 'application/json' }
    });
}