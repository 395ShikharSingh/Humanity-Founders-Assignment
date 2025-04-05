import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import Spinner from '../components/Spinner';

const PublicDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/hospital/user/doctors');
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

  if (loading) {
    return <Spinner className="h-64" />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Our Doctors</h2>
        <Link
          to="/book-appointment"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Book Appointment
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Dr. {doctor.name}</h3>
            <p className="text-gray-600 mb-2">{doctor.degree}</p>
            <p className="text-gray-600">Consultation Fee: ₹{doctor.fees}</p>
            <Link
              to={`/book-appointment?doctorId=${doctor.id}`}
              className="mt-4 inline-block text-primary-600 hover:text-primary-700"
            >
              Book Appointment →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDoctors; 