export interface Doctor {
  id: number;
  name: string;
  degree: string;
  fees: number;
}

export interface Appointment {
  id: number;
  userName: string;
  phone: string;
  appointmentDate: string;
  description?: string;
  doctor: Doctor;
}

export interface User {
  username: string;
  token: string;
} 