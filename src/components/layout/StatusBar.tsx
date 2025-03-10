import React from 'react';
import { GitBranch, GitFork, Bell, AlertCircle, CheckCircle2, Wifi, XCircle, Clock, Info } from 'lucide-react';

interface StatusBarProps {
  gitBranch?: string;
  errorCount?: number;
  warningCount?: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  gitBranch = 'main',
  errorCount = 0,
  warningCount = 0
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 bg-[#007acc] flex items-center justify-between px-2 text-white text-sm z-50 shadow-lg select-none">
      <div className="flex items-center space-x-2">
        {/* Git info */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors">
          <GitBranch className="w-3.5 h-3.5" />
          <span>{gitBranch}</span>
        </div>
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors">
          <GitFork className="w-3.5 h-3.5" />
          <span>0 ↓ 0 ↑</span>
        </div>
        
        {/* Error/warning indicators */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors">
          {errorCount > 0 ? (
            <XCircle className="w-3.5 h-3.5 text-red-300" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
          )}
          <span>{errorCount}</span>
          <AlertCircle className="w-3.5 h-3.5 text-yellow-300 ml-1" />
          <span>{warningCount}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Server status - simulating a VS Code feature */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-xs">Live</span>
        </div>
        
        {/* File type */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <span>JavaScript React</span>
        </div>
        
        {/* Line endings */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <span>LF</span>
        </div>
        
        {/* Encoding */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <span>UTF-8</span>
        </div>
        
        {/* Indentation */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <span>Spaces: 2</span>
        </div>
        
        {/* Position */}
        <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <span>Ln 42, Col 18</span>
        </div>
        
        {/* Notifications */}
        <div className="flex items-center px-2 hover:bg-[#1f8ad2] cursor-pointer">
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
