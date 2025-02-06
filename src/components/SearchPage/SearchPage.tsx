import React, { useEffect, useState, useCallback } from 'react';
import { fetchBreeds, searchDogs, fetchDogDetails, generateMatch } from '../../api.ts';
import DogCard from '../DogCard/DogCard.tsx';
import { Autocomplete, TextField, Button, Box, Avatar, CircularProgress, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ReactConfetti from 'react-confetti';
export interface Dog {
  id: string;
  img: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
}

const SearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]); // List of breed names
  const [pageSize, setPageSize] = useState<number>(10); //page number
  const [pageSizeOptions] = useState<number[]>([10,20,50,100]); //pageSize option array
  const [orderList] = useState<string[]>(['asc', 'desc']); // List of breed names
  const [selectedOrder, setSelectedOrder] = useState<string>('asc'); // Selected order
  const [selectedBreed, setSelectedBreed] = useState<string>(''); // Selected breed
  const [dogs, setDogs] = useState<Dog[]>([]); // Array of dog objects
  const [favorites, setFavorites] = useState<string[]>([]); // Array of favorite dog IDs
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [openOverlay, setOpenOverlay] = useState<boolean>(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState<boolean>(false); 
  const [matchDetails, setMatchDetails] = useState<any>(null); 


  
  const fetchDogs = useCallback(async () => {
    setLoading(true);
    const params = {
      breeds: selectedBreed ? [selectedBreed] : [],
      size: pageSize,
      sort: `breed:${selectedOrder}`,
      page: 1,
    };
    const data = await searchDogs(params);
    const dogDetails = await fetchDogDetails(data.resultIds);
    setDogs(dogDetails);
    setNextPage(data.next);
    setPrevPage(data.prev);
    setLoading(false);
  }, [selectedBreed, pageSize, selectedOrder]);

  useEffect(() => {
    const getBreeds = async () => {
      const breedsList = await fetchBreeds(); // Fetch breed names from API
      setBreeds(breedsList);
    };
    

    getBreeds();
    fetchDogs();
  }, [fetchDogs]);

  const fetchNextPage = async () => {
    if (nextPage) {
      const params = {
        breeds: selectedBreed ? [selectedBreed] : [],
        size: pageSize,
        sort: `breed:${selectedOrder}`,
        searchLink: nextPage,
      };
      const data = await searchDogs(params);
      const dogDetails = await fetchDogDetails(data.resultIds);
      setDogs(dogDetails);
      setNextPage(data.next);
      setPrevPage(data.prev);
      setLoading(false);
    }
  };

  const fetchPreviousPage = async () => {
    if (prevPage) {
      const params = {
        breeds: selectedBreed ? [selectedBreed] : [],
        size: pageSize,
        sort: `breed:${selectedOrder}`,
        searchLink: prevPage,
      };
      const data = await searchDogs(params);
      const dogDetails = await fetchDogDetails(data.resultIds);
      setDogs(dogDetails);
      setNextPage(data.next);
      setPrevPage(data.prev);
      setLoading(false);
    }
  };

  const toggleFavorite = async (dog: Dog) => {
    setFavorites((prev) =>
      prev.includes(dog.id) ? prev.filter((id) => id !== dog.id) : [...prev, dog.id]
    );
  };

  const toggleFavoriteInFavoritesOverlay = (dog: Dog) => {
    // Update the favorites array
    const updatedFavorites = favorites.includes(dog.id)
      ? favorites.filter((id) => id !== dog.id)
      : [...favorites, dog.id];
  
    setFavorites(updatedFavorites);
  
    // Update the favoriteDogs array accordingly
    const updatedFavoriteDogs = updatedFavorites
    .map((id) => favoriteDogs.find((dog) => dog.id === id))
    .filter((dog): dog is Dog => dog !== undefined);
    
    setFavoriteDogs(updatedFavoriteDogs);
  };
  const handleMatch = async () => {
    const match = await generateMatch(favorites);
    if (match) {
        
      const dogDetails = await fetchDogDetails(favorites);
      setFavoriteDogs(dogDetails);
      
        // Find the matched dog from the favorite dogs list
        const matchedDog = dogDetails.find(dog => dog.id === match);
        // Set the match details with the matched dog's information
        setMatchDetails(matchedDog);
        setOpenCelebrationDialog(true); // Show celebration dialog
    }
};


  const closeCelebrationDialog = () => {
    setOpenCelebrationDialog(false);
    setMatchDetails(null);
    setFavoriteDogs([]);
    setFavorites([]);
  };
  const openFavoritesOverlay = async () => {
    // Fetch details for each dog in the favorites list
    if (favorites.length > 0) {
      setLoading(true);
      const dogDetails = await fetchDogDetails(favorites);
      setFavoriteDogs(dogDetails); // Store fetched dog details
      setLoading(false);
    }

    setOpenOverlay(true);
  };
  const closeFavoritesOverlay = () => setOpenOverlay(false);
  return (
    <div>
      <Typography variant="h3" sx={{ margin: 3, color: '#feab18', fontWeight: 'bold', marginBottom: 1, textAlign: 'center' }}>
                  Dog Search
                </Typography>

      {/* Breed Selection with Autocomplete */}
      <Box sx={{ marginBottom: 2 }}>
        <div className='row d-flex justify-content-center'>
            <div className='col-md-1'>
                <FormControl fullWidth>
                    <InputLabel>Page Size</InputLabel>
                    <Select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as number)} // Update pageSize state on change
                        label="Page Size"
                    >
                        {pageSizeOptions.map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>

                </FormControl>
            </div>
            <div className='col-md-1'>
                <FormControl fullWidth>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(e.target.value as string)} // Update pageSize state on change
                        label="Sort Order"
                    >
                        {orderList.map((order) => (
                            <MenuItem key={order} value={order}>
                                {order === 'asc' ? 'Ascending' : 'Descending'}
                            </MenuItem>
                        ))}
                    </Select>

                </FormControl>
            </div>
            <div className='col-md-3'>
                <Autocomplete
                options={['', ...breeds]}
                value={selectedBreed}
                onChange={(_, value) => setSelectedBreed(value || '')}
                renderInput={(params) => <TextField {...params} label="Breed" variant="outlined" />}
                disableClearable
                isOptionEqualToValue={(option, value) => option === value}
                onInputChange={(event, newInputValue) => setSelectedBreed(newInputValue)}
                renderOption={(props, option) => (
                    <li {...props}>
                    {option ? option : 'All breeds'} 
                    </li>
                )}
                /> 
            </div>
            <div className='col-md-1'>
                <Button
                variant="contained"
                color="primary"
                onClick={() => fetchDogs()}
                disabled={loading}
                fullWidth
                sx={{ height: '100%'}}
                >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
            </div>
        </div>
      </Box>

      <Box sx={{ marginTop: 3, marginBottom: 3 }}>
            <div className='row d-flex justify-content-center'>
                <div className='col-md-2'>
                    <Button
                        variant="text" // Makes it appear like a link initially
                        color="primary"
                        onClick={openFavoritesOverlay}
                        fullWidth
                        sx={{
                            textTransform: 'none', 
                            padding: 0, 
                            '&:hover': {
                                backgroundColor: '#feab18', 
                                color: 'white', 
                                borderRadius: 1, 
                                padding: '6px 16px', 
                            },
                        }}
                        >
                        View Favorites
                    </Button>
                </div>
                <div className='col-md-2'>
                    <Button variant="contained" color="secondary" onClick={handleMatch} disabled={favorites.length === 0} fullWidth>
                        Generate Match
                    </Button>
                </div>
            </div>
                
      </Box>
      {/* Display Dogs */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }} className="row">
        {dogs.map((dog) => (
          <Box key={dog.id} sx={{ flexBasis: '24%', display: 'flex', justifyContent: 'center' }}>
            <DogCard 
                dog={dog} 
                onFavorite={() => toggleFavorite(dog)} 
                isFavorite={favorites.includes(dog.id)}
            />
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="outlined" onClick={fetchPreviousPage} disabled={!prevPage}>
          Previous
        </Button>
        <Button variant="outlined" onClick={fetchNextPage} disabled={!nextPage}>
          Next
        </Button>
      </Box>

      {/* Celebrate Dialog */}
      <Dialog open={openCelebrationDialog} onClose={closeCelebrationDialog} fullWidth maxWidth="sm">
        <DialogTitle>
            
            <Typography variant="h4" sx={{ margin: 3, color: '#feab18', fontWeight: 'bold', marginBottom: 1, textAlign: 'center' }}>
                Congratulations!
            </Typography>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
                   
                <Typography variant="h5" sx={{ margin: 3, color: '#feab18', fontWeight: 'bold', marginBottom: 1, textAlign: 'center' }}>
                    You've been matched with a dog!
                </Typography>
                {matchDetails && (
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
                        alt={matchDetails.name}
                        src={matchDetails.img}
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
                          {matchDetails.name}
                        </Typography>
              
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 0.5 }}>
                          <strong>Breed:</strong> {matchDetails.breed}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 0.5 }}>
                          <strong>Age:</strong> {matchDetails.age}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                          <strong>Zip Code:</strong> {matchDetails.zip_code}
                        </Typography>
              
                      </Paper>
                    </Box>
                  </Box>
                )}
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCelebrationDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confetti Effect */}
      {openCelebrationDialog && <ReactConfetti />}

        {/*Favorite dogs overlay*/}
      <Dialog open={openOverlay} onClose={closeFavoritesOverlay} fullWidth maxWidth="md">
        <DialogTitle>Favorite Dogs</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {favoriteDogs.map((dog) => (
              <Box key={dog.id} sx={{ flexBasis: '24%', display: 'flex', justifyContent: 'center' }}>
                <DogCard dog={dog} onFavorite={() => toggleFavoriteInFavoritesOverlay(dog)} isFavorite={favorites.includes(dog.id)} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFavoritesOverlay} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchPage;