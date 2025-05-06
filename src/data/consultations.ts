
import { Consultation } from '../types/types';

export const consultations: Consultation[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientPhone: '555-123-4567',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    consultationDate: new Date('2023-04-15T09:00:00'),
    consultationMode: 'video',
    symptoms: 'Headache and dizziness',
    status: 'completed',
    prescription: {
      id: 'p1',
      text: 'Take Ibuprofen 400mg twice daily for 3 days. Stay hydrated and get adequate rest.',
      date: new Date('2023-04-15'),
      format: 'text'
    }
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientPhone: '555-987-6543',
    doctorId: '3',
    doctorName: 'Dr. Emily Rodriguez',
    consultationDate: new Date('2023-05-20T13:00:00'),
    consultationMode: 'audio',
    symptoms: 'Sore throat and fever',
    status: 'completed',
    prescription: {
      id: 'p2',
      text: 'Amoxicillin 500mg three times daily for 5 days. Paracetamol for fever as needed.',
      date: new Date('2023-05-20'),
      format: 'text'
    }
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    patientPhone: '555-456-7890',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    consultationDate: new Date('2023-06-10T10:00:00'),
    consultationMode: 'chat',
    symptoms: 'Chest pain and shortness of breath',
    status: 'completed',
    prescription: {
      id: 'p3',
      text: 'Prescribed aspirin 75mg daily. Referred for ECG and blood tests.',
      date: new Date('2023-06-10'),
      format: 'text'
    }
  }
];

// Function to get consultations by phone number
export const getConsultationsByPhone = (phoneNumber: string) => {
  return consultations.filter(consultation => 
    consultation.patientPhone === phoneNumber
  );
};

// Function to get prescriptions by phone and optionally by date
export const getPrescriptionsByPhone = (phoneNumber: string, date?: Date) => {
  const userConsultations = getConsultationsByPhone(phoneNumber);
  
  if (date) {
    return userConsultations
      .filter(consultation => {
        const consultDate = consultation.consultationDate;
        return consultDate.getFullYear() === date.getFullYear() &&
               consultDate.getMonth() === date.getMonth() &&
               consultDate.getDate() === date.getDate();
      })
      .map(consultation => consultation.prescription)
      .filter(prescription => prescription !== undefined);
  }
  
  return userConsultations
    .map(consultation => consultation.prescription)
    .filter(prescription => prescription !== undefined);
};
