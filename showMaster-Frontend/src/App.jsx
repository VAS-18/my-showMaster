import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import UserRegistrationForm from './pages/UserRegistrationForm';
import LoginForm from './pages/LoginForm';
import AddMovieForm from './pages/AddMovieForm';
import AddTheaterForm from './pages/AddTheaterForm';
import AddTheaterSeatForm from './components/AddTheaterSeatForm';
import AddShowForm from './components/AddShowForm';
import AssociateSeatsForm from './pages/AssociateSeatsForm';
import BookTicketForm from './pages/BookTicketForm';
import NowPlayingPage from './pages/NowPlayingPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user profile when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUserProfile(null);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // If token is invalid, clear it
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setToken('');
        }
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Listen for token changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || '');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for token changes periodically
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken || '');
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  const isLoggedIn = !!token && !!userProfile;
  const isAdmin = userProfile?.authorities?.includes('ROLE_ADMIN') || false;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700">ShowMaster</h1>
        <nav className="mt-4 text-center">
          <Link to="/" className="mr-4 text-indigo-600 hover:text-indigo-800">Home</Link>
          <Link to="/now-playing" className="mr-4 text-indigo-600 hover:text-indigo-800">Now Playing</Link>
          
          {/* Show register/login only if not logged in */}
          {!isLoggedIn && (
            <>
              <Link to="/register" className="mr-4 text-indigo-600 hover:text-indigo-800">Register</Link>
              <Link to="/login" className="mr-4 text-indigo-600 hover:text-indigo-800">Login</Link>
            </>
          )}

          {/* Admin-only features */}
          {isLoggedIn && isAdmin && (
            <>
              <Link to="/add-movie" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Movie</Link>
              <Link to="/add-theater" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Theater</Link>
              <Link to="/add-theater-seat" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Theater Seat</Link>
              <Link to="/add-show" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Show</Link>
              <Link to="/associate-seats" className="mr-4 text-indigo-600 hover:text-indigo-800">Associate Seats</Link>
            </>
          )}

          {/* User features (show for all logged-in users) */}
          {isLoggedIn && (
            <Link to="/book-ticket" className="mr-4 text-indigo-600 hover:text-indigo-800">Book Ticket</Link>
          )}

          {/* Logout button for logged-in users */}
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          )}

          {/* Loading indicator */}
          {token && loading && (
            <span className="text-gray-500 text-sm ml-4">Loading...</span>
          )}
        </nav>

        {/* User status indicator */}
        {isLoggedIn && (
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              Logged in as: <span className="font-medium">{userProfile.username}</span> - 
              <span className="font-medium"> {isAdmin ? 'Admin' : 'User'}</span>
            </span>
          </div>
        )}
      </header>
      
      <main className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/now-playing" element={<NowPlayingPage />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/add-movie" element={<AddMovieForm />} />
          <Route path="/add-theater" element={<AddTheaterForm />} />
          <Route path="/add-theater-seat" element={<AddTheaterSeatForm />} />
          <Route path="/add-show" element={<AddShowForm />} />
          <Route path="/associate-seats" element={<AssociateSeatsForm />} />
          <Route path="/book-ticket" element={<BookTicketForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
