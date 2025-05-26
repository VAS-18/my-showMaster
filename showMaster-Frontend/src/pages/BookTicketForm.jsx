import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const bookTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  // Ensure numeric fields are sent as numbers and seatNos is an array of strings
  const payload = {
    showId: parseInt(ticketData.showId, 10),
    userId: parseInt(ticketData.userId, 10), // Assuming userId is required and available
    seatNos: ticketData.seatNos.split(',').map(s => s.trim()).filter(s => s !== ''),
  };
  const { data } = await axios.post('/api/ticket/book', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function BookTicketForm() {
  const [formData, setFormData] = useState({
    showId: '',
    userId: '', // You'll need to get the logged-in user's ID here
    seatNos: '' // Comma-separated seat numbers
  });

  const mutation = useMutation({
    mutationFn: bookTicket,
    onSuccess: (data) => {
      // The backend returns a TicketResponse object
      // For now, just alerting. You might want to display this info more nicely.
      alert(`Ticket booked successfully! Amount: ${data.amount}, Allotted Seats: ${data.allottedSeats}, Movie: ${data.movieName}`);
      setFormData({ showId: '', userId: '', seatNos: '' });
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data || error.message}`);
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to book tickets.');
      return;
    }
    if (!formData.showId || !formData.userId || !formData.seatNos) {
        alert("All fields are required.");
        return;
    }
    // It's a good idea to get userId from a more reliable source than a form input,
    // e.g., from the decoded JWT token or a user context after login.
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Book Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="showId" className="block text-sm font-medium text-gray-700">Show ID:</label>
          <input
            type="number"
            name="showId"
            id="showId"
            value={formData.showId}
            onChange={handleChange}
            required
            placeholder="Enter ID of the show"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID:</label>
          <input
            type="number"
            name="userId"
            id="userId"
            value={formData.userId} // Ideally, this should be pre-filled or fetched, not manually entered
            onChange={handleChange}
            required
            placeholder="Enter your User ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
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
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Booking Ticket...' : 'Book Ticket'}
        </button>
      </form>
      {/* Message display handled by alerts or a toast library */}
    </div>
  );
}

export default BookTicketForm;