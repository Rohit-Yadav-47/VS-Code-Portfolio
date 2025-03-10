import React from 'react';

interface EditorPillsProps {
  activePill: string;
  setActivePill: (pill: string) => void;
}

const EditorPills: React.FC<EditorPillsProps> = ({ activePill, setActivePill }) => {
  const pills = ['overview', 'details', 'timeline', 'references'];
  
  return (
    <div className="bg-[#1e1e1e] border-b border-[#3c3c3c] px-4 py-1 z-5 flex items-center gap-2 text-xs overflow-x-auto h-8">
      {pills.map(pill => (
        <button
          key={pill}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            activePill === pill 
              ? 'bg-[#37373d] text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActivePill(pill)}
        >
          {pill.charAt(0).toUpperCase() + pill.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default EditorPills;
