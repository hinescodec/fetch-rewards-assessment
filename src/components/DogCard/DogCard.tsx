import React from 'react';
import { Paper, Typography, Button, Avatar, Box } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';

import {Dog} from "../SearchPage/SearchPage";

interface DogCardProps {
  dog: Dog;
  onFavorite: () => void;
  isFavorite: boolean;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onFavorite, isFavorite }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens, horizontally on larger screens
        alignItems: 'center',
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 150,
          height: 150,
          marginBottom: { xs: 2, md: 0 }, // Margin-bottom on mobile, no margin on desktop
        }}
      >
        <Avatar
          alt={dog.name}
          src={dog.img}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Ensures the image fits inside the circle
            border: '2px solid #feab18', // Optional border color
          }}
        />
      </Box>

      {/* Dog Information */}
      <Box sx={{ flex: 1, paddingLeft: { md: 2 }, textAlign: { xs: 'center', md: 'left' } }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h5" sx={{ color: '#feab18', fontWeight: 'bold', marginBottom: 1 }}>
            {dog.name}
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 0.5 }}>
            <strong>Breed:</strong> {dog.breed}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 0.5 }}>
            <strong>Age:</strong> {dog.age}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
            <strong>Zip Code:</strong> {dog.zip_code}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onFavorite}
            sx={{
              backgroundColor: '#feab18',
              '&:hover': { backgroundColor: '#e89f16' },
              display: 'flex', // Align icon and text
              alignItems: 'center',
            }}
          >
            {isFavorite ? <FavoriteIcon sx={{ marginRight: 1 }} /> : <FavoriteBorderIcon sx={{ marginRight: 1 }} />}
            {isFavorite ? 'Unfavorite' : 'Favorite'} {/* Change button text based on favorite status */}
        </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default DogCard;