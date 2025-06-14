import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, View } from 'react-native';


interface SearchBarProps {
    onPress?: () => void;
    placeHolder: string;
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({onPress, placeHolder, value, onChangeText}: SearchBarProps) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
        <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#aBbBFF"/>
        <TextInput
            onPress={onPress}
            placeholder={placeHolder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#a8b5db"
            className='flex-1 ml-2 text-white'
         />
    </View>
  )
}

export default SearchBar