import React from 'react';

function LandingPage() {
  return (
    <div className="text-center">
      <header className="bg-indigo-600 text-white p-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to ShowMaster</h1>
        <p className="text-xl mb-8">Your ultimate solution for booking movie tickets and managing cinema operations.</p>
        <button 
          onClick={() => alert('Get Started Clicked!')} 
          className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-100 transition duration-300"
        >
          Get Started
        </button>
      </header>
      
      <section className="py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Easy Ticket Booking</h3>
            <p className="text-gray-600">Book tickets for your favorite movies in just a few clicks.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Theater Management</h3>
            <p className="text-gray-600">Add and manage theaters, seats, and show timings effortlessly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">User Administration</h3>
            <p className="text-gray-600">Manage user registrations and access control.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-6 mt-10">
        <p>&copy; 2025 ShowMaster. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;