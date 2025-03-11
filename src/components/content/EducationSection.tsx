import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen, MapPin, ExternalLink } from 'lucide-react';
import { Education } from '../../types';
import { motion } from 'framer-motion';

interface EducationSectionProps {
  data: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-12 w-full"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-3xl font-bold text-white mb-8 flex items-center"
      >
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-3 rounded-xl shadow-xl mr-4 transform rotate-3">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
          Academic Journey
        </span>
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {data.map((edu, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="flex flex-col h-full"
          >
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(126, 34, 206, 0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col hover:border-purple-500/50"
            >
              {/* Top colorful bar with year tag */}
              <div className="relative">
                <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 w-full" />
                <div className="absolute right-4 top-0 transform translate-y-1/2 bg-gray-900 text-xs font-bold text-indigo-300 py-1 px-3 rounded-full border border-gray-700 shadow-md">
                  {edu.period.split('-')[0]}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    {edu.institution}
                  </h3>
                  <div className="flex items-center justify-center bg-gray-800 p-2 rounded-lg border border-gray-700">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                
                <div className="space-y-3 flex-grow">
                  <p className="text-gray-200 font-semibold flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
                    <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                      {edu.degree}
                    </span>
                  </p>
                  
                  <p className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                    <span>{edu.period}</span>
                  </p>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                    <p className="text-gray-400">
                      {edu.location || 'Campus Location'}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                    <div className="bg-gray-800 py-1 px-3 rounded-full text-sm font-medium border border-gray-700">
                      {edu.score}
                    </div>
                  </div>
                  
                  {edu.achievements && (
                    <div className="pt-3 border-t border-gray-700 mt-4">
                      <h4 className="text-gray-300 font-semibold mb-2">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.achievements.map((achievement, i) => (
                          <span key={i} className="bg-indigo-900/30 text-indigo-300 text-xs py-1 px-2 rounded-md border border-indigo-800/50">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Learn more</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EducationSection;
