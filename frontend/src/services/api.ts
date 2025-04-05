const API_URL = 'https://humanity-founders-assignment.onrender.com/hospital';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  register: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/staff/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  // Doctors
  getDoctors: async () => {
    const response = await fetch(`${API_URL}/user/doctors`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  addDoctor: async (doctor: { name: string; degree: string; fees: number }) => {
    const response = await fetch(`${API_URL}/staff/add-doctor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(doctor),
    });
    return response.json();
  },

  // Appointments
  getAppointments: async () => {
    const response = await fetch(`${API_URL}/staff/appointments`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  // Public endpoints
  bookAppointment: async (appointment: {
    userName: string;
    phone: string;
    appointmentDate: string;
    description: string;
    doctorId: number;
  }) => {
    const response = await fetch(`${API_URL}/user/book-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
    return response.json();
  },
}; 