import React from 'react';
import { Menu, Minus, Split, Maximize2, Square } from 'lucide-react';

interface TitleBarProps {
  title: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, isFullscreen, toggleFullscreen }) => {
  return (
    <div className="bg-[#3c3c3c] h-8 flex items-center justify-between px-2 select-none shadow-md">
      <div className="flex items-center space-x-2">
        <Menu className="w-4 h-4" />
        <span className="text-sm">Visual Studio Code - {title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Minus className="w-4 h-4 hover:bg-[#505050] p-0.5 rounded transition-colors cursor-pointer" />
        <Split className="w-4 h-4 hover:bg-[#505050] p-0.5 rounded transition-colors cursor-pointer" />
        {isFullscreen ? (
          <Maximize2 
            className="w-4 h-4 hover:bg-[#505050] p-0.5 rounded transition-colors cursor-pointer" 
            onClick={toggleFullscreen}
          />
        ) : (
          <Square
            className="w-4 h-4 hover:bg-[#505050] p-0.5 rounded transition-colors cursor-pointer"
            onClick={toggleFullscreen}
          />
        )}
      </div>
    </div>
  );
};

export default TitleBar;
