import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import ApiService from '../services/api';

const INITIAL_FORM_STATE = {
  name: '',
  artist: '',
  trackFile: null,
  imageFile: null,
};

const UploadForm = ({ onUploadComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    // Reset file input values
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('file', formData.trackFile);
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      await ApiService.uploadTrack(formDataToSend);
      resetForm();
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload track. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload New Track
      </Typography>
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
          name="trackFile"
          accept="audio/*"
          onChange={handleFileChange}
          label="Upload Track File"
          variant="contained"
          required
          file={formData.trackFile}
        />
        <FileUploadButton
          id="image-file"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          label="Upload Cover Image (Optional)"
          variant="outlined"
          file={formData.imageFile}
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

const FileUploadButton = ({
  id,
  name,
  accept,
  onChange,
  label,
  variant,
  required,
  file,
}) => (
  <Box sx={{ my: 2 }}>
    <input
      accept={accept}
      style={{ display: 'none' }}
      id={id}
      name={name}
      type="file"
      onChange={onChange}
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
        Selected: {file.name}
      </Typography>
    )}
  </Box>
);

export default UploadForm; 