
import React from 'react';
import { useChatActions } from '../hooks/useChatActions';

const Header: React.FC = () => {
  const { restartChat } = useChatActions();
  
  return (
    <header className="border-b p-4 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center" onClick={restartChat}>
          <img
            src="https://i.imgur.com/8agEcL0.png" 
            alt="Virtual Doctor"
            className="w-8 h-8 mr-2"
          />
          <h1 className="text-xl font-semibold text-primary cursor-pointer">MediChat</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
