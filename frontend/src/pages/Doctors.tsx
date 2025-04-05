import { useState, useEffect } from 'react';
import { Doctor } from '../types';
import Spinner from '../components/Spinner';

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    degree: '',
    fees: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://humanity-founders-assignment.onrender.com/hospital/user/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://humanity-founders-assignment.onrender.com/hospital/staff/add-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newDoctor,
          fees: parseInt(newDoctor.fees)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }

      const data = await response.json();
      setDoctors([...doctors, data.data]);
      setIsAddingDoctor(false);
      setNewDoctor({ name: '', degree: '', fees: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add doctor');
    }
  };

  if (loading) {
    return <Spinner className="h-64" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Manage Doctors</h2>
        <button
          onClick={() => setIsAddingDoctor(true)}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Doctor
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isAddingDoctor && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Add New Doctor</h3>
            <button
              onClick={() => setIsAddingDoctor(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAddDoctor} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                required
                placeholder="Enter doctor's name"
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
                Degree & Specialization
              </label>
              <input
                type="text"
                id="degree"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={newDoctor.degree}
                onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                required
                placeholder="e.g., MBBS, MD - Cardiology"
              />
            </div>

            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fees
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="fees"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={newDoctor.fees}
                  onChange={(e) => setNewDoctor({ ...newDoctor, fees: e.target.value })}
                  required
                  placeholder="Enter consultation fees"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsAddingDoctor(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Add Doctor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dr. {doctor.name}</h3>
                <p className="text-gray-600 mt-1">{doctor.degree}</p>
              </div>
              <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                ₹{doctor.fees}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors; 