import React from 'react';
import { ChevronRight, FileCode, Folder } from 'lucide-react';

interface BreadcrumbsProps {
  activeSection: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeSection }) => {
  // Extract file name and path from activeSection 
  const path = activeSection.split('/');
  const fileName = path[path.length - 1];
  
  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop() || '';
    
    switch(extension.toLowerCase()) {
      case 'js':
        return <FileCode className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />;
      case 'html':
        return <FileCode className="w-3.5 h-3.5 mr-1.5 text-orange-400" />;
      case 'css':
        return <FileCode className="w-3.5 h-3.5 mr-1.5 text-blue-400" />;
      case 'ts':
        return <FileCode className="w-3.5 h-3.5 mr-1.5 text-blue-500" />;
      default:
        return <FileCode className="w-3.5 h-3.5 mr-1.5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-[#1e1e1e] px-4 py-1.5 z-10 flex items-center gap-1 text-xs text-gray-400">
      <div className="flex items-center hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">
        <Folder className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
        <span className="text-gray-300">code-editor</span>
      </div>
      <ChevronRight className="w-3 h-3 text-gray-500" />
      <span className="text-gray-300 hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">src</span>
      <ChevronRight className="w-3 h-3 text-gray-500" />
      <div className="flex items-center hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">
        {getFileIcon(fileName)}
        <span className="text-blue-400">{fileName}</span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
