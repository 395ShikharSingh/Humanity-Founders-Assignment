const API_URL = 'http://localhost:3000/hospital';

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
    const response = await fetch(`${API_URL}/staff/doctors`, {
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
}; 