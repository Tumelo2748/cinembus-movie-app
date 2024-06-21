export const apiKey = process.env.Api_key;

const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const fetchTrendingContent = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${apiKey}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending content:", error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${apiKey}&query=${query}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const fetchPopularTVShows = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.results;
};

export const searchMoviesAndTVShows = async (query) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`
  );
  const data = await response.json();
  return data.results;
};

// export const fetchMovieDetails = async (id) => {
//   const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
//   const data = await response.json();
//   return data;
// };

export const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits,similar`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchRelatedMovies = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
};

export const fetchMovieCredits = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${apiKey}`);
  const data = await response.json();
  return data;
};

export async function fetchTrailerLink(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch trailer link');
    }
    const data = await response.json();
    const officialTrailer = data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    if (officialTrailer) {
      return `https://www.youtube.com/embed/${officialTrailer.key}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching trailer link:', error);
    throw error;
  }
}