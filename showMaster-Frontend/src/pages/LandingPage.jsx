import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [selectedCity, setSelectedCity] = useState('Greater Noida');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-indigo-100"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Book</span> your<br />
                  <span className="text-gray-800">perfect</span><br />
                  <span className="text-purple-600">movie</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Discover and book your favorite movies, plays, sports events and live shows. 
                  Experience entertainment like never before with our seamless booking platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/now-playing"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2 group"
                >
                  <span>Book Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-center"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-gray-600">Movies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-gray-600">Theaters</div>
                </div>
              </div>
            </div>

            {/* Right Content - Movie Cards */}
            <div className="flex justify-center lg:justify-end animate-slide-in-right">
              <div className="relative">
                {/* First Movie Card */}
                <div className="movie-card w-80 h-96 transform rotate-6 absolute top-4 left-4 z-10">
                  <div className="h-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-6xl mb-4">🎬</div>
                      <h3 className="text-2xl font-bold mb-2">Mission Impossible</h3>
                      <p className="text-purple-200">Action • Thriller</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold">8.8</span>
                          <span className="text-purple-200">/10</span>
                        </div>
                        <span className="text-sm text-purple-200">507.4K votes</span>
                      </div>
                      <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-2 rounded-lg hover:bg-white/30 transition-all duration-200">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Movie Card */}
                <div className="movie-card w-80 h-96 transform -rotate-3 z-20 relative">
                  <div className="h-full bg-gradient-to-br from-red-600 via-red-700 to-orange-800 rounded-2xl p-6 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-6xl mb-4">🎭</div>
                      <h3 className="text-2xl font-bold mb-2">Raid 2</h3>
                      <p className="text-red-200">Action • Drama</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold">8.2</span>
                          <span className="text-red-200">/10</span>
                        </div>
                        <span className="text-sm text-red-200">88.4K votes</span>
                      </div>
                      <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-2 rounded-lg hover:bg-white/30 transition-all duration-200">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  🎟️
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                  🍿
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Why Choose <span className="gradient-text">ShowMaster</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of entertainment booking with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center card-hover group-hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  🎟️
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Booking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Book tickets for your favorite movies in just a few clicks with our intuitive interface.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center card-hover group-hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  🏛️
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Theaters</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience movies in state-of-the-art theaters with the best sound and picture quality.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center card-hover group-hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  👥
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure Platform</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data and payments are protected with enterprise-grade security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your
            <br />
            Entertainment Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers who trust ShowMaster for their entertainment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <span>Get Started Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/now-playing"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-center"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-2xl font-bold">ShowMaster</span>
            </div>
            <p className="text-gray-400">Your gateway to amazing entertainment experiences</p>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400">&copy; 2025 ShowMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;