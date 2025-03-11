import React from 'react';
import { ChevronRight, FileCode } from 'lucide-react';

interface BreadcrumbsProps {
  activeSection: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeSection }) => {
  return (
    <div className="bg-[#1e1e1e] px-4 py-1.5 z-10 flex items-center gap-1 text-xs text-gray-400">
      <div className="flex items-center hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">
        <FileCode className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
        <span className="text-gray-300">portfolio</span>
      </div>
      <ChevronRight className="w-3 h-3 text-gray-500" />
      <span className="text-gray-300 hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">src</span>
      <ChevronRight className="w-3 h-3 text-gray-500" />
      <span className="text-blue-400 hover:bg-[#2a2a2a] px-1 py-0.5 rounded cursor-pointer">{activeSection}.js</span>
    </div>
  );
};

export default Breadcrumbs;
