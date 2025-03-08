import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  Collapse,
  Paper,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  PlayArrow,
  ContentCopy,
} from '@mui/icons-material';

interface Track {
  _id: string;
  name: string;
  artist: string;
  code: string;
  path: string;
  image?: string;
}

interface TracksByArtist {
  [artist: string]: Track[];
}

interface TrackListProps {
  onTrackSelect: (track: Track) => void;
  isVisible: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ onTrackSelect, isVisible }) => {
  const [artists, setArtists] = useState<string[]>([]);
  const [tracksByArtist, setTracksByArtist] = useState<TracksByArtist>({});
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    if (expandedArtist) {
      fetchArtistTracks(expandedArtist);
    }
  }, [expandedArtist]);

  const fetchArtists = async () => {
    try {
      const response = await fetch('http://localhost:8000/artists/list');
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchArtistTracks = async (artist: string) => {
    try {
      const response = await fetch(`http://localhost:8000/tracks/by-artist/${encodeURIComponent(artist)}`);
      const data = await response.json();
      setTracksByArtist(prev => ({ ...prev, [artist]: data }));
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const handleArtistClick = (artist: string) => {
    setExpandedArtist(expandedArtist === artist ? null : artist);
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const filteredArtists = artists.filter(artist =>
    artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isVisible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        width: '300px',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'background.paper',
        zIndex: 1000,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Track Library
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredArtists.map((artist) => (
            <React.Fragment key={artist}>
              <ListItem
                component="div"
                onClick={() => handleArtistClick(artist)}
                sx={{ bgcolor: expandedArtist === artist ? 'action.selected' : 'transparent', cursor: 'pointer' }}
              >
                <ListItemText primary={artist} />
                {expandedArtist === artist ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={expandedArtist === artist}>
                <List component="div" disablePadding>
                  {tracksByArtist[artist]?.map((track) => (
                    <ListItem
                      key={track._id}
                      sx={{ pl: 4 }}
                      secondaryAction={
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => copyCodeToClipboard(track.code)}
                            title="Copy access code"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onTrackSelect(track)}
                            title="Play track"
                          >
                            <PlayArrow fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={track.name}
                        secondary={`Code: ${track.code}`}
                        primaryTypographyProps={{ noWrap: true }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TrackList; 