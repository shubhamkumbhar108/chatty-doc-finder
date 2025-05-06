
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ChatMessage, ChatContext as ChatContextType, MessageSender, PatientProspect, Doctor, AvailabilitySlot, Location } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

// Initial welcome message
const initialMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    text: "Hi there! I'm your virtual healthcare assistant. How can I help you today?",
    sender: MessageSender.BOT,
    timestamp: new Date(),
    options: [
      { id: uuidv4(), text: "Find a doctor", action: "FIND_DOCTOR" },
      { id: uuidv4(), text: "View my consultations", action: "VIEW_CONSULTATIONS" },
      { id: uuidv4(), text: "Get my prescriptions", action: "GET_PRESCRIPTIONS" }
    ]
  }
];

// Initial chat context
const initialChatContext: ChatContextType = {
  currentStep: 'INITIAL',
};

interface ChatProviderProps {
  children: ReactNode;
}

interface ChatContextValue {
  messages: ChatMessage[];
  chatContext: ChatContextType;
  addMessage: (text: string, sender: MessageSender, options?: any[]) => void;
  updateChatContext: (updates: Partial<ChatContextType>) => void;
  resetChat: () => void;
  requestUserLocation: () => Promise<Location | null>;
}

const ChatContextProvider = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatContext, setChatContext] = useState<ChatContextType>(initialChatContext);

  const addMessage = useCallback((text: string, sender: MessageSender, options?: any[]) => {
    setMessages(prevMessages => [...prevMessages, {
      id: uuidv4(),
      text,
      sender,
      timestamp: new Date(),
      options
    }]);
  }, []);

  const updateChatContext = useCallback((updates: Partial<ChatContextType>) => {
    setChatContext(prevContext => ({ ...prevContext, ...updates }));
  }, []);

  const resetChat = useCallback(() => {
    setMessages(initialMessages);
    setChatContext(initialChatContext);
  }, []);

  const requestUserLocation = useCallback((): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location' // We would normally use a geocoding service to get the address
          };
          resolve(location);
        },
        () => {
          console.log('Unable to retrieve your location');
          resolve(null);
        }
      );
    });
  }, []);

  return (
    <ChatContextProvider.Provider value={{
      messages,
      chatContext,
      addMessage,
      updateChatContext,
      resetChat,
      requestUserLocation
    }}>
      {children}
    </ChatContextProvider.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContextProvider);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
