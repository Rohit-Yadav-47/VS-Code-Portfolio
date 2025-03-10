import React, { useState } from 'react';
import { BookOpen, ExternalLink, Download, Award, Calendar, Users } from 'lucide-react';
import { Research } from '../../types';

interface ResearchSectionProps {
  data: Research[];
}

const ResearchSection: React.FC<ResearchSectionProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="animate-fadeIn my-12 w-full">
      <h2 className="text-2xl font-semibold text-white mb-8 flex items-center border-b border-gray-700 pb-3">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg shadow-lg mr-3">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Research Publications</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {data.map((paper, index) => (
          <div 
            key={index} 
            className={`relative group transition-all duration-500 ${
              hoveredIndex === index ? 'scale-[1.02]' : 'scale-100'
            } ${expandedIndex === index ? 'lg:col-span-2' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-gray-800 p-6 rounded-xl group-hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-900/20 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full -mt-20 -mr-20 group-hover:bg-emerald-500/10 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-green-500/5 to-teal-500/5 rounded-full -mb-14 -ml-14 group-hover:bg-green-500/10 transition-all duration-500"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#1e3a30] to-[#2d4a40] p-3 rounded-lg shadow-inner inline-flex">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 leading-tight">{paper.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">{paper.publisher}</span>
                </div>
                
            
                
                <div className="flex items-center gap-1.5 bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-emerald-200">Peer Reviewed</span>
                </div>
              </div>
           
              
              <div className="mt-5 flex flex-wrap justify-between items-center gap-y-3">
                <button 
                  className="text-sm text-gray-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedIndex === index ? 'Show less' : 'Show abstract'}
                </button>
                
                <div className="flex gap-3">
                  <a 
                    href={paper.link || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-1.5 group/btn"
                  >
                    <span>Read Paper</span>
                    <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                  
         
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="w-full h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out"
                  style={{ 
                    width: hoveredIndex === index ? '100%' : '0%',
                    transitionDelay: hoveredIndex === index ? '0.2s' : '0s'
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchSection;
