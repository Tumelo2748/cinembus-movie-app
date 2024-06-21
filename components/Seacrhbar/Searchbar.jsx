// SearchBar.jsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { apiKey } from '../../Utils/api';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (text) => {
    setSearchTerm(text);
    if (text.trim() === '') {
      onSearch([]); // Clear search results if empty
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${text}`
      );
      const data = await response.json();
      onSearch(data.results); // Pass search results to parent component
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        onChangeText={handleSearch}
        value={searchTerm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
});

export default SearchBar;
