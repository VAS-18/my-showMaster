import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserRegistrationForm from './pages/UserRegistrationForm';
import LoginForm from './pages/LoginForm';
import AddMovieForm from './pages/AddMovieForm';
import AddTheaterForm from './pages/AddTheaterForm';
import AddTheaterSeatForm from './components/AddTheaterSeatForm';
import AddShowForm from './components/AddShowForm';
import AssociateSeatsForm from './pages/AssociateSeatsForm';
import BookTicketForm from './pages/BookTicketForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700">ShowMaster</h1>
        <nav className="mt-4 text-center">
          <Link to="/" className="mr-4 text-indigo-600 hover:text-indigo-800">Home</Link>
          <Link to="/register" className="mr-4 text-indigo-600 hover:text-indigo-800">Register</Link>
          <Link to="/login" className="mr-4 text-indigo-600 hover:text-indigo-800">Login</Link>
          <Link to="/add-movie" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Movie</Link>
          <Link to="/add-theater" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Theater</Link>
          <Link to="/add-theater-seat" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Theater Seat</Link>
          <Link to="/add-show" className="mr-4 text-indigo-600 hover:text-indigo-800">Add Show</Link>
          <Link to="/associate-seats" className="mr-4 text-indigo-600 hover:text-indigo-800">Associate Seats</Link>
          <Link to="/book-ticket" className="text-indigo-600 hover:text-indigo-800">Book Ticket</Link>
        </nav>
      </header>
      <main className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/add-movie" element={<AddMovieForm />} />
          <Route path="/add-theater" element={<AddTheaterForm />} />
          <Route path="/add-theater-seat" element={<AddTheaterSeatForm />} />
          <Route path="/add-show" element={<AddShowForm />} />
          <Route path="/associate-seats" element={<AssociateSeatsForm />} />
          <Route path="/book-ticket" element={<BookTicketForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
