import React, { useState } from 'react';
import { Trophy, Star, Award, Medal, ChevronRight } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsSectionProps {
  data: Achievement[];
}

const AchievementCard = ({ achievement, index }: { achievement: Achievement, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Different colors based on index for visual variety
  const getGradientClasses = () => {
    const gradients = [
      "from-orange-500 to-amber-500",
      "from-yellow-500 to-amber-500",
      "from-blue-500 to-indigo-500",
      "from-purple-500 to-indigo-500"
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <div 
      className="relative group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${getGradientClasses()} rounded-lg blur opacity-0 group-hover:opacity-25 transition-all duration-300`}
      ></div>
      
      <div className="relative bg-gradient-to-br from-[#1e1e1e] to-[#252525] border border-[#3e3e3e] p-5 rounded-lg group-hover:border-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden z-10">
        {/* Decorative elements */}
        <div className="absolute -right-6 -top-6 w-16 h-16 bg-yellow-500/10 rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-yellow-500/5 rounded-full"></div>
        
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getGradientClasses()} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
            {index % 3 === 0 && <Trophy className="w-5 h-5 text-white" />}
            {index % 3 === 1 && <Medal className="w-5 h-5 text-white" />}
            {index % 3 === 2 && <Award className="w-5 h-5 text-white" />}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${getGradientClasses()} bg-clip-text text-transparent`}>
              {achievement.title}
            </h3>
            
            <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
              {achievement.description}
            </p>
            
            <div className={`mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <span>Learn more</span>
              <ChevronRight className={`w-4 h-4 ml-1 transform ${isHovered ? 'translate-x-1' : 'translate-x-0'} transition-transform duration-300`} />
            </div>
          </div>
        </div>
        
        {/* Progress indicator at bottom */}
        <div className="w-full h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${getGradientClasses()} w-0 group-hover:w-full transition-all duration-1000 ease-out`}></div>
        </div>
      </div>
    </div>
  );
};

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ data }) => {
  return (
    <div className="animate-fadeIn my-10 w-full">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center border-b border-gray-700 pb-2">
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-2 rounded-lg shadow-lg mr-3">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Achievements & Awards</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {data.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
