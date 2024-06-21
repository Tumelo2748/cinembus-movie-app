// TrendingComponent.js
import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import MediaList from '../Medialist/Medialist';
import { Link } from 'expo-router';

const TrendingComponent = ({ trendingContent }) => {
  const renderItem = ({ item }) => (
    <Link href={`/moviedetail/${item.id}`}>
    <View style={styles.item}>
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

  return (
    <MediaList
      header="Trending Now"
      data={trendingContent}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    width: 150,
    marginRight: 20,
    alignItems: "center",
  },
  poster: {
    width: 140,
    height: 180,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: 'white',
  },
});

export default TrendingComponent;
