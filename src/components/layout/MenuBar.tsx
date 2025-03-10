import React, { useState } from 'react';
import { ChevronDown, MessageCircleX, CircleDot, Circle, Maximize2, Minimize2 } from 'lucide-react';

interface MenuBarProps {
  activeFile?: string;
  isModified?: boolean;
  onClose?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  isModified = false,
  onClose
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Main menu items with potential dropdown submenus
  const menuItems = [
    { 
      name: 'File', 
      subItems: ['New File', 'Open File...', 'Save', 'Save As...', 'Auto Save', '---', 'Preferences', 'Exit'] 
    },
    { 
      name: 'Edit', 
      subItems: ['Undo', 'Redo', '---', 'Cut', 'Copy', 'Paste', '---', 'Find', 'Replace'] 
    },
    { 
      name: 'Selection', 
      subItems: ['Select All', 'Expand Selection', 'Shrink Selection', '---', 'Add Cursor Above', 'Add Cursor Below'] 
    },
    { 
      name: 'View', 
      subItems: ['Command Palette...', 'Open View', '---', 'Appearance', 'Editor Layout', '---', 'Explorer', 'Problems', 'Terminal'] 
    },
    { 
      name: 'Go', 
      subItems: ['Back', 'Forward', '---', 'Go to File...', 'Go to Symbol...', 'Go to Line/Column...'] 
    },
    { 
      name: 'Run', 
      subItems: ['Start Debugging', 'Run Without Debugging', 'Stop Debugging', '---', 'Add Configuration...'] 
    },
    { 
      name: 'Terminal', 
      subItems: ['New Terminal', 'Split Terminal', '---', 'Run Task...', 'Configure Tasks...'] 
    },
    { 
      name: 'Help', 
      subItems: ['Welcome', 'Documentation', 'GitHub Repository', '---', 'About'] 
    }
  ];

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };
  
  const handleMenuItemClick = (item: string) => {
    // Handle menu item click action
    console.log(`Clicked on ${item}`);
    // Close menu after clicking
    setActiveMenu(null);
  };
  
  return (
    <div className="bg-[#252526] text-gray-300 h-8 flex items-center justify-between pr-2 shadow-md relative z-30 border-b border-[#1e1e1e]">
      {/* System Menu/App Icon */}
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center hover:bg-[#2a2a2b]">
          <span className="text-blue-500 font-semibold text-xl">⚡</span>
        </div>
        
        {/* Main Menu */}
        <div className="flex items-center h-full">
          {menuItems.map((item) => (
            <div key={item.name} className="relative h-full">
              <div 
                className={`px-3 h-full flex items-center cursor-pointer ${
                  activeMenu === item.name ? 'bg-[#37373d]' : 'hover:bg-[#2a2a2b]'
                }`}
                onClick={() => toggleMenu(item.name)}
              >
                {item.name}
              </div>
              
              {/* Dropdown submenu */}
              {activeMenu === item.name && (
                <div className="absolute top-full left-0 w-56 bg-[#252526] shadow-lg rounded-lg border border-[#3c3c3c] z-40 py-1">
                  {item.subItems.map((subItem, index) => (
                    subItem === '---' ? (
                      <div key={`${subItem}-${index}`} className="h-px bg-[#3c3c3c] my-1 mx-2" />
                    ) : (
                      <div 
                        key={`${subItem}-${index}`}
                        className="px-3 py-1 hover:bg-[#2a2a2b]  cursor-pointer flex items-center justify-between"
                        onClick={() => handleMenuItemClick(subItem)}
                      >
                        <span>{subItem}</span>
                        {/* Add keyboard shortcuts if needed */}
                        {subItem === 'Save' && <span className="text-xs text-gray-500">Ctrl+S</span>}
                        {subItem === 'Find' && <span className="text-xs text-gray-500">Ctrl+F</span>}
                        {subItem === 'Undo' && <span className="text-xs text-gray-500">Ctrl+Z</span>}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Fullscreen button */}
      <div className="flex items-center">
        <button
          onClick={toggleFullScreen}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#2a2a2b] text-gray-400"
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Backdrop for closing menus when clicking outside */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default MenuBar;