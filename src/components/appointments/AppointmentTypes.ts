
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

// Mock data for events
export const events: Event[] = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video",
    advisor: "Marie Lambert",
    date: "15/04/2025",
    status: "upcoming"
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone",
    advisor: "Paul Bernard",
    date: "14/04/2025",
    status: "upcoming"
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert",
    date: "12/04/2025",
    status: "cancelled"
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video",
    advisor: "Thomas Richard",
    date: "10/04/2025",
    status: "completed"
  },
  { 
    id: 5, 
    title: "Conseil investissement", 
    client: "Philippe Moreau", 
    time: "11:00 - 12:00", 
    type: "phone",
    advisor: "Paul Bernard",
    date: "08/04/2025",
    status: "rescheduled"
  },
  { 
    id: 6, 
    title: "Révision fiscale", 
    client: "Isabelle Petit", 
    time: "14:30 - 15:30", 
    type: "in-person",
    advisor: "Marie Lambert",
    date: "05/04/2025",
    status: "completed"
  },
  { 
    id: 7, 
    title: "Planification retraite", 
    client: "Robert Lefebvre", 
    time: "10:00 - 11:30", 
    type: "video",
    advisor: "Paul Bernard",
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    status: "confirmed"
  },
  { 
    id: 8, 
    title: "Consultation fiscale", 
    client: "Christine Dubois", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert",
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    status: "upcoming"
  }
];

// Calendar events - similar structure but with different format needs
export const calendarEvents: AppointmentEvent[] = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video",
    advisor: "Marie Lambert"
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone",
    advisor: "Paul Bernard"
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert"
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video",
    advisor: "Thomas Richard"
  },
  { 
    id: 7, 
    title: "Planification retraite", 
    client: "Robert Lefebvre", 
    time: "10:00 - 11:30", 
    type: "video",
    advisor: "Paul Bernard"
  },
  { 
    id: 8, 
    title: "Consultation fiscale", 
    client: "Christine Dubois", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert"
  }
];

// Historical appointments
export const appointments: HistoricalAppointment[] = [
  { 
    id: 1, 
    client: "Jean Dupont", 
    date: "15/04/2025", 
    time: "14:00 - 15:00", 
    advisor: "Marie Lambert", 
    type: "video", 
    status: "completed", 
    notes: "Discussion sur la stratégie d'investissement" 
  },
  { 
    id: 2, 
    client: "Sophie Martin", 
    date: "14/04/2025", 
    time: "10:30 - 11:15", 
    advisor: "Paul Bernard", 
    type: "phone", 
    status: "completed", 
    notes: "Point sur l'assurance vie" 
  },
  { 
    id: 3, 
    client: "Michel Lefebvre", 
    date: "12/04/2025", 
    time: "09:00 - 10:00", 
    advisor: "Marie Lambert", 
    type: "in-person", 
    status: "cancelled", 
    notes: "Client indisponible" 
  },
  { 
    id: 4, 
    client: "Christine Dubois", 
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), 
    time: "14:00 - 15:00", 
    advisor: "Marie Lambert", 
    type: "in-person", 
    status: "confirmed", 
    notes: "Rendez-vous aujourd'hui" 
  },
  { 
    id: 5, 
    client: "Robert Lefebvre", 
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }), 
    time: "10:00 - 11:30", 
    advisor: "Paul Bernard", 
    type: "video", 
    status: "upcoming", 
    notes: "Rendez-vous aujourd'hui" 
  }
];
