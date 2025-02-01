import express from "express";
import multer from "multer";
import cors from "cors";
import lighthouse from "@lighthouse-web3/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 6969;
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

// Middleware
app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message || "Something went wrong!",
        timestamp: new Date().toISOString(),
    });
};

// Upload endpoint using Lighthouse
app.post("/send", upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const response = await lighthouse.uploadBuffer(
            req.file.buffer,
            LIGHTHOUSE_API_KEY,
            req.file.originalname
        );

        res.json({
            cid: response.data.Hash,
            message: "File uploaded successfully!",
            filename: req.file.originalname,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
});

// Retrieve file via Lighthouse Gateway
app.get("/get/:cid", (req, res) => {
    const { cid } = req.params;
    if (!cid || cid.length < 10) {
        return res.status(400).json({ error: "Invalid CID format" });
    }
    res.redirect(`https://gateway.lighthouse.storage/ipfs/${cid}`);
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Apply error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});