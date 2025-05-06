
import { Doctor, ConsultationMode } from '../types/types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    specialization: 'Neurologist',
    experience: 10,
    availableSlots: [
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), time: '09:00 AM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), time: '11:00 AM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '02:00 PM' },
    ],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Health St, San Francisco, CA'
    },
    supportedModes: [ConsultationMode.VIDEO, ConsultationMode.AUDIO, ConsultationMode.CHAT]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    specialization: 'Cardiologist',
    experience: 15,
    availableSlots: [
      { date: new Date(new Date().setDate(new Date().getDate())), time: '04:00 PM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 3)), time: '10:00 AM' },
    ],
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: '456 Medical Ave, San Francisco, CA'
    },
    supportedModes: [ConsultationMode.VIDEO, ConsultationMode.CHAT]
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    specialization: 'General Practitioner',
    experience: 8,
    availableSlots: [
      { date: new Date(new Date().setDate(new Date().getDate())), time: '01:00 PM' },
      { date: new Date(new Date().setDate(new Date().getDate())), time: '03:00 PM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), time: '11:00 AM' },
    ],
    location: {
      latitude: 37.7855,
      longitude: -122.4001,
      address: '789 Care Blvd, San Francisco, CA'
    },
    supportedModes: [ConsultationMode.VIDEO, ConsultationMode.AUDIO, ConsultationMode.CHAT]
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    specialization: 'Dermatologist',
    experience: 12,
    availableSlots: [
      { date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '09:00 AM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '10:00 AM' },
    ],
    location: {
      latitude: 37.7879,
      longitude: -122.4074,
      address: '101 Skin Care Way, San Francisco, CA'
    },
    supportedModes: [ConsultationMode.VIDEO, ConsultationMode.CHAT]
  },
  {
    id: '5',
    name: 'Dr. Priya Patel',
    photoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    specialization: 'Psychiatrist',
    experience: 9,
    availableSlots: [
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), time: '02:00 PM' },
      { date: new Date(new Date().setDate(new Date().getDate() + 3)), time: '03:00 PM' },
    ],
    location: {
      latitude: 37.7834,
      longitude: -122.4252,
      address: '202 Mental Health Dr, San Francisco, CA'
    },
    supportedModes: [ConsultationMode.VIDEO, ConsultationMode.AUDIO]
  }
];

export const findNearbyDoctors = (latitude: number, longitude: number, radius: number = 5) => {
  // Calculate distance between two points using Haversine formula
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };
  
  return doctors.filter(doctor => {
    const distance = getDistance(
      latitude, 
      longitude, 
      doctor.location.latitude, 
      doctor.location.longitude
    );
    return distance <= radius;
  });
};
