// src/components/appointments/AppointmentTypes.ts

export type AppointmentType = 'consultation' | 'suivi' | 'signature' | 'prospection' | 'formation';

export type AppointmentStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  client: string;
  advisor: string;
  type: AppointmentType;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM:SS
  duration: number; // en minutes
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricalAppointment extends Event {
  // Hérite de toutes les propriétés de Event
  // Peut avoir des propriétés spécifiques à l'historique si nécessaire
}

// Types pour les opérations CRUD
export interface CreateAppointmentData {
  title: string;
  client: string;
  advisor: string;
  type: AppointmentType;
  date: string;
  time: string;
  duration: number;
  status?: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentData {
  title?: string;
  client?: string;
  advisor?: string;
  type?: AppointmentType;
  date?: string;
  time?: string;
  duration?: number;
  status?: AppointmentStatus;
  notes?: string;
}

// Types pour les filtres
export interface AppointmentFilters {
  advisor?: string;
  types?: AppointmentType[];
  status?: AppointmentStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

//