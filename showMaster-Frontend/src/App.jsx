import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
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
import MyTicketsPage from './pages/MyTicketsPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || '');
    };

    window.addEventListener('storage', handleStorageChange);
    
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        userProfile={userProfile}
        loading={loading}
        onLogout={handleLogout}
      />
      
      <main className="min-h-[calc(100vh-4rem)]">
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
          <Route path="/my-tickets" element={<MyTicketsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
