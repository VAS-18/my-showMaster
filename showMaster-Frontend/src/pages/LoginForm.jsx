import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';

const loginUser = async (credentials) => {
  const { data } = await axios.post('/api/user/getToken', credentials);
  return data; // This should be the JWT token
};

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '', // Corresponds to emailId in your backend UserRequest for login
    password: ''
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (receivedToken) => {
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      toast.success('Login successful!');
      setFormData({ username: '', password: '' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data || error.message}`);
      localStorage.removeItem('token');
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.warn("Username and Password are required.");
      return;
    }
    mutation.mutate(formData);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    toast.info('Logged out successfully.');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== token) {
        setToken(storedToken || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      {!token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username (Email):</label>
            <input
              type="email"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
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
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600">You are logged in.</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginForm;