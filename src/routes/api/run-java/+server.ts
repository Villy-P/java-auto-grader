import path from 'path';
import child_process from 'child_process';
import {promises} from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const exec = promisify(child_process.exec);

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)).split("/").slice(0, -1).join("/"), 'out');

export async function POST({ request }) {
    const { code, fileName } = await request.json();
    const filePath = `${OUT_DIR}/${fileName}`;

    await promises.mkdir(OUT_DIR, { recursive: true });

    await promises.writeFile(filePath, code, 'utf-8');

    console.log(`Compiling and running Java file: ${fileName}`);

    try {
        await exec(`javac "${filePath}/${filePath}"`);
    } catch (err: any) {
        const stderr = err?.stderr || err?.message || String(err);
        console.log(`Compilation error for ${fileName}:\n${stderr}`);
        return new Response(`Compilation error: ${stderr}`, { status: 500 });
    }

    try {
        const className = path.parse(fileName).name;
        const { stdout } = await exec(`java -cp . ${className}/${filePath}`, { cwd: OUT_DIR });
        console.log(`Execution output for ${fileName}:\n${stdout}`);
        return new Response(`Program output:\n${stdout}`);
    } catch (err: any) {
        const stderr = err?.stderr || err?.message || String(err);
        console.log(`Runtime error for ${fileName}:\n${stderr}`);
        return new Response(`Runtime error: ${stderr}`, { status: 500 });
    }
}