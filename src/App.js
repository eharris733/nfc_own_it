import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import AudioPlayer from "./components/AudioPlayer";
import UploadForm from "./components/UploadForm";
import ApiService from "./services/api";

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchTracks = async () => {
    try {
      const data = await ApiService.fetchTracks();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    fetchTracks();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "lightgreen",
        minHeight: "100vh",
        position: "relative",
        pt: 4,
      }}
    >
      <Button
        onClick={() => setShowUploadForm(!showUploadForm)}
        startIcon={<Add />}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        {showUploadForm ? "Hide Upload Form" : "Upload Track"}
      </Button>

      {showUploadForm && (
        <UploadForm onUploadComplete={handleUploadComplete} />
      )}

      {tracks.length > 0 && (
        <Box sx={{ mt: showUploadForm ? 4 : 0 }}>
          <AudioPlayer tracks={tracks} />
        </Box>
      )}
    </Box>
  );
};

export default App;
