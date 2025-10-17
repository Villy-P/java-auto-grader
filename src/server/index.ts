import express from 'express';
import path from 'path';
import cors from 'cors';
import child_process from 'child_process';
import {promises} from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'submissions');

app.use(express.text({ type: '*/*', limit: '500kb' }));
app.use(cors());

app.post("/upload-txt-file/:filename", async (req, res) => {
    const fileName = req.params.filename;
    const fileContent = req.body;
    const filePath = `${OUT_DIR}/${fileName}.txt`;
    await promises.mkdir(OUT_DIR, { recursive: true });
    await promises.writeFile(filePath, fileContent, 'utf-8');
    res.send(`File ${fileName}.txt uploaded successfully.`);
});

app.post("/run-java-file/:filename", async (req, res) => {
    const fileName = req.params.filename;
    const fileContent = req.body;
    const filePath = `${OUT_DIR}/${fileName}.java`;

    await promises.mkdir(OUT_DIR, { recursive: true });
    
    promises.writeFile(filePath, fileContent, 'utf-8');

    child_process.exec(`javac ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Compilation error: ${stderr}`);
            return;
        }

        child_process.exec(`java -cp ${OUT_DIR} ${fileName}`, (error, stdout, stderr) => {
            if (error) {
                res.status(500).send(`Runtime error: ${stderr}`);
                return;
            }
            res.send(`Program output:\n${stdout}`);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});