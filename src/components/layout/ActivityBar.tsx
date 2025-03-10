import React, { useState } from 'react';
import { 
  FileCode, 
  Code, 
  GraduationCap, 
  Trophy, 
  BookOpen, 
  User, 
  Settings, 
  Search, 
  GitBranch, 
  BellRing, 
  Bug,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface ActivityBarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  errorCount?: number;
  warningCount?: number;
  username?: string;
  avatarUrl?: string;
}

type IconItem = {
  id: string;
  icon: React.FC<{ className?: string }>;
  tooltip: string;
  shortcut?: string;
  badge?: number | null;
  badgeColor?: string;
  isImplemented?: boolean;
};

const ActivityBar: React.FC<ActivityBarProps> = ({ 
  activeSection, 
  setActiveSection,
  errorCount = 0,
  warningCount = 0,
  username = 'Rohit',
  avatarUrl
}) => {
  const [notificationCount] = useState<number>(3);
  
  // Update primary icons to match Explorer
  const primaryIcons: IconItem[] = [
    {
      id: 'about',
      icon: User,
      tooltip: 'About Me',
      shortcut: 'Ctrl+1',
      isImplemented: true
    },
    { 
      id: 'experience',
      icon: Briefcase, // Changed from Code to Briefcase
      tooltip: 'Experience', 
      shortcut: 'Ctrl+2',
      isImplemented: true
    },
    { 
      id: 'projects',
      icon: Code, // Changed from GraduationCap to Code
      tooltip: 'Projects', 
      shortcut: 'Ctrl+3',
      isImplemented: true
    },
    { 
      id: 'education',
      icon: GraduationCap, // Changed from Trophy to GraduationCap
      tooltip: 'Education', 
      shortcut: 'Ctrl+4',
      isImplemented: true
    },
    { 
      id: 'achievements',
      icon: Trophy,
      tooltip: 'Achievements', 
      shortcut: 'Ctrl+5',
      isImplemented: true
    },
    { 
      id: 'research',
      icon: BookOpen,
      tooltip: 'Research', 
      shortcut: 'Ctrl+6',
      isImplemented: true
    }
  ];
  
  // Future/disabled features
  const secondaryIcons: IconItem[] = [
    { 
      id: 'search', 
      icon: Search, 
      tooltip: 'Search', 
      shortcut: 'Ctrl+Shift+F',
      isImplemented: false
    },
    { 
      id: 'sourceControl', 
      icon: GitBranch, 
      tooltip: 'Source Control', 
      badge: 2,
      badgeColor: 'bg-blue-500',
      isImplemented: false
    }
  ];

  const renderIconItem = (item: IconItem) => (
    <div key={item.id} className="relative group">
      <div 
        className={`w-12 flex items-center justify-center ${
          activeSection === item.id ? 'border-l-2 border-blue-500 bg-[#3c3c3c]' : ''
        } ${!item.isImplemented ? 'opacity-50' : ''}`}
        style={{ height: '40px' }}
      >
        <item.icon 
          className={`w-5 h-5 cursor-pointer ${
            activeSection === item.id ? 'text-white' : 'text-gray-400'
          } ${item.isImplemented ? 'hover:text-white' : ''} transition-colors duration-200`}
          onClick={() => item.isImplemented && setActiveSection(item.id)}
        />
        {item.badge && (
          <div className={`absolute top-0 right-1 ${item.badgeColor || 'bg-red-500'} text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center`}>
            {item.badge}
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-30 shadow-lg">
        <div className="font-medium">{item.tooltip}</div>
        {item.shortcut && <div className="text-gray-400 text-xs">{item.shortcut}</div>}
        {!item.isImplemented && <div className="text-gray-400 text-xs">(Coming Soon)</div>}
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 top-8 bottom-6 w-12 bg-[#252526] flex flex-col items-center py-2 z-20 shadow-md md:flex hidden border-r border-[#1e1e1e]">
      {/* Working sections */}
      <div className="flex flex-col items-center space-y-1">
        {primaryIcons.map(renderIconItem)}
      </div>
      
      {/* Separator */}
      <div className="my-4 w-8 h-px bg-gray-700"></div>
      
      {/* Future/disabled sections */}
      <div className="flex flex-col items-center space-y-1">
        {secondaryIcons.map(renderIconItem)}
      </div>
      
      {/* Push account to bottom */}
      <div className="flex-1"></div>
      
      {/* Bottom section - unchanged */}
      <div className="mt-4 relative group cursor-pointer">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={username} 
            className="w-6 h-6 rounded-full border border-gray-700 hover:border-blue-500 transition-colors duration-200"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-medium border border-gray-700 hover:border-blue-500 transition-colors duration-200">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-30 shadow-lg">
          <div className="font-medium">{username}</div>
          <div className="text-gray-400 text-xs">Change Profile</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;