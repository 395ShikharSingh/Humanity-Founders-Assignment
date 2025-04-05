import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

interface Appointment {
  id: number;
  userName: string;
  phone: string;
  appointmentDate: string;
  description?: string;
  doctor: {
    id: number;
    name: string;
    degree: string;
    fees: number;
  };
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3000/hospital/staff/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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
      <h2 className="text-2xl font-bold mb-6">Appointments</h2>
      
      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{appointment.userName}</h3>
                <p className="text-gray-600">Phone: {appointment.phone}</p>
                <p className="text-gray-600">
                  Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
                </p>
                {appointment.description && (
                  <p className="text-gray-600 mt-2">{appointment.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">Dr. {appointment.doctor.name}</p>
                <p className="text-sm text-gray-600">{appointment.doctor.degree}</p>
                <p className="text-sm text-gray-600">Fee: ₹{appointment.doctor.fees}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments; 