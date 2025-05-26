import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const bookTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  // Ensure numeric fields are sent as numbers and requestSeats is an array of strings
  const payload = {
    showId: parseInt(ticketData.showId, 10),
    userId: parseInt(ticketData.userId, 10),
    requestSeats: ticketData.seatNos.split(',').map(s => s.trim()).filter(s => s !== ''),
  };
  const { data } = await axios.post('/api/ticket/book', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

// Function to fetch user profile from backend
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const { data } = await axios.get('/api/user/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function BookTicketForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const showInfo = location.state;

  const [formData, setFormData] = useState({
    showId: '',
    userId: '',
    seatNos: ''
  });

  const [userInfo, setUserInfo] = useState({
    userId: null,
    username: null
  });

  const [loading, setLoading] = useState(true);

  const mutation = useMutation({
    mutationFn: bookTicket,
    onSuccess: (data) => {
      alert(`Ticket booked successfully! Amount: ${data.amount}, Allotted Seats: ${data.allottedSeats}, Movie: ${data.movieName}`);
      setFormData(prev => ({ ...prev, seatNos: '' }));
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data || error.message}`);
    }
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Enhanced debugging: Log the showInfo to see what data is being passed
        console.log('=== DEBUGGING NAVIGATION STATE ===');
        console.log('Show info received from navigation:', showInfo);
        console.log('showInfo type:', typeof showInfo);
        console.log('showInfo keys:', showInfo ? Object.keys(showInfo) : 'showInfo is null/undefined');
        
        if (showInfo) {
          console.log('showInfo.showId:', showInfo.showId);
          console.log('showInfo.id:', showInfo.id);
          console.log('All showInfo properties:');
          Object.entries(showInfo).forEach(([key, value]) => {
            console.log(`  ${key}:`, value);
          });
        }
        
        const profile = await fetchUserProfile();
        if (profile) {
          setUserInfo({
            userId: profile.userId,
            username: profile.username 
          });
          
          // Handle both showId and id properties from navigation state
          const showIdToSet = showInfo?.showId || showInfo?.id || '';
          console.log('Setting showId to:', showIdToSet);
          
          setFormData(prev => ({
            ...prev,
            showId: showIdToSet,
            userId: profile.userId
          }));
        } else {
          alert('Unable to get user information. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [showInfo, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Debug: Log the form data to see what's actually in it
    console.log('=== DEBUGGING FORM SUBMISSION ===');
    console.log('Form data:', formData);
    console.log('User info:', userInfo);
    console.log('Show info from navigation:', showInfo);
    
    // Improved validation
    const showIdValue = formData.showId;
    const userIdValue = formData.userId;
    const seatNosValue = formData.seatNos?.trim();
    
    console.log('=== VALIDATION VALUES ===');
    console.log('showIdValue:', showIdValue);
    console.log('userIdValue:', userIdValue);
    console.log('seatNosValue:', seatNosValue);
    
    // Check if we have a valid showId (either from navigation or manual input)
    const hasValidShowId = showIdValue && showIdValue !== '' && !isNaN(parseInt(showIdValue, 10));
    const hasValidUserId = userIdValue && userIdValue !== '' && !isNaN(parseInt(userIdValue, 10));
    const hasValidSeatNos = seatNosValue && seatNosValue !== '';
    
    console.log('=== VALIDATION RESULTS ===');
    console.log('hasValidShowId:', hasValidShowId);
    console.log('hasValidUserId:', hasValidUserId);
    console.log('hasValidSeatNos:', hasValidSeatNos);
    
    if (!hasValidShowId) {
      alert("Show ID is required. Please select a show or enter a valid Show ID.");
      return;
    }
    
    if (!hasValidUserId) {
      alert("User ID is required. Please log in again.");
      return;
    }
    
    if (!hasValidSeatNos) {
      alert("Seat numbers are required. Please enter seat numbers (e.g., A1, A2, B5).");
      return;
    }
    
    console.log('=== VALIDATION PASSED - SUBMITTING ===');
    mutation.mutate(formData);
  };

  // Show loading state while fetching user info
  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">Loading user information...</div>
      </div>
    );
  }

  // Don't render the form if user info is not loaded yet
  if (!userInfo.userId) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center text-red-600">Unable to load user information. Please try logging in again.</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Book Ticket</h2>
      
      {/* Show user info */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Booking For</h3>
        <p className="text-sm text-green-700"><strong>User:</strong> {userInfo.username}</p>
        <p className="text-sm text-green-700"><strong>User ID:</strong> {userInfo.userId}</p>
      </div>
      
      {/* Show booking information if coming from Now Playing */}
      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Show Details</h3>
          <p className="text-sm text-blue-700"><strong>Movie:</strong> {showInfo.movieName}</p>
          <p className="text-sm text-blue-700"><strong>Theater:</strong> {showInfo.theaterName}</p>
          <p className="text-sm text-blue-700"><strong>Date:</strong> {new Date(showInfo.showDate).toLocaleDateString()}</p>
          <p className="text-sm text-blue-700"><strong>Time:</strong> {showInfo.showTime}</p>
          <p className="text-sm text-blue-700"><strong>Show ID:</strong> {formData.showId}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Show ID - always show for transparency, but make it readonly when coming from Now Playing */}
        <div>
          <label htmlFor="showId" className="block text-sm font-medium text-gray-700">Show ID:</label>
          <input
            type="number"
            name="showId"
            id="showId"
            value={formData.showId}
            onChange={handleChange}
            required
            readOnly={!!showInfo}
            placeholder="Enter ID of the show"
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              showInfo ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
          {showInfo && (
            <p className="mt-1 text-xs text-gray-500">
              Show ID is automatically filled from your selection
            </p>
          )}
        </div>

        {/* Hidden user ID field - automatically populated */}
        <input
          type="hidden"
          name="userId"
          value={formData.userId}
        />

        <div>
          <label htmlFor="seatNos" className="block text-sm font-medium text-gray-700">Seat Numbers (comma-separated):</label>
          <input
            type="text"
            name="seatNos"
            id="seatNos"
            value={formData.seatNos}
            onChange={handleChange}
            required
            placeholder="e.g., A1, A2, B5"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter seat numbers separated by commas. Example: A1, A2, B5
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex space-x-4">
          {showInfo && (
            <button
              type="button"
              onClick={() => navigate('/now-playing')}
              className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
            >
              Back to Now Playing
            </button>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          >
            {mutation.isPending ? 'Booking Ticket...' : 'Book Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookTicketForm;