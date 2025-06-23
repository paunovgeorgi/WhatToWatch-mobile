import MovieCard from '@/components/MovieCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';

const Saved = () => {
  const { favorites, isWatched } = useFavorites();
  const [showWatched, setShowWatched] = useState(false);

  const filteredMovies = favorites.filter(movie => 
    showWatched ? isWatched(movie.id) : !isWatched(movie.id)
  );

  return (
    <View className="flex-1 bg-primary">
    <Image source={images.bg} className="absolute z-0 w-full"/>

    <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
      minHeight: '100%',
      paddingBottom: 10
    }}>
      <Image source={icons.logo} className="w-20 h-16 mt-20  mx-auto"/>
      <View className="">
    <View className="flex-1  pt-10">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-lg text-white font-bold">
          {showWatched ? 'Watched Movies' : 'Movies to Watch'}
        </Text>
        <View className="flex-row gap-x-2">
          <TouchableOpacity
            className={`px-3 py-1 rounded-lg ${!showWatched ? 'bg-accent' : 'bg-gray-500/50'}`}
            onPress={() => setShowWatched(false)}
          >
            <Text className="text-white font-semibold">To Watch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 rounded-lg ${showWatched ? 'bg-accent' : 'bg-gray-500/50'}`}
            onPress={() => setShowWatched(true)}
          >
            <Text className="text-white font-semibold">Watched</Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredMovies.length === 0 ? (
        <Text className="text-light-200">
          {showWatched ? 'No watched movies yet.' : 'No movies to watch yet.'}
        </Text>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'flex-start', gap: 20, paddingRight: 5, marginBottom: 10 }}
          className="mt-2 pb-32"
          scrollEnabled={false}
        />
      )}
    </View>
    </View>
    </ScrollView>
    </View>
  );
};

export default Saved;