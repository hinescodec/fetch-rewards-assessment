import axiosInstance from './axiosInstance.ts';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

interface SearchDogsResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

interface SearchParams {
  breeds: string[];
  size: number;
  sort: string;
  searchLink?: string; 
  page?: number;  // Page number for pagination (used when there's no 'next' or 'prev')
}

interface Dog {
  id: string;
  img: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  [key: string]: any; // Allow other dynamic properties
}

interface MatchResponse {
  match: string | null;
}
export const loginUser = async (name: string, email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, { name, email }, { withCredentials: true });

    if (response.status === 200) {
      // Save the token from the response headers to localStorage/sessionStorage
      const token = response.headers['fetch-access-token'];  // Assuming the token is in the response headers
      if (token) {
        localStorage.setItem('fetch-access-token', token); // Store token in localStorage
      }
      
      // Return true to indicate successful login
      return true;
    } else {
      console.error('Login failed: ', response.status);
      return false;
    }
  } catch (error) {
    console.error('Login failed: ', error);
    return false;
  }
};

export const fetchBreeds = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<string[]>(`${API_BASE_URL}/dogs/breeds`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch breeds', error);
    return [];
  }
};

export const searchDogs = async (params: SearchParams): Promise<SearchDogsResponse> => {
  try {
    if (params.searchLink) {
      const response = await axiosInstance.get<SearchDogsResponse>(`${API_BASE_URL}${params.searchLink}`);
      return response.data;
    } else {
      const response = await axiosInstance.get<SearchDogsResponse>(`${API_BASE_URL}/dogs/search`, { params });
      return response.data;
    }
  } catch (error) {
    console.error('Failed to search dogs', error);
    return { resultIds: [], total: 0, next: null, prev: null };
  }
};

export const fetchDogDetails = async (ids: string[]): Promise<Dog[]> => {
  try {
    const response = await axiosInstance.post<Dog[]>(`${API_BASE_URL}/dogs`, ids);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dog details', error);
    return [];
  }
};

export const generateMatch = async (dogIds: string[]): Promise<string | null> => {
  try {
    const response = await axiosInstance.post<MatchResponse>(`${API_BASE_URL}/dogs/match`, dogIds);
    return response.data.match || null;
  } catch (error) {
    console.error('Failed to generate match', error);
    return null;
  }
};

