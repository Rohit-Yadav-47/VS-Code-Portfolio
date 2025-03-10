import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-[#252526] border-l-4 border-blue-500 shadow-lg rounded-md px-4 py-3 z-50 flex items-center gap-3 animate-slideIn">
      <Check className="w-5 h-5 text-green-400" />
      <span className="text-sm text-gray-200">{message}</span>
      <X 
        className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer ml-2" 
        onClick={handleClose}
      />
    </div>
  );
};

export default Notification;
