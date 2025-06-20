import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Typography, CircularProgress } from '@mui/material';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [inserted, setInserted] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/v1/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setInserted(response.data.inserted);
        } catch (error) {
            console.error('Error uploading file', error);
            setMessage('Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Upload File
            </Typography>
            <Input type="file" onChange={handleFileChange} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={handleFileUpload} disabled={loading} sx={{ mb: 2 }}>
                {loading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
            {message && <Typography>{message}</Typography>}
            {inserted > 0 && <Typography>Inserted: {inserted} records</Typography>}
        </div>
    );
};

export default FileUpload;
