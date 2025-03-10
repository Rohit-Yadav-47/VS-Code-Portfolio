import React, { useState } from 'react';
import { Briefcase, Clock, ArrowRight, Check, X, Plus, Monitor, Code } from 'lucide-react';
import { Experience } from '../../types';
import { motion } from 'framer-motion';

interface ExperienceSectionProps {
  data: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeExperience = data[activeIndex];

  return (
    <section className="py-16 w-full">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-blue-950/30 rounded-full text-blue-300 mb-4">
          <Briefcase className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Experience</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Work Experience</h2>
        <p className="text-gray-400 max-w-2xl">
          A showcase of my professional journey and contributions in the tech industry.
        </p>
      </div>

      {/* Experience Selector */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-[#151515] rounded-xl overflow-hidden border border-gray-800">
            {data.map((exp, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-4 border-b border-gray-800 last:border-b-0 transition-all duration-200 ${
                  activeIndex === index 
                    ? 'bg-blue-900/20 text-white' 
                    : 'hover:bg-[#1a1a1a] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{exp.title}</h3>
                  {activeIndex === index && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{exp.company}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {exp.period}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Experience Details */}
        <div className="lg:w-2/3">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#111] to-[#181818] border border-gray-800 rounded-xl p-6 shadow-xl"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  {activeExperience.type === 'development' ? 
                    <Code className="w-6 h-6 text-blue-400" /> : 
                    <Monitor className="w-6 h-6 text-blue-400" />
                  }
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{activeExperience.title}</h3>
                  <p className="text-blue-400 font-medium">{activeExperience.company}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {activeExperience.period}
                    {activeExperience.isActive && (
                      <span className="ml-2 inline-flex items-center bg-green-900/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                        Present
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {activeExperience.location && (
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                  {activeExperience.location}
                </div>
              )}
            </div>
            
            {/* Skills */}
            {activeExperience.skills && (
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {activeExperience.skills.map((skill, i) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <div key={i} className="px-3 py-1 bg-blue-900/10 border border-blue-900/30 rounded-md text-sm text-blue-300">
                        {skillName}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Achievements */}
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Key Responsibilities & Achievements</h4>
              <div className="space-y-3">
                {activeExperience.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.1 }}
                    className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="text-gray-300">{point}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            {activeExperience.url && (
              <div className="mt-8 pt-4 border-t border-gray-800">
                <a
                  href={activeExperience.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Navigation Dots (Mobile) */}
      <div className="lg:hidden flex justify-center mt-6 gap-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              activeIndex === index ? 'bg-blue-500' : 'bg-gray-700'
            }`}
            aria-label={`View experience ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
