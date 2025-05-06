
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import { ChatProvider } from '../context/ChatContext';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto flex-grow flex flex-col md:flex-row p-4 gap-4">
          <div className="w-full md:w-3/4 h-[calc(100vh-8rem)]">
            <Card className="h-full overflow-hidden shadow-lg border-none">
              <CardContent className="p-0 h-full">
                <ChatInterface />
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-1/4 hidden md:block">
            <Card className="h-full p-4 shadow-lg border-none">
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <img 
                    src="https://i.imgur.com/8agEcL0.png" 
                    alt="Virtual Doctor Avatar"
                    className="w-16 h-16"
                  />
                </div>
                <h3 className="font-semibold text-lg text-primary">MediChat Assistant</h3>
                <p className="text-sm text-gray-600 mt-2">Your virtual healthcare assistant</p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-800">Find Doctors</h4>
                  <p className="text-xs text-gray-600 mt-1">Search for doctors based on your symptoms and location</p>
                </div>
                
                <div className="p-3 bg-gray-100 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-800">Book Consultations</h4>
                  <p className="text-xs text-gray-600 mt-1">Schedule appointments with doctors via video, audio, or chat</p>
                </div>
                
                <div className="p-3 bg-gray-100 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-800">Access History</h4>
                  <p className="text-xs text-gray-600 mt-1">Retrieve past consultations and prescriptions</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;
