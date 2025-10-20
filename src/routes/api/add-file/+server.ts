import path from 'path';
import {promises} from 'fs';
import { fileURLToPath } from 'url';

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');

export async function POST({ request }) {
    const { code, fileName } = await request.json();
    const filePath = `${OUT_DIR}/${fileName}`;
    await promises.mkdir(OUT_DIR, { recursive: true });
    await promises.writeFile(filePath, code, 'utf-8');
    return new Promise((resolve) => {
        resolve(new Response(`File ${fileName} uploaded successfully.`));
    });
}