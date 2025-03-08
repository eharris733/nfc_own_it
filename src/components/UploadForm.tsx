import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { UploadFormData } from '../types';

// Maximum file sizes in bytes (5MB for audio, 2MB for images)
const MAX_AUDIO_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

interface UploadFormProps {
  onUploadComplete?: () => void;
}

const INITIAL_FORM_STATE: UploadFormData = {
  name: '',
  artist: '',
  trackFile: null,
  imageFile: null,
};

const FileUploadButton: React.FC<{
  id: string;
  name: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  variant: 'contained' | 'outlined';
  required?: boolean;
  file: File | null;
  maxSize: number;
}> = ({ id, name, accept, onChange, label, variant, required, file, maxSize }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (files[0].size > maxSize) {
        alert(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        e.target.value = ''; // Reset the input
        return;
      }
      onChange(e);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={id}
        name={name}
        type="file"
        onChange={handleChange}
        required={required}
      />
      <label htmlFor={id}>
        <Button
          variant={variant}
          component="span"
          startIcon={<CloudUpload />}
          fullWidth
        >
          {label}
        </Button>
      </label>
      {file && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
        </Typography>
      )}
    </Box>
  );
};

const UploadForm: React.FC<UploadFormProps> = ({ onUploadComplete }) => {
  const [formData, setFormData] = useState<UploadFormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('artist', formData.artist);
      if (formData.trackFile) {
        formDataToSend.append('file', formData.trackFile);
      }
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      const response = await fetch('http://localhost:8000/upload/track', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Upload failed');
      }

      setFormData(INITIAL_FORM_STATE);
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload track. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Upload New Track
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Track Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Artist Name"
          name="artist"
          value={formData.artist}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <FileUploadButton
          id="trackFile"
          name="trackFile"
          accept="audio/*"
          onChange={handleFileChange}
          label="Upload Track File (Max 5MB)"
          variant="contained"
          required
          file={formData.trackFile}
          maxSize={MAX_AUDIO_SIZE}
        />
        <FileUploadButton
          id="imageFile"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          label="Upload Cover Image (Optional, Max 2MB)"
          variant="outlined"
          file={formData.imageFile}
          maxSize={MAX_IMAGE_SIZE}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !formData.trackFile}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload Track'}
        </Button>
      </form>
    </Box>
  );
};

export default UploadForm; 