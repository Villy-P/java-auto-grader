import path from 'path';
import child_process from 'child_process';
import {promises} from 'fs';
import { fileURLToPath } from 'url';

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');

export async function POST({ request }) {
    const { code, fileName } = await request.json();
    const filePath = `${OUT_DIR}/${fileName}.java`;

    await promises.mkdir(OUT_DIR, { recursive: true });

    promises.writeFile(filePath, code, 'utf-8');

    return new Promise((resolve, reject) => {
        child_process.exec(`javac ${filePath}`, (error, stdout, stderr) => {
            if (error)
                return reject(new Response(`Compilation error: ${stderr}`, { status: 500 }));

            child_process.exec(`java -cp ${OUT_DIR} ${fileName}`, (error, stdout, stderr) => {
                if (error)
                    return reject(new Response(`Runtime error: ${stderr}`, { status: 500 }));
                return resolve(new Response(`Program output:\n${stdout}`));
            });
        });
    });
}