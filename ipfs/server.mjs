import express from "express";
import multer from "multer";
import cors from "cors";
import { create as ipfsHttpClient } from "ipfs-http-client";

const app = express();
const PORT = 5000;

// Configure IPFS client
const ipfs = ipfsHttpClient({
    host: "127.0.0.1",
    port: 5001,
    protocol: "http"
});

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message || 'Something went wrong!',
        timestamp: new Date().toISOString()
    });
};

// Upload endpoint
app.post("/send", upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
                timestamp: new Date().toISOString()
            });
        }

        // Add file to IPFS
        const result = await ipfs.add(
            req.file.buffer,
            {
                progress: (prog) => console.log(`Upload progress: ${prog}`),
                pin: true // Pin the file to keep it in IPFS
            }
        );
        console.log(result);

        res.json({
            cid: result.cid.toString(),
            message: "File uploaded successfully!",
            timestamp: new Date().toISOString(),
            size: req.file.size,
            filename: req.file.originalname
        });

    } catch (error) {
        next(error);
    }
});

app.get("/get/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;

        if (!cid || cid.length < 10) {
            return res.status(400).json({
                error: "Invalid CID format",
                timestamp: new Date().toISOString()
            });
        }

        try {
            await ipfs.pin.add(cid);
        } catch (error) {
            return res.status(404).json({
                error: "File not found in IPFS",
                timestamp: new Date().toISOString()
            });
        }

        res.redirect(`http://127.0.0.1:8080/ipfs/${cid}`);

    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// Apply error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`IPFS gateway available at http://127.0.0.1:8080`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});