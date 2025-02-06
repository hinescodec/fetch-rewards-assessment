import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage.tsx';
import SearchPage from './components/SearchPage/SearchPage.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#feab18',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;