import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon,
  ChevronRight,
  Monitor,ChevronDown
  ,FileCode,FolderOpen,Folder,Search,PlusCircle,MoreHorizontal,User,Briefcase,Code,GraduationCap,Trophy,BookOpen
} from 'lucide-react';

// Component imports
import MenuBar from './components/layout/MenuBar';
import ActivityBar from './components/layout/ActivityBar';
import Explorer from './components/layout/Explorer';
import EditorTabs from './components/layout/EditorTabs';
import StatusBar from './components/layout/StatusBar';
import EditorPills from './components/layout/EditorPills';
import Breadcrumbs from './components/layout/Breadcrumbs';
import ProfileHeader from './components/content/ProfileHeader';
import ExperienceSection from './components/content/ExperienceSection';
import ProjectsSection from './components/content/ProjectsSection';
import EducationSection from './components/content/EducationSection';
import AchievementsSection from './components/content/AchievementsSection';
import ResearchSection from './components/content/ResearchSection';
import TerminalSection from './components/content/TerminalSection';
import Notification from './components/ui/Notification';
import Copilot from './components/ui/Copilot';

// Data imports
import { 
  experienceData, 
  projectsData, 
  educationData, 
  achievementsData, 
  researchData 
} from './data';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [expandedItems, setExpandedItems] = useState<string[]>(['OPEN_EDITORS', 'ROHIT YADAV', 'SRC']);
  const [activeTabs, setActiveTabs] = useState(['experience.js']);
  const [searchQuery, setSearchQuery] = useState('');
  const [animateContent, setAnimateContent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showMinimap, setShowMinimap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [activePill, setActivePill] = useState('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(2);
  const [gitBranch, setGitBranch] = useState('main');
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDesktopHint, setShowDesktopHint] = useState(true);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Show desktop hint for 5 seconds when on mobile
      if (mobile) {
        setShowDesktopHint(true);
        setTimeout(() => setShowDesktopHint(false), 5000);
      } else {
        setShowDesktopHint(false);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    setAnimateContent(true);
    const timer = setTimeout(() => setAnimateContent(false), 300);
    return () => clearTimeout(timer);
  }, [activeSection]);



  const toggleExpand = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const addTab = (fileName: string) => {
    if (!activeTabs.includes(fileName)) {
      setActiveTabs([...activeTabs, fileName]);
    }
    setActiveSection(fileName.split('.')[0]);
  };

  const closeTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = activeTabs.filter(tab => tab !== fileName);
    setActiveTabs(newTabs);
    if (newTabs.length > 0) {
      setActiveSection(newTabs[newTabs.length - 1].split('.')[0]);
    }
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a section is selected
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  return (
    <div className="h-screen bg-[#1e1e1e] text-gray-300 flex flex-col overflow-hidden">
      {/* Notification */}
      {showNotification && (
        <Notification message={notificationMessage} />
      )}
      
      {/* Desktop Mode Hint - Fixed position with animation */}
      {isMobile && showDesktopHint && (
        <div className="fixed top-12 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg text-sm max-w-[180px] flex items-center animate-fadeIn">
          <Monitor size={16} className="mr-2 flex-shrink-0" />
          <span>Switch to desktop mode for all features</span>
          <button 
            className="ml-2 text-white/80 hover:text-white"
            onClick={() => setShowDesktopHint(false)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Fixed Header Section - Scaled down for mobile */}
      <div className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? 'h-8' : ''}`}>
        <div className={isMobile ? 'transform scale-75 origin-top-left' : ''}>
          <MenuBar />
        </div>
      </div>

      {/* Mobile Menu Button - adjusted top position */}
      <button
        className="md:hidden fixed left-4 top-20 z-10 bg-[#2d2d2d] p-2 rounded-full shadow-lg hover:bg-[#3d3d3d] transition-colors"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <MenuIcon className="w-5 h-5 text-blue-400" />
      </button>

      {/* Mobile Navigation Overlay */}

      {isMobileMenuOpen && (
  <div 
    className="md:hidden fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-30 transition-opacity duration-300" 
    onClick={() => setIsMobileMenuOpen(false)}
  >
    <div 
      className="bg-[#1e1e1e] w-4/5 h-full border-r border-[#3c3c3c] p-4 overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
      style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Explorer header with search bar like desktop version */}
      <div className="flex justify-between items-center mb-4 border-b border-[#3c3c3c] pb-2">
        <h3 className="text-sm uppercase font-semibold text-gray-300">Explorer</h3>
        <div className="flex items-center gap-1">
          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#3c3c3c]">
            <PlusCircle size={14} />
          </button>
          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#3c3c3c]">
            <MoreHorizontal size={14} />
          </button>
          <button 
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#3c3c3c]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Search bar - matches desktop explorer */}
      <div className="mb-4">
        <div className="flex items-center bg-[#3c3c3c] rounded px-2 py-1 hover:bg-[#4c4c4c] transition-colors">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* OPEN EDITORS section with chevron */}
      <div 
        className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors mb-1"
        onClick={() => toggleExpand('OPEN_EDITORS')}
      >
        {expandedItems.includes('OPEN_EDITORS') ? (
          <ChevronDown size={14} className="text-gray-400" />
        ) : (
          <ChevronRight size={14} className="text-gray-400" />
        )}
        <span className="text-gray-300 text-xs font-medium">OPEN EDITORS</span>
      </div>
      
      {/* Open editors list - only show current active section */}
      {expandedItems.includes('OPEN_EDITORS') && (
        <div className="ml-4 space-y-1 mb-3">
          {['about', 'experience', 'projects', 'education', 'achievements', 'research']
            .filter(section => activeSection === section)
            .map(section => (
              <button
                key={section}
                className="flex items-center w-full px-2 py-1 rounded text-sm bg-[#37373d] border-l-2 border-blue-500"
                onClick={() => {
                  setActiveSection(section);
                  if (section !== 'about') {
                    addTab(`${section}.js`);
                  }
                }}
              >
                <div className="w-4 h-4 mr-2 flex-shrink-0">
                  <span className={`block w-3 h-3 rounded-sm ${
                    section === 'about' ? 'bg-blue-500' :
                    section === 'experience' ? 'bg-green-500' :
                    section === 'projects' ? 'bg-yellow-500' :
                    section === 'education' ? 'bg-purple-500' :
                    section === 'achievements' ? 'bg-red-500' : 'bg-cyan-500'
                  }`}></span>
                </div>
                <span className="capitalize">{section}.js</span>
              </button>
          ))}
        </div>
      )}
      
      {/* PORTFOLIO section with chevron */}
      <div className="flex items-center space-x-2 p-1 rounded transition-colors mb-1">
  <ChevronDown size={14} className="text-gray-400" />
  <span className="text-xs font-medium text-blue-300">PORTFOLIO</span>
</div>

<div className="ml-4 space-y-1 mt-1 mb-4">
  <div className="flex items-center space-x-2 p-1 rounded transition-colors">
    <ChevronDown size={14} className="text-gray-400" />
    <FolderOpen size={14} className="text-yellow-500" />
    <span className="text-sm">src</span>
  </div>

  <div className="ml-4 space-y-1 mt-1">
    {[
      { name: 'about', icon: <User size={14} className="mr-2 text-blue-500" /> },
      { name: 'experience', icon: <Briefcase size={14} className="mr-2 text-green-500" /> },
      { name: 'projects', icon: <Code size={14} className="mr-2 text-yellow-500" /> },
      { name: 'education', icon: <GraduationCap size={14} className="mr-2 text-purple-500" /> },
      { name: 'achievements', icon: <Trophy size={14} className="mr-2 text-red-500" /> },
      { name: 'research', icon: <BookOpen size={14} className="mr-2 text-cyan-500" /> },
    ].map(({ name, icon }) => (
      <button
        key={name}
        className={`flex items-center w-full px-2 py-1 rounded text-sm ${
          activeSection === name 
            ? 'bg-[#094771] text-white font-medium' 
            : 'hover:bg-[#37373d] text-gray-300'
        } transition-all duration-200`}
        onClick={() => {
          setActiveSection(name);
          if (name !== 'about') {
            addTab(`${name}.js`);
          }
        }}
      >
        {icon}
        <span className="capitalize">{name}.js</span>
      </button>
    ))}
  </div>
</div>
      
      {/* Portfolio file structure */}
      {expandedItems.includes('PORTFOLIO') && (
        <div className="ml-4 space-y-1 mt-1 mb-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors"
            onClick={() => toggleExpand('SRC')}
          >
            {expandedItems.includes('SRC') ? (
              <>
                <ChevronDown size={14} className="text-gray-400" />
                <FolderOpen size={14} className="text-yellow-500" />
                <span className="text-sm">src</span>
              </>
            ) : (
              <>
                <ChevronRight size={14} className="text-gray-400" />
                <Folder size={14} className="text-yellow-500" />
                <span className="text-sm">src</span>
              </>
            )}
          </div>
          
          {expandedItems.includes('SRC') && (
            <div className="ml-4 space-y-1 mt-1">
              {['about', 'experience', 'projects', 'education', 'achievements', 'research'].map(section => (
                <button
                  key={section}
                  className={`flex items-center w-full px-2 py-1 rounded text-sm ${
                    activeSection === section 
                      ? 'bg-[#094771] text-white font-medium' 
                      : 'hover:bg-[#37373d] text-gray-300'
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveSection(section);
                    if (section !== 'about') {
                      addTab(`${section}.js`);
                    }
                  }}
                >
                  <div className="w-4 h-4 mr-2 flex-shrink-0">
                    <span className={`block w-3 h-3 rounded-sm ${
                      section === 'about' ? 'bg-blue-500' :
                      section === 'experience' ? 'bg-green-500' :
                      section === 'projects' ? 'bg-yellow-500' :
                      section === 'education' ? 'bg-purple-500' :
                      section === 'achievements' ? 'bg-red-500' : 'bg-cyan-500'
                    }`}></span>
                  </div>
                  <span className="capitalize">{section}.js</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Config files */}
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors">
            <FileCode size={14} className="text-gray-500" />
            <span className="text-sm">package.json</span>
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors">
            <FileCode size={14} className="text-gray-500" />
            <span className="text-sm">tsconfig.json</span>
          </div>
        </div>
      )}
      
      {/* Desktop mode suggestion with VS Code notification styling */}
      <div className="mt-auto p-3 bg-[#252526] rounded border-l-2 border-blue-500 shadow-md text-sm">
        <div className="flex items-center text-blue-400 mb-1.5">
          <Monitor size={15} className="mr-2 flex-shrink-0" />
          <span className="font-medium">Pro Tip</span>
        </div>
        <p className="text-gray-300 ml-7 text-xs leading-relaxed">
          Switch to desktop mode to access all IDE features including terminal, code explorer, and GitHub Copilot integration.
        </p>
      </div>

      {/* VS Code style footer */}
      <div className="mt-4 border-t border-[#3c3c3c] py-2 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span>VS Code Portfolio - v1.0.0</span>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Content area - adjusted margins */}
      <div className={`flex flex-1 ${isMobile ? 'pt-8' : 'pt-8'} overflow-hidden`}>
        {/* Hide ActivityBar and Explorer on mobile */}
        <div className="hidden md:block">
          <ActivityBar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            errorCount={errorCount}
            warningCount={warningCount}
          />
        </div>

        <div className="hidden md:block">
          <Explorer 
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            addTab={addTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="flex-1 relative flex flex-col">
          <div className={`md:ml-72 ml-0 flex flex-1 flex-col h-full relative ${isMobile ? 'pt-2' : ''}`}>
            {/* Make tabs more compact on mobile */}
            <div className={isMobile ? 'transform scale-90 origin-top-left' : ''}>
              <EditorTabs 
                activeTabs={activeTabs}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                closeTab={closeTab}
              />
            </div>
            
            {/* Only show breadcrumbs on desktop */}
            {showBreadcrumbs && !isMobile && (
              <Breadcrumbs activeSection={activeSection} />
            )}
            
            {/* Only show editor pills on desktop */}
            {!isMobile && (
              <EditorPills 
                activePill={activePill}
                setActivePill={setActivePill}
              />
            )}

            {/* Scrollable content area with proper padding */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-0 relative">
              {/* Add VS Code-like indent guides (only on desktop) */}
              {!isMobile && (
                <div className="absolute top-0 left-12 bottom-0 w-6 flex flex-col items-center z-0 pointer-events-none">
                  <div className="h-full w-px bg-[#3c3c3c] opacity-30"></div>
                </div>
              )}
              
              {/* Main content with proper padding */}
              <div className={`px-4 py-6 relative ${!isMobile ? 'mb-64' : 'mb-10'}`}>
                <div className={`${animateContent ? 'opacity-0' : 'opacity-100'} transition-all ${isMobile ? 'pl-1 pr-1' : 'md:pl-12 md:pr-20'}`}>
                  {activeSection === 'about' && (
                    <ProfileHeader showToast={showToast} />
                  )}

                  {activeSection === 'experience' && (
                    <ExperienceSection data={experienceData} />
                  )}

                  {activeSection === 'projects' && (
                    <ProjectsSection data={projectsData} showToast={showToast} />
                  )}

                  {activeSection === 'education' && (
                    <EducationSection data={educationData} />
                  )}

                  {activeSection === 'achievements' && (
                    <AchievementsSection data={achievementsData} />
                  )}

                  {activeSection === 'research' && (
                    <ResearchSection data={researchData} />
                  )}
                </div>
              </div>
              
            </div>
                    {/* Terminal Section - only show on desktop */}
        {!isMobile && (
          <TerminalSection />
        )}
          </div>

          {/* Minimap overlay - only show on desktop */}
          {showMinimap && !isMobile && (
            <Copilot />
          )}
                  {/* Terminal Section - only show on desktop */}

        </div>


      </div>

      {/* Status Bar - adjust z-index to be above terminal and scaled for mobile */}
      <div className={isMobile ? 'transform scale-75 origin-bottom-left' : ''}>
        <StatusBar 
          gitBranch={gitBranch}
          errorCount={errorCount}
          warningCount={warningCount}
        />
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #777;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        body {
          overflow: hidden;
        }
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.06),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        /* VS Code-like indent guides */
        .indent-guide {
          position: absolute;
          left: 0;
          height: 100%;
          border-left: 1px solid rgba(60, 60, 60, 0.3);
        }
        
        /* Mobile optimization */
        @media (max-width: 767px) {
          .custom-scrollbar {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Adjust content display for mobile */
          .mobile-content {
            padding: 0.5rem !important;
          }
          
          /* Status bar mobile styling */
          .status-bar-mobile {
            height: 1.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;