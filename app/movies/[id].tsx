import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useFavorites } from "../../context/FavoritesContext";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite,
    addToWatched,
    removeFromWatched,
    isWatched 
  } = useFavorites();

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <Text className="text-white text-center mt-10">Movie not found</Text>
      </SafeAreaView>
    );
  }

  const handleFavorite = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        adult: movie.adult,
        backdrop_path: movie.backdrop_path,
        genre_ids: movie.genres ? movie.genres.map((g: any) => g.id) : [],
        original_language: movie.original_language,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        video: movie.video,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
      });
    }
  };

  const handleWatched = () => {
    if (isWatched(movie.id)) {
      removeFromWatched(movie.id);
    } else {
      addToWatched(movie.id);
    }
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            className="w-full h-[460px]"
            resizeMode="cover"
          />

          {/* <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity> */}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie.runtime}m •</Text>
            <Text className="text-light-200 text-sm uppercase">{movie.original_language} </Text>
    
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie.vote_count} votes)
            </Text>
          </View>

          {/* Save to favorites button */}
          <View className="flex-row items-center justify-between gap-x-1 w-full">
            <TouchableOpacity
              className={`mt-5 px-2 py-2 rounded-lg ${isFavorite(movie.id) ? 'bg-red-500' : 'bg-accent'}`}
              onPress={handleFavorite}
            >
              <Text className="text-white font-semibold text-base">
                {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>

            {isFavorite(movie.id) && (
              <TouchableOpacity
                className={`mt-5 px-2 py-2 rounded-lg ${isWatched(movie.id) ? 'bg-gray-500/80' : 'bg-accent'}`}
                onPress={handleWatched}
              >
                <Text className="text-white font-semibold text-base">
                  {isWatched(movie.id) ? 'Remove from Watched' : 'Add to Watched'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <MovieInfo label="Overview" value={movie.overview} />
          <MovieInfo
            label="Genres"
            value={movie.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>
          <View className="mb-3">

          <MovieInfo
            label="Production Companies"
            value={
              movie.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 mb-7 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;