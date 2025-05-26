import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const associateSeats = async (seatAssociationData) => {
  const token = localStorage.getItem('token');
  // Ensure numeric fields are sent as numbers
  const payload = {
    showId: parseInt(seatAssociationData.showId, 10),
    priceForClassicSeats: parseInt(seatAssociationData.priceForClassicSeats, 10),
    priceForPremiumSeats: parseInt(seatAssociationData.priceForPremiumSeats, 10)
  };
  const { data } = await axios.post('/api/show/associateSeats', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function AssociateSeatsForm() {
  const [formData, setFormData] = useState({
    showId: '',
    priceForClassicSeats: '',
    priceForPremiumSeats: ''
  });

  const mutation = useMutation({
    mutationFn: associateSeats,
    onSuccess: (data) => {
      alert(`Seats associated successfully: ${data}`);
      setFormData({ showId: '', priceForClassicSeats: '', priceForPremiumSeats: '' });
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
      alert('You must be logged in to associate seats.');
      return;
    }
    if (!formData.showId || !formData.priceForClassicSeats || !formData.priceForPremiumSeats) {
        alert("All fields are required.");
        return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Associate Seats with Show</h2>
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
          <label htmlFor="priceForClassicSeats" className="block text-sm font-medium text-gray-700">Price for Classic Seats:</label>
          <input
            type="number"
            name="priceForClassicSeats"
            id="priceForClassicSeats"
            value={formData.priceForClassicSeats}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="priceForPremiumSeats" className="block text-sm font-medium text-gray-700">Price for Premium Seats:</label>
          <input
            type="number"
            name="priceForPremiumSeats"
            id="priceForPremiumSeats"
            value={formData.priceForPremiumSeats}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Associating Seats...' : 'Associate Seats'}
        </button>
      </form>
      {/* Message display handled by alerts or a toast library */}
    </div>
  );
}

export default AssociateSeatsForm;