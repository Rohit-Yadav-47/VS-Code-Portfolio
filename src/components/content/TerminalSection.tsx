import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ClipboardCopy, Check, Maximize2, Minimize2, RefreshCw} from 'lucide-react';

// Essential resume data
const resumeData = {
  personal: {
    name: "Rohit Yadav",
    role: "Software Engineer",
    location: "Bangalore, India"
  },
  experience: [
    {
      company: "AMADEUS",
      position: "Software Development Engineer Intern",
      highlight: "Developed browser extension with LLM pipeline, improving feedback processing by 65%"
    },
    {
      company: "TECHCURATORS",
      position: "Technical Project Associate Intern",
      highlight: "Built RAG framework with 85% improved retrieval accuracy serving 200+ daily users"
    }
  ],
  projects: [
    "Smart Wheelchair: Multimodal accessibility system with TensorFlow & React",
    "Event Hub: Microservice architecture with sub-50ms RAG query latency"
  ],
  achievements: [
    "IEEEXtreme: Top 20 nationally from 17,000+ participants",
    "Hackathon Wins: Led teams to 10+ top finishes"
  ],
  skills: {
    "Core": ["Python", "React", "AWS", "TensorFlow", "FastAPI"],
    "Advanced": ["RAG", "LLM", "Kubernetes", "CI/CD"]
  }
};

