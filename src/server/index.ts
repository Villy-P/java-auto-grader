import express from 'express';
import path from 'path';
import cors from 'cors';
import {promises} from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'submissions');

app.use(express.text({ type: '*/*', limit: '500kb' }));
app.use(cors());

app.post("/run-java-file/:filename", async (req, res) => {
    console.log("Got data:", req.params.filename, req.body);
    const fileName = req.params.filename;
    const fileContent = req.body;
    const filePath = `${OUT_DIR}/${fileName}.java`;

    await promises.mkdir(OUT_DIR, { recursive: true });
    
    promises.writeFile(filePath, fileContent, 'utf-8');
    res.send(`Java file ${fileName}.java created successfully at ${filePath}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});