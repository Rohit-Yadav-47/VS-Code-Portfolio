import React from 'react';
import { Search, ChevronDown, ChevronRight, FileCode, Code, GraduationCap, Trophy, BookOpen, MoreHorizontal, PlusCircle, FolderOpen, Folder, Briefcase, User } from 'lucide-react';

interface ExplorerProps {
  expandedItems: string[];
  toggleExpand: (item: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  addTab: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Explorer: React.FC<ExplorerProps> = ({
  expandedItems,
  toggleExpand,
  activeSection,
  setActiveSection,
  addTab,
  searchQuery,
  setSearchQuery
}) => {
  // Set initial state to expanded
  const initialExpanded = ['OPEN_EDITORS', 'ROHIT YADAV', 'SRC'];

  const fileItems = [
    { name: 'about.js', icon: User },
    { name: 'experience.js', icon: Briefcase },
    { name: 'projects.js', icon: Code },
    { name: 'education.js', icon: GraduationCap },
    { name: 'achievements.js', icon: Trophy },
    { name: 'research.js', icon: BookOpen }
  ];

  return (
    <div className="fixed left-12 top-8 bottom-6 w-60 bg-[#252526] flex flex-col z-10 shadow-lg md:block hidden border-r border-[#3c3c3c]">
      {/* Search Bar */}
      <div className="p-2.5 border-b border-[#3c3c3c]">
        <div className="flex items-center bg-[#3c3c3c] rounded px-2 py-1 hover:bg-[#4c4c4c] transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Explorer Header */}
      <div className="p-2.5 flex justify-between items-center border-b border-[#3c3c3c]">
        <span className="text-sm uppercase font-semibold text-gray-300">Explorer</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-[#3c3c3c] rounded transition-colors">
            <MoreHorizontal className="w-3 h-3 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-[#3c3c3c] rounded transition-colors">
            <PlusCircle className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Explorer Content with more padding */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2.5">
          {/* Open Editors Section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors"
            onClick={() => toggleExpand('OPEN_EDITORS')}
          >
            {expandedItems.includes('OPEN_EDITORS') ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-gray-300 text-xs font-medium">OPEN EDITORS</span>
          </div>
          
          {expandedItems.includes('OPEN_EDITORS') && (
            <div className="ml-4 space-y-1 mt-1">
              {fileItems.filter(item => activeSection === item.name.split('.')[0]).map(({ name, icon: Icon }) => (
                <div 
                  key={name}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors bg-[#37373d] border-l-2 border-blue-500"
                  onClick={() => {
                    setActiveSection(name.split('.')[0]);
                    addTab(name);
                  }}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Project files section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors mt-2"
            onClick={() => toggleExpand('ROHIT YADAV')}
          >
            {expandedItems.includes('ROHIT YADAV') ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span className="hover:text-blue-300 transition-colors font-medium">PORTFOLIO</span>
          </div>
          
          {expandedItems.includes('ROHIT YADAV') && (
            <div className="ml-4 space-y-1 mt-1">
              {/* Nested folder structure */}
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors"
                onClick={() => toggleExpand('SRC')}
              >
                {expandedItems.includes('SRC') ? (
                  <>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                    <FolderOpen className="w-4 h-4 text-yellow-500" />
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Folder className="w-4 h-4 text-yellow-500" />
                  </>
                )}
                <span className="text-sm">src</span>
              </div>
              
              {expandedItems.includes('SRC') && (
                <div className="ml-4 space-y-1 mt-1">
                  {fileItems.map(({ name, icon: Icon }) => (
                    <div 
                      key={name}
                      className={`flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors ${
                        activeSection === name.split('.')[0] ? 'bg-[#37373d] border-l-2 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        setActiveSection(name.split('.')[0]);
                        addTab(name);
                      }}
                    >
                      <Icon className={`w-4 h-4 ${activeSection === name.split('.')[0] ? 'text-blue-400' : 'text-gray-500'}`} />
                      <span className="text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Config files */}
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors">
                <FileCode className="w-4 h-4 text-gray-500" />
                <span className="text-sm">package.json</span>
              </div>
              
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors">
                <FileCode className="w-4 h-4 text-gray-500" />
                <span className="text-sm">tsconfig.json</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
