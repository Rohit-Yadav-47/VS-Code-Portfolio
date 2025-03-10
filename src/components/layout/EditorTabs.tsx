import React from 'react';
import { FileCode, X, PlusCircle, FileCog, FileJson } from 'lucide-react';

interface EditorTabsProps {
  activeTabs: string[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  closeTab: (fileName: string, e: React.MouseEvent) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTabs, activeSection, setActiveSection, closeTab }) => {
  // Function to get the appropriate icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'json':
        return <FileJson className="w-4 h-4" />;
      case 'config':
      case 'yaml':
      case 'yml':
        return <FileCog className="w-4 h-4" />;
      default:
        return <FileCode className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="flex shadow-md overflow-x-auto custom-tabs bg-[#252526] select-none">
      {/* Editor tabs */}
      <div className="flex overflow-x-auto">
        {activeTabs.map(tab => {
          const isActive = activeSection === tab.split('.')[0];
          
          return (
            <div
              key={tab}
              className={`group flex items-center h-9 min-w-[120px] max-w-[160px] px-3 cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-[#1e1e1e] text-white border-t border-r border-l border-blue-500 border-opacity-50' 
                  : 'border-b border-[#3c3c3c] bg-[#2d2d2d] text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveSection(tab.split('.')[0])}
            >
              <div className="flex items-center justify-between w-full overflow-hidden">
                <div className="flex items-center min-w-0 overflow-hidden">
                  <span className={`mr-2 ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                    {getFileIcon(tab)}
                  </span>
                  <span className="text-sm truncate font-medium">{tab}</span>
                </div>
                
                <div 
                  className={`ml-2 p-0.5 rounded-sm ${
                    isActive ? 'hover:bg-[#444444]' : 'hover:bg-[#3c3c3c]'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={(e) => closeTab(tab, e)}
                >
                  <X className="w-4 h-4" />
                </div>
              </div>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* New tab button */}
      <div className="flex items-center justify-center w-9 h-9 border-b border-[#3c3c3c] hover:bg-[#2d2d2d]">
        <PlusCircle className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>
      
      {/* Remaining space for tab bar */}
      <div className="flex-grow border-b border-[#3c3c3c]"></div>
    </div>
  );
};

export default EditorTabs;
