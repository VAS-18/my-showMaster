import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchMovies = async () => {
  try {
    const { data } = await axios.get('/api/movie/all');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

const fetchShowsByMovie = async (movieId) => {
  try {
    const { data } = await axios.get(`/api/show/movie/${movieId}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw new Error('Failed to fetch shows');
  }
};

function NowPlayingPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const navigate = useNavigate();

  const { data: movies = [], isLoading: moviesLoading, error: moviesError } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: shows = [], isLoading: showsLoading, error: showsError } = useQuery({
    queryKey: ['shows', selectedMovie?.id],
    queryFn: () => fetchShowsByMovie(selectedMovie.id),
    enabled: !!selectedMovie,
    retry: 2,
  });

  // Filter movies based on search and genre
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.movieName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres for filter
  const genres = ['all', ...new Set(movies.map(movie => movie.genre))];

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
      
      navigate('/book-ticket', {
        state: {
          showId: selectedShow.showId || selectedShow.id,
          movieName: selectedMovie.movieName,
          theaterName: selectedShow.theater.name,
          showDate: selectedShow.date || selectedShow.showDate,
          showTime: selectedShow.time || selectedShow.showTime
        }
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (moviesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  if (moviesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-500/30">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-6">{moviesError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700">
          <div className="text-8xl mb-6">🎭</div>
          <h2 className="text-3xl font-bold text-white mb-4">No Movies Available</h2>
          <p className="text-gray-300 mb-6 max-w-md">
            The theater is currently empty. Check back soon for the latest blockbusters!
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Now <span className="gradient-text bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Playing</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the latest blockbusters and book your perfect movie experience
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Genre Filter */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="bg-gray-900 text-white">
                    {genre === 'all' ? 'All Genres' : genre.charAt(0) + genre.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        {selectedMovie ? (
          /* Movie Details and Shows View */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Selected Movie Details */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 sticky top-24">
                <button 
                  onClick={() => setSelectedMovie(null)}
                  className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Movies
                </button>
                
                <div className="text-center">
                  {selectedMovie.posterUrl ? (
                    <img 
                      src={selectedMovie.posterUrl} 
                      alt={selectedMovie.movieName}
                      className="w-48 h-72 object-cover rounded-2xl mx-auto mb-6 shadow-2xl"
                    />
                  ) : (
                    <div className="w-48 h-72 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl">
                      🎬
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedMovie.movieName}</h2>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Genre</span>
                      <span className="text-white font-medium">{selectedMovie.genre}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-medium">{selectedMovie.duration} min</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Language</span>
                      <span className="text-white font-medium">{selectedMovie.language}</span>
                    </div>
                    {selectedMovie.rating && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-gray-400">Rating</span>
                        <span className="text-yellow-400 font-medium">⭐ {selectedMovie.rating}/10</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Release Date</span>
                      <span className="text-white font-medium">{formatDate(selectedMovie.releaseDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shows Section */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-white mb-6">Available Shows</h3>
              
              {showsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : showsError ? (
                <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-500/30">
                  <p className="text-red-300">Error loading shows: {showsError.message}</p>
                </div>
              ) : Array.isArray(shows) && shows.length > 0 ? (
                <div className="space-y-4">
                  {shows.map((show) => (
                    <div
                      key={show.showId || show.id}
                      onClick={() => handleShowSelect(show)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedShow?.showId === show.showId || selectedShow?.id === show.id
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-2">{show.theater.name}</h4>
                          <p className="text-gray-300 mb-4">{show.theater.address}</p>
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-purple-300 font-medium">{formatDate(show.date || show.showDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-indigo-300 font-medium">{formatTime(show.time || show.showTime)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {(selectedShow?.showId === show.showId || selectedShow?.id === show.id) && (
                          <div className="text-green-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Book Ticket Button */}
                  {selectedShow && (
                    <div className="mt-8">
                      <button
                        onClick={handleBookTicket}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                      >
                        🎟️ Book Tickets for {selectedShow.theater.name}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Shows Available</h3>
                  <p className="text-gray-400">This movie doesn't have any scheduled shows yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Movies Grid View */
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Movie</h2>
            
            {filteredMovies.length === 0 ? (
              <div className="text-center p-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Movies Found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleMovieSelect(movie)}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                      {/* Movie Poster */}
                      <div className="relative overflow-hidden">
                        {movie.posterUrl ? (
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.movieName}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-80 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                            🎬
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Genre Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {movie.genre}
                          </span>
                        </div>
                        
                        {/* Rating Badge */}
                        {movie.rating && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-500/80 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full">
                              ⭐ {movie.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Movie Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {movie.movieName}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Duration</span>
                            <span className="text-gray-300">{movie.duration} min</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Language</span>
                            <span className="text-gray-300">{movie.language}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Release</span>
                            <span className="text-gray-300">{formatDate(movie.releaseDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NowPlayingPage;