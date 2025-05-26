import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const addTheaterSeat = async (seatData) => {
  const token = localStorage.getItem('token');
  // Ensure numeric fields are sent as numbers if required by backend
  const payload = {
    ...seatData,
    theaterId: parseInt(seatData.theaterId, 10)
  };
  const { data } = await axios.post('/api/theater/addTheaterSeat', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function AddTheaterSeatForm() {
  const [formData, setFormData] = useState({
    seatNo: '',
    seatType: '',
    theaterId: ''
  });

  const mutation = useMutation({
    mutationFn: addTheaterSeat,
    onSuccess: (data) => {
      alert(`Theater seat added successfully: ${data}`);
      setFormData({ seatNo: '', seatType: '', theaterId: '' });
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
      alert('You must be logged in to add theater seats.');
      return;
    }
    if (!formData.seatNo || !formData.seatType || !formData.theaterId) {
        alert("All fields are required.");
        return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Theater Seats</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="seatNo" className="block text-sm font-medium text-gray-700">Seat Number:</label>
          <input
            type="text"
            name="seatNo"
            id="seatNo"
            value={formData.seatNo}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="seatType" className="block text-sm font-medium text-gray-700">Seat Type:</label>
          <select
            name="seatType"
            id="seatType"
            value={formData.seatType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Seat Type</option>
            <option value="CLASSIC">Classic</option>
            <option value="PREMIUM">Premium</option>
            {/* Add other seat types based on your backend enum */}
          </select>
        </div>
        <div>
          <label htmlFor="theaterId" className="block text-sm font-medium text-gray-700">Theater ID:</label>
          <input
            type="number"
            name="theaterId"
            id="theaterId"
            value={formData.theaterId}
            onChange={handleChange}
            required
            placeholder="Enter ID of the theater"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Adding Seats...' : 'Add Theater Seats'}
        </button>
      </form>
      {/* Message display handled by alerts or a toast library */}
    </div>
  );
}

export default AddTheaterSeatForm;
