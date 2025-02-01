import express from "express";
import multer from "multer";
import { create as ipfsHttpClient } from "ipfs-http-client";

const app = express();
const upload = multer();
const PORT = 5000;

const ipfs = ipfsHttpClient({ host: "127.0.0.1", port: 5001, protocol: "http" });

app.post("/send", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { cid } = await ipfs.add(req.file.buffer);

        res.json({ cid: cid.toString(), message: "File uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/get/:cid", async (req, res) => {
    const { cid } = req.params;
    res.redirect(`http://127.0.0.1:8080/ipfs/${cid}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
