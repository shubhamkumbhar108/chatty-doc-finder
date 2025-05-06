
import React from 'react';
import { Doctor, ConsultationMode } from '../types/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Phone, MessageSquare } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  const { name, photoUrl, specialization, experience, supportedModes } = doctor;
  
  const renderModeIcons = () => {
    return (
      <div className="flex space-x-2">
        {supportedModes.includes(ConsultationMode.VIDEO) && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Video size={12} />
            <span className="text-xs">Video</span>
          </Badge>
        )}
        {supportedModes.includes(ConsultationMode.AUDIO) && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Phone size={12} />
            <span className="text-xs">Audio</span>
          </Badge>
        )}
        {supportedModes.includes(ConsultationMode.CHAT) && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageSquare size={12} />
            <span className="text-xs">Chat</span>
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <div className="relative pb-[60%]">
        <img 
          src={photoUrl} 
          alt={name} 
          className="absolute w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600">{specialization}</p>
        <p className="text-sm text-gray-500">{experience} years of experience</p>
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        {renderModeIcons()}
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
