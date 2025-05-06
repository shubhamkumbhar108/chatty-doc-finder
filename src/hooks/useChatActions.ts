
import { useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageSender, ConsultationMode, Doctor, AvailabilitySlot, PatientProspect } from '../types/types';
import { doctors, findNearbyDoctors } from '../data/doctors';
import { getConsultationsByPhone, getPrescriptionsByPhone } from '../data/consultations';
import { v4 as uuidv4 } from 'uuid';

export const useChatActions = () => {
  const { addMessage, updateChatContext, chatContext, requestUserLocation } = useChat();

  // Process user input based on current context
  const processUserInput = useCallback((input: string) => {
    // Add user message to chat
    addMessage(input, MessageSender.USER);

    const lowerInput = input.toLowerCase();

    switch (chatContext.currentStep) {
      case 'INITIAL':
        handleInitialInput(lowerInput);
        break;
      case 'ASK_SYMPTOMS':
        handleSymptoms(input);
        break;
      case 'CONFIRM_LOCATION':
        handleLocationConfirmation(lowerInput);
        break;
      case 'DOCTOR_SELECTION':
        handleDoctorSelection(input);
        break;
      case 'APPOINTMENT_CONFIRMATION':
        handleAppointmentConfirmation(lowerInput);
        break;
      case 'COLLECT_NAME':
        handleNameCollection(input);
        break;
      case 'COLLECT_PHONE':
        handlePhoneCollection(input);
        break;
      case 'COLLECT_CONSULTATION_MODE':
        handleConsultationModeSelection(lowerInput);
        break;
      case 'CONSULTATION_HISTORY_PHONE':
        handleConsultationHistoryPhone(input);
        break;
      case 'PRESCRIPTION_PHONE':
        handlePrescriptionPhone(input);
        break;
      case 'PRESCRIPTION_DATE':
        handlePrescriptionDate(input);
        break;
      default:
        // Default fallback for unrecognized context
        addMessage("I'm not sure how to help with that. Can you try asking something else?", MessageSender.BOT, [
          { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
          { id: uuidv4(), text: "View my consultations", action: "VIEW_CONSULTATIONS" },
          { id: uuidv4(), text: "Get my prescriptions", action: "GET_PRESCRIPTIONS" }
        ]);
        updateChatContext({ currentStep: 'INITIAL' });
    }
  }, [addMessage, chatContext, updateChatContext]);

  // Handle initial inputs to determine user intent
  const handleInitialInput = useCallback((input: string) => {
    if (input.includes('doctor') || input.includes('appointment') || input.includes('consult') || 
        input.includes('headache') || input.includes('pain') || input.includes('sick')) {
      addMessage("I can help you find a doctor. Can you tell me briefly about your symptoms?", MessageSender.BOT);
      updateChatContext({ currentStep: 'ASK_SYMPTOMS' });
    } else if (input.includes('history') || input.includes('past') || input.includes('previous') || 
               input.includes('consultations')) {
      addMessage("I can help you access your consultation history. Please provide the phone number you used for your consultations:", MessageSender.BOT);
      updateChatContext({ currentStep: 'CONSULTATION_HISTORY_PHONE' });
    } else if (input.includes('prescription') || input.includes('medicine')) {
      addMessage("I can help you retrieve your prescriptions. Please provide the phone number you used for your consultations:", MessageSender.BOT);
      updateChatContext({ currentStep: 'PRESCRIPTION_PHONE' });
    } else {
      addMessage("I can help you find a doctor, view your consultation history, or retrieve prescriptions. What would you like to do?", MessageSender.BOT, [
        { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
        { id: uuidv4(), text: "View my consultations", action: "VIEW_CONSULTATIONS" },
        { id: uuidv4(), text: "Get my prescriptions", action: "GET_PRESCRIPTIONS" }
      ]);
    }
  }, [addMessage, updateChatContext]);

  // Process button option clicks
  const handleOptionClick = useCallback((action: string, data?: any) => {
    switch (action) {
      case 'FIND_DOCTOR':
        addMessage("I can help you find a doctor. Can you tell me briefly about your symptoms?", MessageSender.BOT);
        updateChatContext({ currentStep: 'ASK_SYMPTOMS' });
        break;
      case 'VIEW_CONSULTATIONS':
        addMessage("I can help you access your consultation history. Please provide the phone number you used for your consultations:", MessageSender.BOT);
        updateChatContext({ currentStep: 'CONSULTATION_HISTORY_PHONE' });
        break;
      case 'GET_PRESCRIPTIONS':
        addMessage("I can help you retrieve your prescriptions. Please provide the phone number you used for your consultations:", MessageSender.BOT);
        updateChatContext({ currentStep: 'PRESCRIPTION_PHONE' });
        break;
      case 'SELECT_DOCTOR':
        if (data) {
          const selectedDoctor: Doctor = data;
          updateChatContext({ 
            selectedDoctor, 
            currentStep: 'DOCTOR_SELECTION' 
          });
          
          addMessage(`You've selected ${selectedDoctor.name}. Would you like to schedule an appointment with them?`, MessageSender.BOT, [
            { id: uuidv4(), text: "Yes, schedule appointment", action: "CONFIRM_APPOINTMENT" },
            { id: uuidv4(), text: "No, go back", action: "GO_BACK" }
          ]);
        }
        break;
      case 'CONFIRM_APPOINTMENT':
        addMessage("Great! I'll need some information to book your appointment. What is your full name? (You may choose 'anonymous' if preferred)", MessageSender.BOT);
        updateChatContext({ currentStep: 'COLLECT_NAME' });
        break;
      case 'SELECT_SLOT':
        if (data) {
          const selectedSlot: AvailabilitySlot = data;
          updateChatContext({ 
            selectedSlot,
            currentStep: 'APPOINTMENT_CONFIRMATION'
          });
          
          const formattedDate = selectedSlot.date.toLocaleDateString();
          addMessage(`You've selected the slot on ${formattedDate} at ${selectedSlot.time}. Would you like to confirm this appointment?`, MessageSender.BOT, [
            { id: uuidv4(), text: "Yes, confirm", action: "CONFIRM_SLOT" },
            { id: uuidv4(), text: "No, select another", action: "SELECT_ANOTHER_SLOT" }
          ]);
        }
        break;
      case 'CONFIRM_SLOT':
        completeBooking();
        break;
      case 'GO_BACK':
        handleSymptoms(chatContext.userQuery || "");
        break;
      case 'SELECT_ANOTHER_SLOT':
        if (chatContext.selectedDoctor) {
          displayDoctorSlots(chatContext.selectedDoctor);
        }
        break;
      case 'USE_LOCATION':
        handleUseLocation();
        break;
      case 'SHOW_ALL_DOCTORS':
        showAllDoctors();
        break;
      case 'SELECT_MODE':
        if (data) {
          const mode = data as ConsultationMode;
          updateChatContext({
            patientProspect: {
              ...chatContext.patientProspect!,
              preferredMode: mode
            }
          });
          
          // If we have all info, proceed to booking confirmation
          if (chatContext.selectedDoctor && chatContext.selectedSlot) {
            displaySlotConfirmation(chatContext.selectedDoctor, chatContext.selectedSlot);
          } else if (chatContext.selectedDoctor) {
            displayDoctorSlots(chatContext.selectedDoctor);
          }
        }
        break;
      case 'RESTART':
        restartChat();
        break;
      default:
        console.log("Unknown action:", action);
    }
  }, [addMessage, updateChatContext, chatContext]);

  // Handle location use request
  const handleUseLocation = useCallback(async () => {
    addMessage("Accessing your location...", MessageSender.BOT);
    
    const location = await requestUserLocation();
    
    if (location) {
      updateChatContext({ userLocation: location });
      const nearbyDoctors = findNearbyDoctors(location.latitude, location.longitude);
      
      if (nearbyDoctors.length > 0) {
        addMessage(`I found ${nearbyDoctors.length} doctors near your location. Here they are:`, MessageSender.BOT);
        displayDoctorList(nearbyDoctors);
      } else {
        addMessage("I couldn't find any doctors near your location. Here are all available doctors:", MessageSender.BOT);
        displayDoctorList(doctors);
      }
    } else {
      addMessage("I couldn't access your location. Here are all available doctors:", MessageSender.BOT);
      displayDoctorList(doctors);
    }
  }, [addMessage, requestUserLocation, updateChatContext]);

  // Show all doctors
  const showAllDoctors = useCallback(() => {
    addMessage("Here are all available doctors:", MessageSender.BOT);
    displayDoctorList(doctors);
  }, [addMessage]);

  // Handle symptoms input
  const handleSymptoms = useCallback((symptoms: string) => {
    updateChatContext({ userQuery: symptoms });
    addMessage("Thank you for providing your symptoms. Would you like me to use your current location to find doctors near you?", MessageSender.BOT, [
      { id: uuidv4(), text: "Yes, use my location", action: "USE_LOCATION" },
      { id: uuidv4(), text: "No, show all doctors", action: "SHOW_ALL_DOCTORS" }
    ]);
    updateChatContext({ currentStep: 'CONFIRM_LOCATION' });
  }, [addMessage, updateChatContext]);

  // Handle location confirmation
  const handleLocationConfirmation = useCallback(async (input: string) => {
    if (input.includes('yes') || input.includes('sure') || input.includes('okay')) {
      handleUseLocation();
    } else {
      showAllDoctors();
    }
  }, [handleUseLocation, showAllDoctors]);

  // Display list of doctors
  const displayDoctorList = useCallback((doctorList: Doctor[]) => {
    // Create options for each doctor
    const doctorOptions = doctorList.map(doctor => ({
      id: uuidv4(),
      text: `${doctor.name} - ${doctor.specialization} (${doctor.experience} yrs)`,
      action: "SELECT_DOCTOR",
      data: doctor
    }));
    
    addMessage("Please select a doctor from the list:", MessageSender.BOT, doctorOptions);
  }, [addMessage]);

  // Handle doctor selection
  const handleDoctorSelection = useCallback((input: string) => {
    // This is handled through option clicks now,
    // but we'll add a fallback text-based selection in a real app
    if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('schedule')) {
      addMessage("Great! I'll need some information to book your appointment. What is your full name? (You may choose 'anonymous' if preferred)", MessageSender.BOT);
      updateChatContext({ currentStep: 'COLLECT_NAME' });
    } else {
      handleSymptoms(chatContext.userQuery || "");
    }
  }, [addMessage, updateChatContext, handleSymptoms, chatContext.userQuery]);

  // Display available slots for a doctor
  const displayDoctorSlots = useCallback((doctor: Doctor) => {
    const slotOptions = doctor.availableSlots.map(slot => ({
      id: uuidv4(),
      text: `${slot.date.toLocaleDateString()} at ${slot.time}`,
      action: "SELECT_SLOT",
      data: slot
    }));
    
    addMessage(`Here are the available slots for ${doctor.name}:`, MessageSender.BOT, slotOptions);
  }, [addMessage]);

  // Handle appointment confirmation
  const handleAppointmentConfirmation = useCallback((input: string) => {
    if (input.includes('yes') || input.includes('confirm')) {
      completeBooking();
    } else {
      if (chatContext.selectedDoctor) {
        displayDoctorSlots(chatContext.selectedDoctor);
      }
    }
  }, [chatContext.selectedDoctor]);

  // Handle name collection
  const handleNameCollection = useCallback((name: string) => {
    updateChatContext({
      patientProspect: {
        name: name === 'anonymous' ? 'Anonymous Patient' : name,
        phoneNumber: '',
        preferredMode: ConsultationMode.VIDEO
      },
      currentStep: 'COLLECT_PHONE'
    });
    
    addMessage("Thank you. Please provide your phone number:", MessageSender.BOT);
  }, [addMessage, updateChatContext]);

  // Handle phone collection
  const handlePhoneCollection = useCallback((phone: string) => {
    // Simple validation - in a real app, we would do proper phone validation
    if (phone.length < 10) {
      addMessage("Please provide a valid phone number with at least 10 digits.", MessageSender.BOT);
      return;
    }
    
    updateChatContext({
      patientProspect: {
        ...chatContext.patientProspect!,
        phoneNumber: phone
      },
      currentStep: 'COLLECT_CONSULTATION_MODE'
    });
    
    if (chatContext.selectedDoctor) {
      const modeOptions = chatContext.selectedDoctor.supportedModes.map(mode => ({
        id: uuidv4(),
        text: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Call`,
        action: "SELECT_MODE",
        data: mode
      }));
      
      addMessage("Thank you. Please select your preferred consultation mode:", MessageSender.BOT, modeOptions);
    }
  }, [addMessage, updateChatContext, chatContext.patientProspect, chatContext.selectedDoctor]);

  // Handle consultation mode selection
  const handleConsultationModeSelection = useCallback((input: string) => {
    let mode: ConsultationMode;
    
    if (input.includes('video')) {
      mode = ConsultationMode.VIDEO;
    } else if (input.includes('audio')) {
      mode = ConsultationMode.AUDIO;
    } else {
      mode = ConsultationMode.CHAT;
    }
    
    updateChatContext({
      patientProspect: {
        ...chatContext.patientProspect!,
        preferredMode: mode
      }
    });
    
    if (chatContext.selectedDoctor) {
      displayDoctorSlots(chatContext.selectedDoctor);
    }
  }, [addMessage, updateChatContext, chatContext.patientProspect, chatContext.selectedDoctor, displayDoctorSlots]);

  // Display slot confirmation
  const displaySlotConfirmation = useCallback((doctor: Doctor, slot: AvailabilitySlot) => {
    const formattedDate = slot.date.toLocaleDateString();
    addMessage(`You've selected ${doctor.name} on ${formattedDate} at ${slot.time}. Would you like to confirm this appointment?`, MessageSender.BOT, [
      { id: uuidv4(), text: "Yes, confirm", action: "CONFIRM_SLOT" },
      { id: uuidv4(), text: "No, select another", action: "SELECT_ANOTHER_SLOT" }
    ]);
    updateChatContext({ currentStep: 'APPOINTMENT_CONFIRMATION' });
  }, [addMessage, updateChatContext]);

  // Complete the booking process
  const completeBooking = useCallback(() => {
    if (chatContext.selectedDoctor && chatContext.selectedSlot && chatContext.patientProspect) {
      const doctor = chatContext.selectedDoctor;
      const slot = chatContext.selectedSlot;
      const prospect = chatContext.patientProspect;
      
      const formattedDate = slot.date.toLocaleDateString();
      const formattedTime = slot.time;
      
      addMessage(`Appointment confirmed! Your consultation with ${doctor.name} is scheduled for ${formattedDate} at ${formattedTime} via ${prospect.preferredMode}.`, MessageSender.BOT);
      
      addMessage(`Your consultation time starts at ${formattedTime}. Please wait 5 minutes for the doctor to contact you via your selected ${prospect.preferredMode} mode.`, MessageSender.BOT, [
        { id: uuidv4(), text: "Start over", action: "RESTART" }
      ]);
      
      // In a real app, we would save this consultation to a database
      updateChatContext({ currentStep: 'INITIAL' });
    }
  }, [addMessage, updateChatContext, chatContext.selectedDoctor, chatContext.selectedSlot, chatContext.patientProspect]);

  // Handle consultation history phone input
  const handleConsultationHistoryPhone = useCallback((phone: string) => {
    const consultations = getConsultationsByPhone(phone);
    
    if (consultations.length > 0) {
      addMessage(`I found ${consultations.length} consultations for phone number ${phone}:`, MessageSender.BOT);
      
      consultations.forEach(consultation => {
        const date = consultation.consultationDate.toLocaleDateString();
        const time = consultation.consultationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        addMessage(`Date: ${date} at ${time}\nDoctor: ${consultation.doctorName}\nSymptoms: ${consultation.symptoms}\nStatus: ${consultation.status}`, MessageSender.BOT);
      });
      
      addMessage("Is there anything else I can help you with?", MessageSender.BOT, [
        { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
        { id: uuidv4(), text: "Get my prescriptions", action: "GET_PRESCRIPTIONS" },
        { id: uuidv4(), text: "Start over", action: "RESTART" }
      ]);
      
      updateChatContext({ currentStep: 'INITIAL' });
    } else {
      addMessage(`I couldn't find any consultations for phone number ${phone}. Would you like to schedule a new consultation?`, MessageSender.BOT, [
        { id: uuidv4(), text: "Yes, find a doctor", action: "FIND_DOCTOR" },
        { id: uuidv4(), text: "No, start over", action: "RESTART" }
      ]);
      
      updateChatContext({ currentStep: 'INITIAL' });
    }
  }, [addMessage, updateChatContext]);

  // Handle prescription phone input
  const handlePrescriptionPhone = useCallback((phone: string) => {
    const prescriptions = getPrescriptionsByPhone(phone);
    
    if (prescriptions.length > 0) {
      addMessage(`I found ${prescriptions.length} prescriptions for phone number ${phone}. Would you like to see all prescriptions or specify a date?`, MessageSender.BOT, [
        { id: uuidv4(), text: "Show all prescriptions", action: "SHOW_ALL_PRESCRIPTIONS" },
        { id: uuidv4(), text: "Specify a date", action: "SPECIFY_DATE" }
      ]);
      
      updateChatContext({ 
        currentStep: 'PRESCRIPTION_DATE',
        patientProspect: {
          ...chatContext.patientProspect,
          phoneNumber: phone
        } as PatientProspect
      });
    } else {
      addMessage(`I couldn't find any prescriptions for phone number ${phone}. Would you like to schedule a consultation with a doctor?`, MessageSender.BOT, [
        { id: uuidv4(), text: "Yes, find a doctor", action: "FIND_DOCTOR" },
        { id: uuidv4(), text: "No, start over", action: "RESTART" }
      ]);
      
      updateChatContext({ currentStep: 'INITIAL' });
    }
  }, [addMessage, updateChatContext, chatContext.patientProspect]);

  // Handle prescription date input
  const handlePrescriptionDate = useCallback((input: string) => {
    if (!chatContext.patientProspect?.phoneNumber) {
      addMessage("I need your phone number first to find your prescriptions.", MessageSender.BOT);
      updateChatContext({ currentStep: 'PRESCRIPTION_PHONE' });
      return;
    }
    
    const phone = chatContext.patientProspect.phoneNumber;
    
    if (input.toLowerCase() === 'all' || input.toLowerCase().includes('show all')) {
      const prescriptions = getPrescriptionsByPhone(phone);
      
      if (prescriptions.length > 0) {
        addMessage(`Here are all prescriptions for phone number ${phone}:`, MessageSender.BOT);
        
        prescriptions.forEach(prescription => {
          addMessage(`Date: ${prescription.date.toLocaleDateString()}\nPrescription: ${prescription.text}`, MessageSender.BOT);
        });
        
        addMessage("Is there anything else I can help you with?", MessageSender.BOT, [
          { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
          { id: uuidv4(), text: "View my consultations", action: "VIEW_CONSULTATIONS" },
          { id: uuidv4(), text: "Start over", action: "RESTART" }
        ]);
      }
    } else {
      try {
        const date = new Date(input);
        
        if (!isNaN(date.getTime())) {
          const prescriptions = getPrescriptionsByPhone(phone, date);
          
          if (prescriptions.length > 0) {
            addMessage(`Here are prescriptions for ${date.toLocaleDateString()}:`, MessageSender.BOT);
            
            prescriptions.forEach(prescription => {
              addMessage(`Prescription: ${prescription.text}`, MessageSender.BOT);
            });
          } else {
            addMessage(`No prescriptions found for ${date.toLocaleDateString()}.`, MessageSender.BOT);
          }
          
          addMessage("Is there anything else I can help you with?", MessageSender.BOT, [
            { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
            { id: uuidv4(), text: "View all prescriptions", action: "GET_PRESCRIPTIONS" },
            { id: uuidv4(), text: "Start over", action: "RESTART" }
          ]);
        } else {
          addMessage("I couldn't understand that date. Please enter a date in MM/DD/YYYY format or type 'all' to see all prescriptions.", MessageSender.BOT);
          return;
        }
      } catch (error) {
        addMessage("I couldn't understand that date. Please enter a date in MM/DD/YYYY format or type 'all' to see all prescriptions.", MessageSender.BOT);
        return;
      }
    }
    
    updateChatContext({ currentStep: 'INITIAL' });
  }, [addMessage, updateChatContext, chatContext.patientProspect]);

  // Restart chat
  const restartChat = useCallback(() => {
    updateChatContext({ currentStep: 'INITIAL' });
    addMessage("How can I help you today?", MessageSender.BOT, [
      { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
      { id: uuidv4(), text: "View my consultations", action: "VIEW_CONSULTATIONS" },
      { id: uuidv4(), text: "Get my prescriptions", action: "GET_PRESCRIPTIONS" }
    ]);
  }, [addMessage, updateChatContext]);

  return {
    processUserInput,
    handleOptionClick,
    restartChat
  };
};
