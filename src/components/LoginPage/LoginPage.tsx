import React, { useState } from 'react';
import { loginUser } from '../../api.ts'; 
import { useNavigate } from 'react-router-dom'; 
import { TextField, Button, Typography, Box, Stack, Paper } from '@mui/material';
import './LoginPage.css';

// Define types for the state
interface LoginPageState {
  name: string;
  email: string;
  error: string;
  loading: boolean;
}

const LoginPage: React.FC = () => {
  // Define state using types
  const [state, setState] = useState<LoginPageState>({
    name: '',
    email: '',
    error: '',
    loading: false,
  });

  const navigate = useNavigate();

  // Define the login function
  const handleLogin = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    const { name, email } = state;
    if (await loginUser(name, email)) {
      navigate('/search');  
    } else {
      setState((prevState) => ({
        ...prevState,
        error: 'Login failed. Please try again.',
      }));
    }

    setState((prevState) => ({ ...prevState, loading: false }));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="row main-div">
      <div className="col-lg-4 login-form">
        <Paper sx={{ padding: 5 }}>
          <Typography variant="h5" sx={{ marginBottom: 2, color: '#feab18' }}>
            Welcome to Fetch!
          </Typography>

          <Stack spacing={3} sx={{ width: '100%' }}>
            {/* Name Input Field */}
            <Box>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={state.name}
                onChange={handleChange}
                name="name"
              />
            </Box>

            {/* Email Input Field */}
            <Box>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                value={state.email}
                onChange={handleChange}
                name="email"
              />
            </Box>

            {/* Error Message */}
            {state.error && (
              <Box>
                <Typography color="error">{state.error}</Typography>
              </Box>
            )}

            {/* Login Button */}
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#feab18',
                  '&:hover': { backgroundColor: '#e89f16' },
                }}
                fullWidth
                onClick={handleLogin}
                disabled={state.loading}
              >
                {state.loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </div>
      <div className="col-lg-8 img-div">
        <img 
          src={`${process.env.PUBLIC_URL}/images/pexels-dog.jpg`} 
          alt="Description" 
          className="img-fluid img-full" 
        />
      </div>
    </div>
  );
};

export default LoginPage;