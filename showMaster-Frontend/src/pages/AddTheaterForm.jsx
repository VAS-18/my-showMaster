import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const addTheater = async (theaterData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post('/api/theater/addNew', theaterData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function AddTheaterForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const mutation = useMutation({
    mutationFn: addTheater,
    onSuccess: (data) => {
      alert(`Theater added successfully: ${data}`);
      setFormData({ name: '', address: '' });
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
      alert('You must be logged in to add a theater.');
      return;
    }
    if (!formData.name || !formData.address) {
      alert("Theater name and address are required.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Theater</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Theater Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
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
          {mutation.isPending ? 'Adding Theater...' : 'Add Theater'}
        </button>
      </form>
    </div>
  );
}

export default AddTheaterForm;