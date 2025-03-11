import React, { useState, useEffect } from 'react';
import { GitBranch, GitFork, Bell, AlertCircle, CheckCircle2, Wifi, XCircle, Clock, Info, MoreHorizontal, X } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isExtraSmallScreen, setIsExtraSmallScreen] = useState(false);
  
  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsExtraSmallScreen(width < 480); // Hide completely under 480px
      if (width >= 768) {
        setShowMobileMenu(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Don't render anything on extra small screens
  if (isExtraSmallScreen) {
    return null;
  }
  
  const mobileMenuItems = (
    <div className={`${showMobileMenu ? 'flex' : 'hidden'} flex-col absolute bottom-6 left-0 right-0 bg-[#252526] border-t border-[#3c3c3c] shadow-lg`}>
      <div className="flex justify-between items-center p-2 bg-[#1e1e1e]">
        <span className="text-white font-semibold">Status Bar</span>
        <button onClick={() => setShowMobileMenu(false)} className="p-1">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center space-x-2 p-2">
          <GitBranch className="w-4 h-4" />
          <span>{gitBranch}</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <GitFork className="w-4 h-4" />
          <span>0 ↓ 0 ↑</span>
        </div>
      </div>
      
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="flex items-center space-x-2 p-2">
          {errorCount > 0 ? (
            <XCircle className="w-4 h-4 text-red-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-300" />
          )}
          <span>Errors: {errorCount}</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <AlertCircle className="w-4 h-4 text-yellow-300" />
          <span>Warnings: {warningCount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-2">
        <div className="flex items-center space-x-2 p-2">
          <Wifi className="w-4 h-4" />
          <span>Live</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <span>JavaScript React</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <span>LF</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <span>UTF-8</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <span>Spaces: 2</span>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <span>Ln 42, Col 18</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {mobileMenuItems}
      <div className="fixed bottom-0  left-0 right-0 h-6 bg-[#007acc] flex items-center justify-between px-1 md:px-2 text-white text-xs md:text-sm z-50 shadow-lg select-none">
        <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
          {/* Mobile menu toggle */}
          {isMobile && (
            <div 
              className="flex items-center  px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </div>
          )}
          
          {/* Git info - always shown */}
          <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors whitespace-nowrap">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{gitBranch}</span>
          </div>
          
          {/* Git stats - hidden on smaller screens */}
          <div className="hidden sm:flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors whitespace-nowrap">
            <GitFork className="w-3.5 h-3.5" />
            <span>0 ↓ 0 ↑</span>
          </div>
          
          {/* Error/warning indicators - compact on mobile */}
          <div className="flex items-center space-x-1 px-2 hover:bg-[#1f8ad2] cursor-pointer transition-colors whitespace-nowrap">
            {errorCount > 0 ? (
              <XCircle className="w-3.5 h-3.5 text-red-300" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
            )}
            <span className="inline xs:inline">{errorCount}</span>
            <AlertCircle className="w-3.5 h-3.5 text-yellow-300 ml-1" />
            <span className="inline xs:inline">{warningCount}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
          {/* Server status - always visible */}
          <div className="flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-xs">Live</span>
          </div>
          
          {/* File type - hidden on very small screens */}
          <div className="hidden sm:flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <span>JS React</span>
          </div>
          
          {/* Line endings - hidden on smaller screens */}
          <div className="hidden md:flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <span>LF</span>
          </div>
          
          {/* Encoding - hidden on smaller screens */}
          <div className="hidden md:flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <span>UTF-8</span>
          </div>
          
          {/* Indentation - hidden on smaller screens */}
          <div className="hidden lg:flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <span>Spaces: 2</span>
          </div>
          
          {/* Position - made adaptive */}
          <div className="hidden xs:flex items-center space-x-1 px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <span className="text-xs md:text-sm">Ln 42, Col 18</span>
          </div>
          
          {/* Notifications - always visible */}
          <div className="flex items-center px-1 md:px-2 hover:bg-[#1f8ad2] cursor-pointer whitespace-nowrap">
            <Bell className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusBar;
