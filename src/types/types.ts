
// Consultation mode enum
export enum ConsultationMode {
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat'
}

// Doctor availability slot
export interface AvailabilitySlot {
  date: Date;
  time: string;
}

// Location interface
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// Doctor interface
export interface Doctor {
  id: string;
  name: string;
  photoUrl: string;
  specialization: string;
  experience: number;
  availableSlots: AvailabilitySlot[];
  location: Location;
  supportedModes: ConsultationMode[];
}

// Prescription interface
export interface Prescription {
  id: string;
  text: string;
  date: Date;
  format: 'text' | 'pdf';
  fileUrl?: string; // For PDF prescriptions
}

// Consultation status
export type ConsultationStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

// Consultation interface
export interface Consultation {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  consultationDate: Date;
  consultationMode: string;
  symptoms: string;
  status: ConsultationStatus;
  prescription?: Prescription;
}

// Patient prospect
export interface PatientProspect {
  name: string;
  phoneNumber: string;
  preferredMode: ConsultationMode;
}

// Chat message types
export enum MessageSender {
  USER = 'user',
  BOT = 'bot'
}

// Chat message interface
export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  options?: ChatOption[];
}

// Chat option interface for interactive elements
export interface ChatOption {
  id: string;
  text: string;
  action: string;
  data?: any;
}

// Chat context to store conversation state
export interface ChatContext {
  currentStep: string;
  patientProspect?: PatientProspect;
  selectedDoctor?: Doctor;
  selectedSlot?: AvailabilitySlot;
  userQuery?: string;
  userLocation?: Location;
}
