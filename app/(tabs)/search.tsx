import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const  {data: movies, loading: moviesLoading, error: moviesError, refetch: loadMovies, reset} = useFetch(() => fetchMovies({query: searchQuery}), false);
  
   useEffect(() => {
    const timeoutId = setTimeout(async () => {
      
       if (searchQuery.trim()) {   

        await loadMovies();
        
      } else{
        reset();
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

    useEffect(() => {
      if(movies?.length > 0 && movies?.[0]){  
          updateSearchCount(searchQuery, movies[0])
        } 
    }, [movies])

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'/>
      <FlatList 
        data={movies}
        renderItem={({item}) => <MovieCard {...item}/>}
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className='flex-row justify-center w-full mt-20 items-center'>
              <Image source={icons.logo} className='w-20 h-16'/>
            </View>
            <View className='mb-5 mt-10'>
              <SearchBar 
                placeHolder='Search movies...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" className='my-3'/>
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 py-3">Error: {moviesError?.message || 'An error occurred'}</Text>
            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
              <Text className='text-xl text-white font-bold'>
                Search results for{' '}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({})