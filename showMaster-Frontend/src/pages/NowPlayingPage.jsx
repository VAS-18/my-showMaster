import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchMovies = async () => {
  try {
    const { data } = await axios.get('/api/movie/all');
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

const fetchShowsByMovie = async (movieId) => {
  try {
    const { data } = await axios.get(`/api/show/movie/${movieId}`);
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw new Error('Failed to fetch shows');
  }
};

function NowPlayingPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const navigate = useNavigate();

  const { data: movies = [], isLoading: moviesLoading, error: moviesError } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: shows = [], isLoading: showsLoading, error: showsError } = useQuery({
    queryKey: ['shows', selectedMovie?.id],
    queryFn: () => fetchShowsByMovie(selectedMovie.id),
    enabled: !!selectedMovie,
    retry: 2,
  });

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedShow(null);
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
  };

  const handleBookTicket = () => {
    if (selectedShow) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book tickets');
        return;
      }
      
      // Debug: Log the selectedShow to see what properties it has
      console.log('=== DEBUGGING SELECTED SHOW ===');
      console.log('selectedShow:', selectedShow);
      console.log('selectedShow.showId:', selectedShow.showId);
      console.log('selectedShow.id:', selectedShow.id);
      
      // Navigate to book ticket page with show information as state
      // Use showId (backend property) instead of id
      navigate('/book-ticket', {
        state: {
          showId: selectedShow.showId || selectedShow.id, // Try showId first, fallback to id
          movieName: selectedMovie.movieName,
          theaterName: selectedShow.theater.name,
          showDate: selectedShow.date || selectedShow.showDate, // Handle both possible property names
          showTime: selectedShow.time || selectedShow.showTime  // Handle both possible property names
        }
      });
    }
  };

  if (moviesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading movies...</div>
      </div>
    );
  }

  if (moviesError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">
          Error loading movies: {moviesError.message}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if movies is empty
  if (!Array.isArray(movies) || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Now Playing</h1>
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">No movies available</div>
          <p className="text-gray-500 mb-6">
            It looks like there are no movies in the system yet. 
            Please contact an administrator to add movies.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Now Playing</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Movies Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Movie</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedMovie?.id === movie.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-800">{movie.movieName}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Genre:</span> {movie.genre}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Language:</span> {movie.language}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {movie.duration} minutes
                  </p>
                  {movie.rating && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Rating:</span> {movie.rating}/10
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Release Date:</span> {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shows Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {selectedMovie ? `Shows for ${selectedMovie.movieName}` : 'Select a movie to see shows'}
          </h2>
          
          {selectedMovie && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {showsLoading ? (
                <div className="text-center text-gray-600">Loading shows...</div>
              ) : showsError ? (
                <div className="text-center text-red-600">
                  Error loading shows: {showsError.message}
                </div>
              ) : Array.isArray(shows) && shows.length > 0 ? (
                shows.map((show) => (
                  <div
                    key={show.showId || show.id}
                    onClick={() => handleShowSelect(show)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedShow?.showId === show.showId || selectedShow?.id === show.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-300 hover:border-green-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{show.theater.name}</h4>
                        <p className="text-sm text-gray-600">{show.theater.address}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-medium text-gray-700">
                            Date: {new Date(show.date || show.showDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            Time: {show.time || show.showTime}
                          </p>
                        </div>
                      </div>
                      {(selectedShow?.showId === show.showId || selectedShow?.id === show.id) && (
                        <div className="text-green-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No shows available for this movie</div>
              )}
            </div>
          )}

          {/* Book Ticket Button */}
          {selectedShow && (
            <div className="mt-6">
              <button
                onClick={handleBookTicket}
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Book Ticket for {selectedShow.theater.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NowPlayingPage;