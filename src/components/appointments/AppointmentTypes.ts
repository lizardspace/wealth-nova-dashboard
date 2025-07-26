
export type AppointmentType = 'video' | 'phone' | 'in-person';
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled' | 'confirmed' | 'pending';

export interface Event {
  id: number;
  title: string;
  client: string;
  time: string;
  type: AppointmentType;
  advisor: string;
  date: string;
  status: AppointmentStatus;
}

export interface AppointmentEvent {
  id: number;
  title: string;
  client: string;
  time: string;
  type: AppointmentType;
  advisor: string;
}

export interface HistoricalAppointment {
  id: number;
  client: string;
  date: string;
  time: string;
  advisor: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
}

// No mock data
