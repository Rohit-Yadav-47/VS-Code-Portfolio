import React from 'react';
import { X, FileCode } from 'lucide-react';

interface FileData {
  name: string;
  content: string;
  language: string;
  path: string;
}

interface EditorTabsProps {
  activeTabs: string[];
  activeFile: string;
  setActiveFile: (file: string) => void;
  closeTab: (tab: string, e: React.MouseEvent) => void;
  files: FileData[];
}

const EditorTabs: React.FC<EditorTabsProps> = ({ 
  activeTabs, 
  activeFile, 
  setActiveFile, 
  closeTab,
  files
}) => {
  // Function to get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop() || '';
    
    switch(extension.toLowerCase()) {
      case 'js':
        return <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>;
      case 'html':
        return <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>;
      case 'css':
        return <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>;
      case 'ts':
        return <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>;
      case 'json':
        return <div className="w-3 h-3 bg-yellow-300 rounded-sm"></div>;
      case 'md':
        return <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>;
    }
  };

  return (
    <div className="bg-[#252526] flex overflow-x-auto custom-scrollbar hide-scrollbar">
      {activeTabs.map(tab => (
        <div 
          key={tab}
          className={`
            flex items-center space-x-2 py-2 pl-3 pr-2 min-w-max border-r border-[#3c3c3c]
            cursor-pointer transition-colors group
            ${activeFile === tab 
              ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' 
              : 'text-gray-400 hover:text-gray-200'}
          `}
          onClick={() => setActiveFile(tab)}
        >
          <div className="flex items-center gap-2">
            {getFileIcon(tab)}
            <span className="text-sm">{tab}</span>
          </div>
          <button
            className="ml-2 p-0.5 rounded-sm hover:bg-[#3c3c3c] opacity-50 group-hover:opacity-100 hover:opacity-100 transition-opacity"
            onClick={(e) => closeTab(tab, e)}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
