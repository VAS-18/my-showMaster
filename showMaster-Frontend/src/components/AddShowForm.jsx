import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const addShow = async (showData) => {
  const token = localStorage.getItem('token');
  // Ensure numeric fields are sent as numbers if required by backend
  const payload = {
    ...showData,
    movieId: parseInt(showData.movieId, 10),
    theaterId: parseInt(showData.theaterId, 10)
  };
  const { data } = await axios.post('/api/show/addNew', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function AddShowForm() {
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    showTime: '',
    showDate: ''
  });

  const mutation = useMutation({
    mutationFn: addShow,
    onSuccess: (data) => {
      alert(`Show added successfully: ${data}`);
      setFormData({ movieId: '', theaterId: '', showTime: '', showDate: '' });
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
      alert('You must be logged in to add a show.');
      return;
    }
    if (!formData.movieId || !formData.theaterId || !formData.showTime || !formData.showDate) {
      alert("All fields are required.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Show</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="movieId" className="block text-sm font-medium text-gray-700">Movie ID:</label>
          <input
            type="number"
            name="movieId"
            id="movieId"
            value={formData.movieId}
            onChange={handleChange}
            required
            placeholder="Enter ID of the movie"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
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
        <div>
          <label htmlFor="showDate" className="block text-sm font-medium text-gray-700">Show Date:</label>
          <input
            type="date"
            name="showDate"
            id="showDate"
            value={formData.showDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="showTime" className="block text-sm font-medium text-gray-700">Show Time:</label>
          <input
            type="time"
            name="showTime"
            id="showTime"
            value={formData.showTime}
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
          {mutation.isPending ? 'Adding Show...' : 'Add Show'}
        </button>
      </form>
    </div>
  );
}

export default AddShowForm;