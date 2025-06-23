/// <reference path="../interfaces/interfaces.d.ts" />
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: Movie[];
  watchedMovies: number[]; // Array of movie IDs that have been watched
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addToWatched: (movieId: number) => void;
  removeFromWatched: (movieId: number) => void;
  isWatched: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);

  useEffect(() => {
    loadFavorites();
    loadWatchedMovies();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadWatchedMovies = async () => {
    try {
      const storedWatched = await AsyncStorage.getItem('watchedMovies');
      if (storedWatched) {
        setWatchedMovies(JSON.parse(storedWatched));
      }
    } catch (error) {
      console.error('Error loading watched movies:', error);
    }
  };

  const saveFavorites = async (newFavorites: Movie[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const saveWatchedMovies = async (newWatched: number[]) => {
    try {
      await AsyncStorage.setItem('watchedMovies', JSON.stringify(newWatched));
    } catch (error) {
      console.error('Error saving watched movies:', error);
    }
  };

  const addToFavorites = (movie: Movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  };

  const removeFromFavorites = (movieId: number) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    // Also remove from watched if it was watched
    if (isWatched(movieId)) {
      removeFromWatched(movieId);
    }
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const addToWatched = (movieId: number) => {
    if (!watchedMovies.includes(movieId)) {
      const newWatched = [...watchedMovies, movieId];
      setWatchedMovies(newWatched);
      saveWatchedMovies(newWatched);
    }
  };

  const removeFromWatched = (movieId: number) => {
    const newWatched = watchedMovies.filter(id => id !== movieId);
    setWatchedMovies(newWatched);
    saveWatchedMovies(newWatched);
  };

  const isWatched = (movieId: number) => {
    return watchedMovies.includes(movieId);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        watchedMovies,
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        addToWatched,
        removeFromWatched,
        isWatched
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 