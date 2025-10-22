import path from 'path';
import child_process from 'child_process';
import {promises} from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const exec = promisify(child_process.exec);

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)).split("/").slice(0, -1).join("/"), 'out');

export async function POST({ request }) {
    const { code, fileName } = await request.json();
    const filePath = `${OUT_DIR}/${path.parse(fileName).name}/${fileName}`;

    await promises.mkdir(OUT_DIR, { recursive: true });
    await promises.mkdir(`${OUT_DIR}/${path.parse(fileName).name}`, { recursive: true });

    const files = await promises.readdir(OUT_DIR);
    for (const file of files)
        if (file.endsWith('.txt'))
            await promises.copyFile(path.join(OUT_DIR, file), path.join(OUT_DIR, path.parse(fileName).name, file));

    await promises.writeFile(filePath, code, 'utf-8');

    try {
        await exec(`javac "${filePath}"`);
    } catch (err: any) {
        const stderr = err?.stderr || err?.message || String(err);
        return new Response(`Compilation error: ${stderr}`, { status: 500 });
    }

    try {
        console.log("OUTPUT DONE");
        const className = path.parse(fileName).name;
        const { stdout } = await exec(`java -cp . ${className}`, { cwd: `${OUT_DIR}/${className}` });
        return new Response(`Program output:\n${stdout}`);
    } catch (err: any) {
        const stderr = err?.stderr || err?.message || String(err);
        return new Response(`Runtime error: ${stderr}`, { status: 500 });
    }
}