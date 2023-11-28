// 1. Import moduls
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '90c95f605d644100846fc86f59c97f0e';

type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
};

type Genre = {
  id: number;
  name: string;
};

type MovieDetails = {
  title: string;
  overview: string;
  release_date: string;
  budget: number;
  backdrop_path: string;
};



const Home = () => {
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('title');
  const [rating, setRating] = useState<number>(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(30);

  const fetchMovies = async () => {
    try {
      if (currentPage % 2 === 1) {
        const pageNum = (currentPage + 1) / 2 * 3 - 2;
        const response1 = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`);
        const response2 = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum + 1}`);
        let result = response1.data.results.concat(response2.data.results).slice(0, 30);
        setTotalPages(Math.round(response1.data.total_pages * 20 / 30));
        setMovies(result);
      } else {
        const pageNum = currentPage / 2 * 3 - 1;
        const response1 = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`);
        const response2 = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum + 1}`);
        let result = response1.data.results.concat(response2.data.results).slice(10, 40);
        setTotalPages(Math.round(response1.data.total_pages * 20 / 30));
        setMovies(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.log(error);
    }
  };

  const sortMovies = (movies: Movie[]): Movie[] => {
    switch (sortBy) {
      case 'title':
        return [...movies].sort((a, b) => a.title.localeCompare(b.title));
      case 'release_date':
        return [...movies].sort((a, b) => a.release_date.localeCompare(b.release_date));
      case 'popularity':
        return [...movies].sort((a, b) => a.popularity - b.popularity);
      case 'vote_average':
        return [...movies].sort((a, b) => a.vote_average - b.vote_average);
      default:
        return movies;
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(Number(event.target.value));
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(event.target.value));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  useEffect(() => {
    fetchGenres(); // Get genre list
  }, []);

  useEffect(() => {
    fetchMovies(); // Get movie list
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mt-8 mb-4">Movies</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Genre:</label>
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="border rounded px-2 py-1 text-black"
          >
            <option value={0}>All</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Rating:</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={rating}
            onChange={handleRatingChange}
            className="border rounded px-2 py-1 w-20 text-black"
          />
        </div>
        <div>
          <label className="mr-2">Sort By:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded px-2 py-1 text-black"
          >
            <option value='title'>Title</option>
            <option value='release_date'>Release Date</option>
            <option value='popularity'>Popularity</option>
            <option value='vote_average'>Rating</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortMovies(movies)
          .filter(
            (movie) =>
              (!selectedGenre || movie.genre_ids.includes(selectedGenre)) &&
              (!rating || movie.vote_average >= rating)
          )
          .map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="mb-2 w-40 h-60 object-cover rounded"
              />
              <p className="text-center">{movie.title}</p>
              <p className="text-gray-500">{movie.release_date}</p>
            </div>
          ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Next Page
        </button>
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 bgopacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
              <button
                className="text-gray-500 text-3xl hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            {movieDetails ? (
              <div className='text-black'>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`}
                  alt={movieDetails.title}
                  className="mb-2 w-92 h-60 object-cover rounded"
                />
                <p>Release date: {movieDetails.release_date}</p>
                <p>{movieDetails.overview}</p>
                <p>Budget: {movieDetails.budget}</p>
              </div>
            ) : (
              <p>Loading movie details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;