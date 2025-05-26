import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ isLoggedIn, isAdmin, userProfile, loading, onLogout }) {
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  const closeAdminDropdown = () => {
    setIsAdminDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
              S
            </div>
            <span className="text-2xl font-bold gradient-text">ShowMaster</span>
          </Link>

          {/* Navigation Links - Pill Style */}
          <div className="hidden md:flex items-center bg-gray-100/70 backdrop-blur-sm rounded-full p-1 space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600"
            >
              Home
            </Link>
            <Link 
              to="/now-playing" 
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600"
            >
              Movies
            </Link>
            
            {!isLoggedIn && (
              <>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600"
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-sm"
                >
                  Login
                </Link>
              </>
            )}

            {isLoggedIn && isAdmin && (
              <div className="relative">
                <button 
                  onClick={toggleAdminDropdown}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                    isAdminDropdownOpen 
                      ? 'bg-white shadow-sm text-purple-600' 
                      : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600'
                  }`}
                >
                  <span>Admin</span>
                  <svg 
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isAdminDropdownOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isAdminDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={closeAdminDropdown}
                    ></div>
                    
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <Link 
                        to="/add-movie" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={closeAdminDropdown}
                      >
                        Add Movie
                      </Link>
                      <Link 
                        to="/add-theater" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={closeAdminDropdown}
                      >
                        Add Theater
                      </Link>
                      <Link 
                        to="/add-theater-seat" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={closeAdminDropdown}
                      >
                        Add Theater Seat
                      </Link>
                      <Link 
                        to="/add-show" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={closeAdminDropdown}
                      >
                        Add Show
                      </Link>
                      <Link 
                        to="/associate-seats" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={closeAdminDropdown}
                      >
                        Associate Seats
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {isLoggedIn && (
              <>
                <Link 
                  to="/book-ticket" 
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600"
                >
                  Book Ticket
                </Link>
                <Link 
                  to="/my-tickets" 
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-sm text-gray-700 hover:text-purple-600 flex items-center space-x-2"
                >
                  <span>My Tickets</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </Link>
              </>
            )}
          </div>

          {/* User Profile & Actions - Right Side */}
          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <>
                {/* User Profile Pill */}
                <div className="hidden md:flex items-center bg-gray-100/70 backdrop-blur-sm rounded-full px-3 py-2 space-x-3">
                  <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {userProfile?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-gray-900 leading-tight">{userProfile?.username}</p>
                    <p className="text-gray-500 leading-tight">{isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                </div>
                
                {/* Logout Button Pill */}
                <button 
                  onClick={onLogout}
                  className="px-3 py-2 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 flex items-center space-x-1 border border-red-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            )}

            {isLoggedIn && loading && (
              <div className="flex items-center bg-gray-100/70 backdrop-blur-sm rounded-full px-3 py-2 space-x-2">
                <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;