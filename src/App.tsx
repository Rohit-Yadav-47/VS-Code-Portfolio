import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon,
  ChevronRight,
  Monitor
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
import Minimap from './components/ui/Copilot';

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

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
        className="md:hidden fixed left-4 top-10 z-40 bg-[#2d2d2d] p-2 rounded-full shadow-lg hover:bg-[#3d3d3d] transition-colors"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <MenuIcon className="w-5 h-5 text-blue-400" />
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-[#252526] w-3/4 h-full p-4 overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-blue-400 mb-4 border-b border-[#3c3c3c] pb-2">Sections</h3>
            <div className="space-y-2">
              {['about', 'experience', 'projects', 'education', 'achievements', 'research'].map(section => (
                <button
                  key={section}
                  className={`flex items-center w-full p-2 rounded ${
                    activeSection === section 
                      ? 'bg-[#37373d] text-white shadow-md' 
                      : 'hover:bg-[#37373d] text-gray-300'
                  } transition-all duration-200`}
                  onClick={() => {
                    setActiveSection(section);
                    if (section !== 'about') {
                      addTab(`${section}.js`);
                    }
                  }}
                >
                  <span className="capitalize font-medium">{section}</span>
                </button>
              ))}
            </div>
            
            {/* Desktop mode suggestion */}
            <div className="mt-6 p-3 bg-[#2d2d30] rounded-md border border-[#3c3c3c] text-sm">
              <div className="flex items-center text-blue-400 mb-2">
                <Monitor size={16} className="mr-2" />
                <span className="font-medium">Pro Tip:</span>
              </div>
              <p>Use desktop mode to access all features including terminal, copilot, and code explorer.</p>
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
          </div>

          {/* Minimap overlay - only show on desktop */}
          {showMinimap && !isMobile && (
            <Minimap />
          )}
        </div>

        {/* Terminal Section - only show on desktop */}
        {!isMobile && (
          <TerminalSection />
        )}
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