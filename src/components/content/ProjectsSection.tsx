import React, { useState } from 'react';
import { Code, ExternalLink, Star, GitFork, Share2, Info, Github, Check } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsSectionProps {
  data: Project[];
  showToast: (message: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data, showToast }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sharedProject, setSharedProject] = useState<number | null>(null);

  const handleShare = (project: Project, index: number) => {
    navigator.clipboard.writeText(`Check out ${project.title}: ${project.link || 'https://github.com/rohit-yadav'}`);
    showToast('Project link copied to clipboard!');
    setSharedProject(index);
    setTimeout(() => setSharedProject(null), 2000);
  };

  return (
    <div className="animate-fadeIn my-10 w-full">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center border-b border-gray-700 pb-2">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg mr-3">
          <Code className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Featured Projects</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {data.map((project, index) => (
          <div 
            key={index} 
            className={`group relative transition-all duration-300 ${
              hoveredIndex === index ? 'md:scale-[1.02]' : 'scale-100'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
            
            <div className="relative bg-gradient-to-br from-[#1e1e1e] to-[#252525] rounded-lg overflow-hidden shadow-xl transition-all duration-300 z-10 border border-gray-800 group-hover:border-indigo-500/50">
              <div className="relative h-52 md:h-56 overflow-hidden">
                {/* Remove the problematic overlay and fix image display */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                
                {/* Fix image loading */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out filter group-hover:saturate-[1.1] group-hover:scale-110 group-hover:rotate-1"
                  loading="lazy"
                />
                
                {/* Simplified gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#121212]/70 to-transparent z-20"></div>
                
                {/* Project overlay info */}
                <div className="absolute top-0 left-0 w-full p-3 z-30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 backdrop-blur-md bg-black/20 px-2.5 py-1.5 rounded-lg border border-gray-700/30 shadow-lg transform transition-transform group-hover:scale-105">
                      <div className="bg-gradient-to-br from-blue-600/40 to-indigo-600/40 backdrop-blur-sm p-1.5 rounded-md shadow-inner">
                        <Github className="w-4 h-4 text-blue-200" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-black/40 px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 text-amber-400 mr-1.5 drop-shadow-md" />
                          <span className="text-xs font-semibold text-amber-100/90 tracking-wide">{project.stars}</span>
                        </div>
                        <div className="flex items-center bg-black/40 px-2 py-1 rounded-md">
                          <GitFork className="w-4 h-4 text-blue-300 mr-1.5 drop-shadow-md" />
                          <span className="text-xs font-semibold text-blue-100/90 tracking-wide">{project.forks}</span>
                        </div>
                      </div>
                    </div>
                    
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative overflow-hidden group/btn flex items-center gap-1.5 bg-gradient-to-br from-indigo-700/80 to-blue-600/80 hover:from-indigo-600 hover:to-blue-500 px-3 py-1.5 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg] translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-700"></span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-100" />
                        <span className="text-xs font-medium text-blue-100">View</span>
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Title overlay with improved positioning and styling */}
                <div className="absolute bottom-0 left-0 p-4 w-full z-30">
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 drop-shadow-lg mb-1">
                    {project.title}
                  </h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-gradient-to-r from-[#2d4263] to-[#2a3b5a] text-xs rounded-full text-blue-200 transition-colors cursor-default shadow-inner"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <ul className="space-y-2 text-gray-300 mb-4">
                  {project.points.map((point, i) => (
                    <li key={i} className="leading-relaxed text-sm flex items-start group/item">
                      <span className="text-blue-400 mr-2 mt-1.5 flex-shrink-0">•</span>
                      <span className="group-hover/item:text-white transition-colors">{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-gray-700">
                  <button 
                    className={`p-2 rounded-full bg-gradient-to-r ${
                      sharedProject === index 
                        ? 'from-green-600 to-emerald-600' 
                        : 'from-[#2d2d2d] to-[#3a3a3a] hover:from-indigo-600 hover:to-blue-600'
                    } transition-all duration-300 group/btn`}
                    onClick={() => handleShare(project, index)}
                    aria-label="Share project"
                  >
                    {sharedProject === index ? (
                      <Check className="w-4 h-4 text-white animate-appear" />
                    ) : (
                      <Share2 className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                    )}
                  </button>
                  <button 
                    className="p-2 rounded-full bg-gradient-to-r from-[#2d2d2d] to-[#3a3a3a] hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 group/btn"
                    aria-label="More info"
                  >
                    <Info className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
