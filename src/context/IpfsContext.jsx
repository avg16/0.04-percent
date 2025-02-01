import { createContext, useContext, useState } from "react";
import axios from "axios";

const IPFSContext = createContext();

const API_URL = "http://localhost:6969";//'o'

export const IPFSProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = async (file) => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`${API_URL}/send`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`Upload Progress: ${percentCompleted}%`);
                },
            });

            return response.data.cid;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getFile = async (cid) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`${API_URL}/get/${cid}`);
            return response.request.responseURL;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const validateFile = (file) => {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

        if (!file) {
            throw new Error('No file selected');
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed');
        }

        if (file.size > MAX_SIZE) {
            throw new Error('File size exceeds 10MB limit');
        }

        return true;
    };

    return (
        <IPFSContext.Provider value={{ uploadFile, getFile, validateFile, isLoading, error }}>
            {children}
        </IPFSContext.Provider>
    );
};

export const useIPFS = () => {
    const context = useContext(IPFSContext);
    if (!context) {
        throw new Error('useIPFS must be used within an IPFSProvider');
    }
    return context;
};