const TerminalSection: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [output, setOutput] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCommands] = useState([
    'help', 'skills', 'exp', 'projects', 'achievements', 'clear', 'about', 'neofetch'
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Terminal focus handling
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminal) {
        terminal.removeEventListener('click', handleClick);
      }
    };
  }, []);
  
  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Auto scroll to bottom on new content
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commandHistory, output]);

  

  const copyToClipboard = () => {
    const textToCopy = Object.entries(resumeData.skills)
      .map(([category, skills]) => `${category}: ${skills.join(', ')}`)
      .join('\n');
      
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const processCommand = (command: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (command.trim().toLowerCase() === 'clear' || command.trim().toLowerCase() === 'cls') {
        setCommandHistory([]);
        setOutput(null);
        return;
      }
      
      // Skill command
      if (command.trim().toLowerCase() === 'skills') {
        setOutput(
          <div className="ml-4 mt-2 space-y-1 text-gray-300 animate-fadeIn">
            {Object.entries(resumeData.skills).map(([category, skills], index) => (
              <p key={index} className="group flex items-start hover:text-white transition-colors">
                <span className="text-yellow-500 mr-2 group-hover:text-yellow-300 transition-colors">$</span>
                <span className="font-medium text-blue-400">{category}:</span>
                <span className="ml-1 text-blue-300">{Array.isArray(skills) ? skills.join(', ') : skills}</span>
              </p>
            ))}
          </div>
        );
      }
      
      // Experience command
      else if (command.trim().toLowerCase() === 'exp' || command.trim().toLowerCase() === 'experience') {
        setOutput(
          <div className="ml-4 mt-2 space-y-3 text-gray-300 animate-fadeIn">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="group hover:bg-gray-800 hover:bg-opacity-40 p-1 rounded transition-colors">
                <p className="font-medium text-blue-400">{exp.company} <span className="text-green-400">| {exp.position}</span></p>
                <p className="text-amber-300 text-sm mt-1">{exp.highlight}</p>
              </div>
            ))}
          </div>
        );
      }
      
      // Projects command
      else if (command.trim().toLowerCase() === 'projects') {
        setOutput(
          <div className="ml-4 mt-2 space-y-2 text-gray-300 animate-fadeIn">
            {resumeData.projects.map((project, index) => (
              <p key={index} className="group flex items-start hover:bg-gray-800 hover:bg-opacity-40 p-1 rounded transition-colors">
                <span className="text-yellow-500 mr-2 group-hover:text-yellow-300 transition-colors">►</span>
                <span className="text-blue-300">{project}</span>
              </p>
            ))}
          </div>
        );
      }
      
      // Achievements command
      else if (command.trim().toLowerCase() === 'achievements') {
        setOutput(
          <div className="ml-4 mt-2 space-y-2 text-gray-300 animate-fadeIn">
            {resumeData.achievements.map((achievement, index) => (
              <p key={index} className="group flex items-start hover:bg-gray-800 hover:bg-opacity-40 p-1 rounded transition-colors">
                <span className="text-yellow-500 mr-2 group-hover:text-yellow-300 transition-colors">★</span>
                <span className="text-blue-300">{achievement}</span>
              </p>
            ))}
          </div>
        );
      }
      
      // Help command
      else if (command.trim().toLowerCase() === 'help') {
        setOutput(
          <div className="ml-4 mt-2 space-y-2 text-gray-300 animate-fadeIn">
            <p className="text-purple-400 font-medium mb-1">Available commands:</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">neofetch</span> - Display system info</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">skills</span> - List technical skills</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">exp</span> - Show work experience</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">projects</span> - View projects</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">achievements</span> - Display achievements</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">about</span> - About me</p>
            <p><span className="text-amber-500 mr-2">$</span> <span className="text-blue-400 font-semibold">clear</span> - Clear terminal</p>
          </div>
        );
      }
      
      // About command
      else if (command.trim().toLowerCase() === 'about') {
        setOutput(
          <div className="ml-4 mt-2 space-y-1 text-gray-300 animate-fadeIn">
            <p><span className="text-purple-400 font-semibold">Name:</span> {resumeData.personal.name}</p>
            <p><span className="text-purple-400 font-semibold">Role:</span> {resumeData.personal.role}</p>
            <p><span className="text-purple-400 font-semibold">Location:</span> {resumeData.personal.location}</p>
            <p><span className="text-purple-400 font-semibold">Bio:</span> Full-stack engineer specialized in ML/AI solutions with a passion for building impactful systems.</p>
          </div>
        );
      }
      
      // Neofetch command (system info display)
      else if (command.trim().toLowerCase() === 'neofetch') {
        setOutput(
          <div className="flex items-start mt-2 animate-fadeIn">
            <div className="text-indigo-400 font-mono mr-6 ml-2">
              <pre className="text-blue-500">
{`  ____       _     _ _   
 |  _ \\ ___ | |__ (_) |_ 
 | |_) / _ \\| '_ \\| | __|
 |  _ < (_) | | | | | |_ 
 |_| \\_\\___/|_| |_|_|\\__|`}
              </pre>
            </div>
            <div className="flex flex-col text-gray-300 text-sm space-y-1">
              <p><span className="text-indigo-400 mr-2">OS:</span> Portfolio v2.0.3</p>
              <p><span className="text-purple-400 mr-2">Host:</span> {resumeData.personal.name}</p>
              <p><span className="text-blue-400 mr-2">Kernel:</span> {resumeData.personal.role}</p>
              <p><span className="text-indigo-400 mr-2">Uptime:</span> 3+ years in tech</p>
              <p><span className="text-purple-400 mr-2">Packages:</span> {Object.values(resumeData.skills).flat().length} (skills)</p>
              <p><span className="text-blue-400 mr-2">Shell:</span> TypeScript/React</p>
              <p><span className="text-indigo-400 mr-2">Resolution:</span> Problem-solver x Full-stack developer</p>
              <p><span className="text-purple-400 mr-2">Terminal:</span> rxterm v1.0</p>
              <p><span className="text-blue-400 mr-2">CPU:</span> Brain @ 4.2GHz</p>
              <p><span className="text-indigo-400 mr-2">Memory:</span> 1000+ DSA problems solved</p>
            </div>
          </div>
        );
      }
      
      // Command not found
      else {
        setOutput(
          <div className="animate-fadeIn">
            <p className="text-red-500">Command not found: {command}</p>
            <p className="text-gray-500 text-xs mt-1">Type 'help' to see available commands</p>
            <div className="text-xs text-red-400 mt-2 font-mono animate-pulse">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex">
                  <span className="text-gray-600 mr-2">{i+1}</span>
                  <span>{`${i === 0 ? 'ERROR' : 'UNKNOWN_COMMAND'}`}: {Math.random().toString(36).substring(2, 5)}_{command}_{Math.random().toString(36).substring(2, 5)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }, 300);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = terminalCommand.trim();
      if (command) {
        setCommandHistory(prev => [...prev, command]);
        setTerminalCommand("");
        setHistoryIndex(-1);
        processCommand(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setTerminalCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = terminalCommand.toLowerCase();
      const matchedCommand = availableCommands.find(cmd => cmd.startsWith(currentInput));
      if (matchedCommand) {
        setTerminalCommand(matchedCommand);
      }
    }
  };

  return (
    <div className={`absolute bottom-6 z-10 min-w-full right-0 bg-[#1e1e1e] border border-[#3c3c3c] rounded-md transition-all duration-300 ${
      isMinimized ? 'h-9' : 'sm:h-72 h-60'
    }`}>
      {/* Terminal Header */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 border-b border-[#3c3c3c] rounded-t-md">
        <div className="flex items-center space-x-2">
  
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 font-medium text-sm">rohit@portfolio:~</span>
        </div>
        <div className="flex items-center space-x-3">
          {isLoading && <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
          {!isCopied ? (
            <button 
              onClick={copyToClipboard} 
              className="hover:bg-[#4c4c4c] p-1 rounded transition-colors group"
              aria-label="Copy terminal content"
            >
              <ClipboardCopy className="w-3 h-3 text-gray-400 group-hover:text-gray-200 transition-colors" />
            </button>
          ) : (
            <Check className="w-4 h-4 text-gray-300" />
          )}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-[#4c4c4c] p-1 rounded transition-colors group"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-gray-200 transition-colors" />
            ) : (
              <Minimize2 className="w-3 h-3 text-gray-400 group-hover:text-gray-200 transition-colors" />
            )}
          </button>
        </div>
      </div>
      
      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className="h-[calc(100%-36px)] overflow-y-auto custom-scrollbar p-3 font-mono text-sm"
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: '#4c4c4c #1e1e1e', 
            backgroundColor: '#1e1e1e'
          }}
        >
          <div className="mb-3 text-gray-400 text-xs">
            <span className="text-gray-300 font-semibold">Welcome to Portfolio Terminal v2.0.3</span><span className="text-gray-500"> | Type</span> <span className="text-gray-300">'help'</span> <span className="text-gray-500">for available commands.</span>
            <div className="text-xs text-gray-600 mt-1">
              • Use <span className="text-gray-400">Tab</span> to autocomplete • <span className="text-gray-400">↑/↓</span> arrows for history • <span className="text-gray-400">clear</span> to reset
            </div>
          </div>
          
          {/* Command history */}
          {commandHistory.map((cmd, index) => (
            <div key={index} className="mt-4 animate-fadeIn">
              <p className="text-gray-300 flex items-center">
                <span className="text-gray-400 mr-2">rohit@portfolio:~$</span> {cmd}
              </p>
              {index === commandHistory.length - 1 && output}
            </div>
          ))}
          
          {/* Interactive prompt */}
          <div className="mt-4 flex items-center group">
            <span className="text-gray-400 mr-2">rohit@portfolio:~$</span>
            <div className="flex-grow flex items-center">
              <input 
                ref={inputRef}
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-gray-300 flex-grow caret-transparent"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck="false"
              />
              {terminalCommand === "" && (
                <span className={`w-2 h-5 bg-gray-400 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}></span>
              )}
            </div>
          </div>
          <div ref={bottomRef} /> {/* Anchor for auto-scrolling */}
        </div>
      )}
    </div>
  );
};

export default TerminalSection;