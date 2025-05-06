
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useChatActions } from '../hooks/useChatActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSender } from '../types/types';
import { Send } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { messages } = useChat();
  const { processUserInput, handleOptionClick } = useChatActions();
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      processUserInput(userInput);
      setUserInput('');
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.sender === MessageSender.USER 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{message.text}</div>
                
                {message.options && message.options.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.options.map(option => (
                      <Button
                        key={option.id}
                        variant={message.sender === MessageSender.USER ? "secondary" : "outline"}
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={() => handleOptionClick(option.action, option.data)}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex items-center">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow mr-2"
        />
        <Button type="submit" size="icon" disabled={!userInput.trim()}>
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
