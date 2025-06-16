import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";
import './globals.css';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}} 
        />
        <Stack.Screen
          name="movies/[id]"
          options={{headerShown: false}} 
        />
      </Stack>
    </FavoritesProvider>
  );
}
