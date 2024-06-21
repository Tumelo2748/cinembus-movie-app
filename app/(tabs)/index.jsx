import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  FlatList,
} from "react-native";
import PopularMovies from "../../components/Movies/PopularMovies";
import TrendingComponent from "../../components/Movies/Trending";
import MediaList from "../../components/Medialist/Medialist";
import PopularTVshow from "../../components/Movies/PopularTvshows";
import {
  searchMovies,
  fetchPopularMovies,
  fetchTrendingContent,
  fetchPopularTVShows,
  searchMoviesAndTVShows,
} from "../../Utils/api";
import { Link } from "expo-router";

export default function TabTwoScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularResults = await fetchPopularMovies();
        setPopularMovies(popularResults);
        const trendingResults = await fetchTrendingContent();
        setTrendingContent(trendingResults);
        const popularTVShows = await fetchPopularTVShows();
        setPopularTVShows(popularTVShows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchMoviesAndTVShows(text);
      const uniqueResults = results.filter(
        (result, index, self) =>
          index === self.findIndex((r) => r.id === result.id)
      );
      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("Error searching movies and TV shows:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Link href={`/moviedetail/${item.id}`}>
      <View style={styles.item} key={item.id}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={styles.poster}
        />
        <Text style={styles.title}>{item.title || item.name}</Text>
      </View>
    </Link>
  );

  const renderSection = ({ item }) => {
    switch (item.type) {
      case "searchResults":
        return (
          <MediaList
            data={item.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            isGrid={true}
            numColumns={3}
          />
        );
      case "popularMovies":
        return <PopularMovies popularMovies={popularMovies} />;
      case "trendingContent":
        return <TrendingComponent trendingContent={trendingContent} />;
      case "popularTVShows":
        return <PopularTVshow popularTVShows={popularTVShows} />;
      default:
        return null;
    }
  };

  const data = searchTerm
    ? [{ type: "searchResults", data: searchResults }]
    : [
        { type: "popularMovies", data: [] },
        { type: "trendingContent", data: [] },
        { type: "popularTVShows", data: [] },
      ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Logo}>Streamly</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies and TV shows..."
          onChangeText={handleSearch}
          value={searchTerm}
        />
      </View>
      <FlatList
        data={data}
        renderItem={renderSection}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={styles.scrollViewContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    top: 50,
    backgroundColor: '#1a1a1a',
  },
  Logo: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  Render: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  item: {
    width: 150,
    margin: 10,
    alignItems: "center",
  },
  poster: {
    width: 150,
    height: 180,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "white",
  },
});
