import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { Education } from '../../types';

interface EducationSectionProps {
  data: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ data }) => {
  return (
    <div className="animate-fadeIn my-8 w-full">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center border-b border-gray-700 pb-2">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg mr-3">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Education & Qualifications</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {data.map((edu, index) => (
          <div 
            key={index} 
            className="group bg-gradient-to-br from-[#1e1e1e] to-[#252525] border border-[#3e3e3e] p-5 rounded-lg hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-900/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mt-16 -mr-16 group-hover:bg-purple-500/10 transition-all duration-500"></div>
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">{edu.institution}</h3>
            <p className="text-gray-300 font-semibold flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
              {edu.degree}
            </p>
            <p className="text-gray-400 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              {edu.period}
            </p>
            <div className="mt-3 flex items-center">
              <Award className="w-4 h-4 mr-2 text-yellow-500" />
              <p className="text-white font-medium">{edu.score}</p>
            </div>
            
            <div className="w-full h-1 mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
