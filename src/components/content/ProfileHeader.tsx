import React, { useState } from 'react';
import { Github, Linkedin, Mail, Phone, Globe, ExternalLink, ClipboardCheck, ArrowRight, User, MapPin, Calendar, Code, Briefcase, Award } from 'lucide-react';

interface ProfileHeaderProps {
  showToast: (message: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ showToast }) => {
  const [animateEmail, setAnimateEmail] = useState(false);
  const [animatePhone, setAnimatePhone] = useState(false);
  
  const copyEmail = () => {
    navigator.clipboard.writeText('yrohit1805@gmail.com');
    showToast('Email copied to clipboard!');
    setAnimateEmail(true);
    setTimeout(() => setAnimateEmail(false), 1500);
  };
  
  const copyPhone = () => {
    navigator.clipboard.writeText('+91 92203 19055');
    showToast('Phone number copied to clipboard!');
    setAnimatePhone(true);
    setTimeout(() => setAnimatePhone(false), 1500);
  };
  
  return (
    <div className="mb-12 w-full relative perspective-1000">
      {/* Background glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/30 to-cyan-600/20 blur-3xl rounded-3xl opacity-30 animate-pulse-slow"></div>
      
      {/* Main card with 3D hover effect */}
      <div className="relative bg-[#121212] border border-[#333333] p-0 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-indigo-500/10 group/card preserve-3d backdrop-blur-sm overflow-hidden">
        {/* Accent border gradient */}
        <div className="absolute inset-0 border-2 border-transparent rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent bg-clip-border pointer-events-none"></div>
        
        {/* Status badge */}
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-10">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-800 text-xs text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-900/20 backdrop-blur-md translate-y-0 hover:-translate-y-1 transition-transform cursor-pointer">
            <span className="animate-pulse mr-1.5 relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Available for work
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left column with photo and main info */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-[#1a1a1a] to-[#181818] p-8 md:p-10 flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-[#333333]">
            {/* Profile image with animated gradient border */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-spin-slow opacity-70 blur-sm group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-36 w-36 rounded-full bg-[#121212] border-4 border-[#2a2a2a] p-1 shadow-inner flex items-center justify-center overflow-hidden">
                {/* Replace with an actual image */}
                <div className="bg-gradient-to-br from-[#252525] to-[#1a1a1a] h-full w-full rounded-full flex items-center justify-center">
                  <img className='scale-110' src='https://media.licdn.com/dms/image/v2/D5603AQHE3lHpmACq7A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710183002291?e=1747267200&v=beta&t=ayVhrZ_tQ1JX8F5VYjGnKo4VF_mZ2juhuW0apLtcOFw'/>
                </div>
              </div>
            </div>
            
            {/* Name and title */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center md:text-left mb-3">
              <span className="text-white">Rohit </span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x">Yadav</span>
            </h1>
            
            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-full border border-blue-700/30 mb-5 backdrop-blur shadow-inner">
              <p className="text-lg font-medium">
                <span className="text-blue-400">Software</span>
                <span className="text-gray-400"> Engineer</span>
              </p>
            </div>
            
            {/* Stats in beautiful pill containers */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              <div className="flex items-center space-x-2 bg-[#1e1e1e] px-3.5 py-2 rounded-full border border-[#333333] shadow-md backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-gray-300 text-sm">Bangalore, India</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-[#1e1e1e] px-3.5 py-2 rounded-full border border-[#333333] shadow-md backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-gray-300 text-sm">1+ Years Experience</span>
              </div>
            </div>
            
            {/* Version tag */}
            <div className="mt-4 flex justify-center md:justify-start">
              <div className="group/version relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0078d4] to-[#00b0ff] blur-md opacity-30 rounded-full group-hover/version:opacity-60 transition-opacity"></div>
                <div className="relative bg-[#121212] text-xs border border-blue-500/30 text-blue-300 px-3.5 py-1.5 rounded-full shadow-md flex items-center group-hover/version:translate-y-[-2px] transition-transform">
                  <span className="mr-1.5 relative flex h-2 w-2 inline-block">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  v1.2.3
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#121212] border border-[#333333] text-xs text-gray-300 px-2.5 py-1.5 rounded opacity-0 group-hover/version:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-xl">
                    Born : 2002
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column with contact info and buttons */}
          <div className="w-full md:w-3/5 p-8 md:p-10">
            {/* Section heading */}
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Connect with me</h2>
            </div>
            

            
            {/* Contact buttons in a grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://github.com/Rohit-Yadav-47" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-gray-600 p-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-gray-900/20"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center mr-3 group-hover:bg-[#444444] transition-colors">
                    <Github className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">GitHub</div>
                    <div className="text-white font-medium">@Rohit-Yadav-47</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
              
              <a 
                href="https://www.linkedin.com/in/ry4/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-blue-700/30 p-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-blue-900/10"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2]/20 flex items-center justify-center mr-3 group-hover:bg-[#0a66c2]/30 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">LinkedIn</div>
                    <div className="text-white font-medium">Rohit Yadav</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
              
              <button
                onClick={copyEmail}
                className={`flex items-center justify-between bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-purple-700/30 p-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-purple-900/10 ${animateEmail ? 'animate-subtle-bounce' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center mr-3 group-hover:bg-purple-900/30 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-medium">yrohit1805@gmail.com</div>
                  </div>
                </div>
                <ClipboardCheck className={`w-4 h-4 ${animateEmail ? 'text-green-400' : 'text-gray-500'} group-hover:text-white transition-colors`} />
              </button>
              
              <button
                onClick={copyPhone}
                className={`flex items-center justify-between bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-green-700/30 p-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-green-900/10 ${animatePhone ? 'animate-subtle-bounce' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-900/20 flex items-center justify-center mr-3 group-hover:bg-green-900/30 transition-colors">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-white font-medium">+91 92203 19055</div>
                  </div>
                </div>
                <ClipboardCheck className={`w-4 h-4 ${animatePhone ? 'text-green-400' : 'text-gray-500'} group-hover:text-white transition-colors`} />
              </button>
              
              <a 
                href="https://drive.google.com/file/d/196xuGCpFDLTosfbUKZIWb2qgP-XjudAA/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] hover:border-cyan-700/30 p-4 rounded-xl transition-all group hover:shadow-xl hover:shadow-cyan-900/10 md:col-span-2"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center mr-3 group-hover:bg-cyan-900/30 transition-colors">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Resume</div>
                    <div className="flex items-center text-white font-medium">
                      <a 
                        href="https://drive.google.com/file/d/196xuGCpFDLTosfbUKZIWb2qgP-XjudAA/view?usp=sharing" 
                        download 
                        className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Download PDF
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </a>
            </div>
            
            {/* Call to action */}
            <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/10 p-4 rounded-xl">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-md bg-blue-500/30 flex items-center justify-center mr-3">
                  <Code className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Currently working on innovative solutions and open to discussing new opportunities in software development.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
