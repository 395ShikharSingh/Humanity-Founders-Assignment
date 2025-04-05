import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Hospital
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Home
            </Link>
            {token ? (
              <Link to="/doctors" className="text-gray-600 hover:text-primary-600">
                Add Doctor
              </Link>
            ) : (
              <Link to="/public-doctors" className="text-gray-600 hover:text-primary-600">
                Our Doctors
              </Link>
            )}
            {!token && (
              <>
                <Link to="/book-appointment" className="text-gray-600 hover:text-primary-600">
                  Book Appointment
                </Link>
                <Link to="/my-appointments" className="text-gray-600 hover:text-primary-600">
                  My Appointments
                </Link>
              </>
            )}
            
            {token ? (
              // Staff links
              <>
                <Link to="/appointments" className="text-gray-600 hover:text-primary-600">
                  View Appointments
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Staff Logout
                </button>
              </>
            ) : (
              // Staff login link
              <Link to="/login" className="text-gray-600 hover:text-primary-600">
                Staff Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {token ? (
                <Link
                  to="/doctors"
                  className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Add Doctor
                </Link>
              ) : (
                <Link
                  to="/public-doctors"
                  className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Our Doctors
                </Link>
              )}
              {!token && (
                <>
                  <Link
                    to="/book-appointment"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/my-appointments"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    My Appointments
                  </Link>
                </>
              )}
              
              {token ? (
                // Staff links
                <>
                  <Link
                    to="/appointments"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    View Appointments
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600"
                  >
                    Staff Logout
                  </button>
                </>
              ) : (
                // Staff login link
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Staff Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 