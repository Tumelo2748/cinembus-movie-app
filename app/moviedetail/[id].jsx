import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { fetchMovieDetails, fetchTrailerLink } from "../../Utils/api";
import { WebView } from "react-native-webview";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchMovieDetails(id);
        setMovieDetails(details);

        const movieCredits = details.credits || {};
        setCredits(movieCredits);

        const link = await fetchTrailerLink(id);
        setTrailerLink(link);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  if (!movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const director = credits?.crew?.find((member) => member.job === "Director");
  const mainActors = credits?.cast?.slice(0, 5) || [];
  const relatedMovies = movieDetails?.similar?.results || [];
  const productionCompanies = movieDetails?.production_companies || [];

  const renderRelatedMovie = ({ item: movie }) => (
    <Link key={movie.id} href={`/moviedetail/${movie.id}`}>
      <View style={styles.relatedMovieItem}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.relatedMoviePoster}
        />
      </View>
    </Link>
  );

  const renderSeparator = () => <View style={styles.itemSeparator} />;

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`,
        }}
        style={styles.background}
        blurRadius={5}
      >
        <View style={styles.overlay} />
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
          }}
          style={styles.poster}
        />
        <Text style={styles.title}>{movieDetails.title}</Text>
        <Text style={styles.overview}>{movieDetails.overview}</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Release Date:</Text>{" "}
          {movieDetails.release_date}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Runtime:</Text> {movieDetails.runtime} mins
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Language:</Text>{" "}
          {movieDetails.original_language}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Rating:</Text> {movieDetails.vote_average}{" "}
          ({movieDetails.vote_count} votes)
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Director:</Text> {director?.name}
        </Text>

        <Text style={styles.subtitle}>Main Actors:</Text>
        <ScrollView horizontal style={styles.actorsContainer}>
          {mainActors.map((actor) => (
            <View key={actor.id} style={styles.actorItem}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}`,
                }}
                style={styles.actorImage}
              />
              <Text style={styles.actorName}>{actor.name}</Text>
              <Text style={styles.actorCharacter}>as {actor.character}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.subtitle}>Production Company:</Text>
        {productionCompanies.map((company) => (
          <View key={company.id} style={styles.productionCompany}>
            {company.logo_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${company.logo_path}`,
                }}
                style={styles.companyLogo}
              />
            )}
            <Text style={styles.info}>{company.name}</Text>
          </View>
        ))}

        <Text style={styles.subtitle}>Trailer:</Text>
        {trailerLink ? (
          <WebView source={{ uri: trailerLink }} style={styles.video} />
        ) : (
          <Text style={styles.info}>No trailer available</Text>
        )}

        <Text style={styles.subtitle}>Related Movies:</Text>
        <FlatList
          data={relatedMovies.slice(0, 5)}
          renderItem={renderRelatedMovie}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.relatedMoviesContainer}
        />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
  },
  background: {
    flex: 1,
    padding: 10,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  poster: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  overview: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
    textAlign: "justify",
  },
  info: {
    fontSize: 16,
    color: "white",
    marginVertical: 2,
  },
  label: {
    fontWeight: "bold",
    color: "#F4C10F",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F4C10F",
    marginTop: 20,
    marginBottom: 10,
  },
  actorsContainer: {
    marginVertical: 10,
  },
  actorItem: {
    marginRight: 10,
    alignItems: "center",
  },
  actorImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  actorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
    textAlign: "center",
  },
  actorCharacter: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  productionCompany: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  relatedMoviesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  relatedMovieItem: {
    alignItems: "center",
  },
  relatedMoviePoster: {
    width: 130,
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    
  },
  itemSeparator: {
    width: 20,
  },
  video: {
    width: "100%",
    height: 200,
  },
});
