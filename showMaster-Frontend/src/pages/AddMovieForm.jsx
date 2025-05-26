import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const addMovie = async (movieData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post('/api/movie/addNew', movieData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return data;
};

function AddMovieForm() {
  const [formData, setFormData] = useState({
    movieName: '',
    genre: '',
    language: '',
    duration: '',
    rating: '',
    releaseDate: '',
    posterUrl: ''
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const mutation = useMutation({
    mutationFn: addMovie,
    onSuccess: (data) => {
      alert(`Movie added successfully: ${data}`);
      setFormData({ movieName: '', genre: '', language: '', duration: '', rating: '', releaseDate: '', posterUrl: '' });
      setPosterFile(null);
      setPosterPreview(null);
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data || error.message}`);
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // For now, we'll use a placeholder URL or you can implement file upload to a cloud service
      // This is a simple implementation that stores the file name
      setFormData({ ...formData, posterUrl: `uploads/${file.name}` });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a movie.');
      return;
    }
    // Basic validation
    if (!formData.movieName || !formData.genre || !formData.language || !formData.duration || !formData.releaseDate) {
        alert("All fields except rating and poster are required.");
        return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="movieName" className="block text-sm font-medium text-gray-700">Movie Name:</label>
          <input type="text" name="movieName" id="movieName" value={formData.movieName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        
        <div>
          <label htmlFor="poster" className="block text-sm font-medium text-gray-700">Movie Poster:</label>
          <input 
            type="file" 
            name="poster" 
            id="poster" 
            accept="image/*"
            onChange={handleFileChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          />
          {posterPreview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={posterPreview} 
                alt="Movie poster preview" 
                className="w-32 h-48 object-cover rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700">Or Poster URL:</label>
          <input 
            type="url" 
            name="posterUrl" 
            id="posterUrl" 
            value={formData.posterUrl} 
            onChange={handleChange} 
            placeholder="https://example.com/poster.jpg"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          />
          <p className="mt-1 text-xs text-gray-500">You can either upload a file or provide a URL to an existing poster image</p>
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre:</label>
          <select 
            name="genre" 
            id="genre" 
            value={formData.genre} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Genre</option>
            <option value="ACTION">Action</option>
            <option value="ANIMATION">Animation</option>
            <option value="COMEDY">Comedy</option>
            <option value="DRAMA">Drama</option>
            <option value="HISTORICAL">Historical</option>
            <option value="ROMANTIC">Romantic</option>
            <option value="SOCIAL">Social</option>
            <option value="SPORTS">Sports</option>
            <option value="THRILLER">Thriller</option>
            <option value="WAR">War</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language:</label>
          <input type="text" name="language" id="language" value={formData.language} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes):</label>
          <input type="number" name="duration" id="duration" value={formData.duration} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (e.g., 8.5):</label>
          <input type="number" step="0.1" name="rating" id="rating" value={formData.rating} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">Release Date:</label>
          <input type="date" name="releaseDate" id="releaseDate" value={formData.releaseDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Adding Movie...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
}

export default AddMovieForm;