import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const bookTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  const payload = {
    showId: parseInt(ticketData.showId, 10),
    userId: parseInt(ticketData.userId, 10),
    requestSeats: ticketData.selectedSeats,
  };
  const { data } = await axios.post('/api/ticket/book', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const { data } = await axios.get('/api/user/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

const fetchShowSeats = async (showId) => {
  const token = localStorage.getItem('token');
  try {
    const { data } = await axios.get(`/api/show/${showId}/seats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    // If endpoint doesn't exist, return mock data
    console.warn('Show seats endpoint not available, using mock data');
    return generateMockSeats();
  }
};

// Generate mock seat layout for demonstration
const generateMockSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const bookedSeats = ['A3', 'A4', 'B7', 'C2', 'C3', 'D8', 'E5', 'F1', 'F2', 'G6'];
  
  return rows.map(row => ({
    row,
    seats: Array.from({ length: seatsPerRow }, (_, i) => ({
      id: `${row}${i + 1}`,
      number: i + 1,
      isBooked: bookedSeats.includes(`${row}${i + 1}`),
      price: row <= 'D' ? 250 : 180 // Premium vs Regular pricing
    }))
  }));
};

function BookTicketForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const showInfo = location.state;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userInfo, setUserInfo] = useState({ userId: null, username: null });
  const [loading, setLoading] = useState(true);

  // Fetch seat layout
  const { data: seatLayout = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['showSeats', showInfo?.showId],
    queryFn: () => fetchShowSeats(showInfo?.showId),
    enabled: !!showInfo?.showId,
  });

  const mutation = useMutation({
    mutationFn: bookTicket,
    onSuccess: (data) => {
      setSelectedSeats([]);
      // Show success modal instead of alert
      showSuccessModal(data);
    },
    onError: (error) => {
      showErrorModal(error.response?.data || error.message);
    }
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        if (profile) {
          setUserInfo({ userId: profile.userId, username: profile.username });
        } else {
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleSeatClick = (seatId, isBooked) => {
    if (isBooked) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      showErrorModal('Please select at least one seat');
      return;
    }

    mutation.mutate({
      showId: showInfo?.showId,
      userId: userInfo.userId,
      selectedSeats
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      const price = row <= 'D' ? 250 : 180;
      return total + price;
    }, 0);
  };

  const showSuccessModal = (data) => {
    // You can implement a proper modal here
    alert(`🎉 Tickets booked successfully!\n\nAmount: ₹${data.amount}\nSeats: ${data.allottedSeats}\nMovie: ${data.movieName}`);
  };

  const showErrorModal = (message) => {
    alert(`❌ ${message}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!userInfo.userId || !showInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 rounded-2xl border border-red-500/30">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-red-300 mb-6">Please login and select a show again</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/now-playing')}
            className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Movies
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select Your <span className="gradient-text bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Seats</span>
          </h1>
          <p className="text-gray-300 text-lg">Choose the perfect seats for your movie experience</p>
        </div>

        {/* Movie & Show Info */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  🎬 Movie Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Movie</span>
                    <span className="text-white font-medium">{showInfo.movieName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Theater</span>
                    <span className="text-white font-medium">{showInfo.theaterName}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  📅 Show Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white font-medium">
                      {new Date(showInfo.showDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white font-medium">{showInfo.showTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="max-w-6xl mx-auto">
          {/* Screen */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-b-3xl shadow-xl">
              <div className="text-lg font-semibold">🎬 SCREEN</div>
            </div>
          </div>

          {seatsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Seat Layout */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
                <div className="space-y-4">
                  {seatLayout.map((rowData) => (
                    <div key={rowData.row} className="flex items-center justify-center gap-2">
                      {/* Row Label */}
                      <div className="w-8 text-center text-white font-bold text-lg">
                        {rowData.row}
                      </div>
                      
                      {/* Seats */}
                      <div className="flex gap-1">
                        {rowData.seats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isBooked = seat.isBooked;
                          
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id, isBooked)}
                              disabled={isBooked}
                              className={`
                                w-10 h-10 rounded-lg text-xs font-semibold transition-all duration-200 
                                ${isBooked 
                                  ? 'bg-red-500/30 text-red-300 cursor-not-allowed border border-red-500/50' 
                                  : isSelected 
                                    ? 'bg-green-500 text-white shadow-lg scale-110 border-2 border-green-400' 
                                    : 'bg-gray-600/50 text-gray-300 hover:bg-purple-500/30 hover:text-purple-200 border border-gray-500/30'
                                }
                              `}
                              title={`Seat ${seat.id} - ₹${seat.price} ${isBooked ? '(Booked)' : ''}`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Add aisle gap in the middle */}
                      <div className="w-4"></div>
                      
                      <div className="w-8 text-center text-white font-bold text-lg">
                        {rowData.row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 mb-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-600/50 border border-gray-500/30 rounded-lg"></div>
                  <span className="text-gray-300 text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
                  <span className="text-gray-300 text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500/30 border border-red-500/50 rounded-lg"></div>
                  <span className="text-gray-300 text-sm">Booked</span>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Pricing</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-lg">₹250</div>
                    <div className="text-gray-400 text-sm">Premium (A-D)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold text-lg">₹180</div>
                    <div className="text-gray-400 text-sm">Regular (E-H)</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Booking Summary & Actions */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 p-6">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white">
                  <div className="text-lg font-semibold">
                    Selected Seats: {selectedSeats.join(', ')}
                  </div>
                  <div className="text-gray-300">
                    {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} • Total: ₹{calculateTotal()}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedSeats([])}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={mutation.isPending}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50"
                  >
                    {mutation.isPending ? 'Booking...' : `Book ${selectedSeats.length} Ticket${selectedSeats.length > 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookTicketForm;