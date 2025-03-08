import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface UploadFormProps {
  onUploadComplete?: () => void;
}

interface FormData {
  name: string;
  artist: string;
  trackFile: File | null;
  imageFile: File | null;
}

const INITIAL_FORM_STATE: FormData = {
  name: '',
  artist: '',
  trackFile: null,
  imageFile: null,
};

// Maximum file sizes in bytes
const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const FileUploadButton: React.FC<{
  id: string;
  accept: string;
  onChange: (file: File | null) => void;
  label: string;
  required?: boolean;
  maxSize: number;
}> = ({ id, accept, onChange, label, required, maxSize }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size
      if (file.size > maxSize) {
        alert(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        e.target.value = '';
        onChange(null);
        return;
      }

      // Check file type
      if (accept.startsWith('audio/') && !file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        e.target.value = '';
        onChange(null);
        return;
      }

      if (accept.startsWith('image/') && !file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = '';
        onChange(null);
        return;
      }
    }
    
    onChange(file);
  };

  return (
    <Box sx={{ my: 2 }}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={id}
        type="file"
        onChange={handleChange}
        required={required}
      />
      <label htmlFor={id}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUpload />}
          fullWidth
        >
          {label}
        </Button>
      </label>
      {/* File info display will be handled by parent component */}
    </Box>
  );
};

const UploadForm: React.FC<UploadFormProps> = ({ onUploadComplete }) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (field: 'trackFile' | 'imageFile') => (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.trackFile) {
        throw new Error('Please select an audio file');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('file', formData.trackFile);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      const response = await fetch('http://localhost:8000/upload/track', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload track');
      }

      setFormData(INITIAL_FORM_STATE);
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload track');
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
          id="track-file"
          accept="audio/*"
          onChange={handleFileChange('trackFile')}
          label="Select Audio File (Max 5MB)"
          required
          maxSize={MAX_AUDIO_SIZE}
        />
        {formData.trackFile && (
          <Typography variant="caption" display="block" sx={{ ml: 1 }}>
            Selected: {formData.trackFile.name} ({(formData.trackFile.size / (1024 * 1024)).toFixed(2)}MB)
          </Typography>
        )}

        <FileUploadButton
          id="image-file"
          accept="image/*"
          onChange={handleFileChange('imageFile')}
          label="Select Cover Image (Optional, Max 2MB)"
          maxSize={MAX_IMAGE_SIZE}
        />
        {formData.imageFile && (
          <Typography variant="caption" display="block" sx={{ ml: 1 }}>
            Selected: {formData.imageFile.name} ({(formData.imageFile.size / (1024 * 1024)).toFixed(2)}MB)
          </Typography>
        )}

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