import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ClipboardCopy, Check, X, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { skillsData } from '../../data';

const TerminalSection: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [output, setOutput] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCommands] = useState(['help', 'skills', 'clear', 'cls', 'about']);
  
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

  // Initialize with help command
  useEffect(() => {
    processCommand('help');
  }, []);

  const copyToClipboard = () => {
    const textToCopy = Object.entries(skillsData)
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
      
      if (command.trim().toLowerCase() === 'skills --list' || command.trim().toLowerCase() === 'skills' || command.trim().toLowerCase() === 'ls skills') {
        setOutput(
          <div className="ml-4 mt-2 space-y-1 text-gray-300 animate-fadeIn">
            {Object.entries(skillsData).map(([category, skills], index) => (
              <p key={index} className="group flex items-start hover:text-white transition-colors">
                <span className="text-yellow-500 mr-2 group-hover:text-yellow-300 transition-colors">→</span>
                <span className="font-medium text-blue-400">{category}:</span>
                <span className="ml-1 text-blue-300">{skills.join(', ')}</span>
              </p>
            ))}
          </div>
        );
      } else if (command.trim().toLowerCase() === 'help') {
        setOutput(
          <div className="ml-4 mt-2 space-y-2 text-gray-300 animate-fadeIn">
            <p className="text-green-400 font-medium mb-1">Available commands:</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">skills</span> - List all skills</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">clear</span> - Clear terminal</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">help</span> - Show this help</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">about</span> - About me</p>
          </div>
        );
      } else if (command.trim().toLowerCase() === 'about') {
        setOutput(
          <div className="ml-4 mt-2 space-y-1 text-gray-300 animate-fadeIn">
            <p><span className="text-green-400 font-semibold">Name:</span> Rohit Yadav</p>
            <p><span className="text-green-400 font-semibold">Role:</span> Software Engineer</p>
            <p><span className="text-green-400 font-semibold">Location:</span> Bangalore, India</p>
            <p><span className="text-green-400 font-semibold">Bio:</span> Passionate developer with expertise in full-stack development.</p>
          </div>
        );
      } else {
        setOutput(
          <div className="animate-fadeIn">
            <p className="text-red-500">Command not found: {command}</p>
            <p className="text-gray-500 text-xs mt-1">Type 'help' to see available commands</p>
            <div className="text-xs text-red-400 mt-2 font-mono animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex">
                  <span className="text-gray-600 mr-2">{i+1}</span>
                  <span>{`${i === 0 ? 'ERROR' : i === 1 ? 'UNKNOWN_COMMAND' : 'TRY_HELP'}`}: {i === 2 ? `'${command}'` : (Math.random().toString(36).substring(2, 8))}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }, 600);
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
    <div className={`absolute bottom-6 z-10 left-72 right-0 bg-[#1a1a1a] border-t border-gray-700 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,0,0.1)] ${
      isMinimized ? 'h-9' : 'h-64'
    }`}>
      {/* Terminal Header */}
      <div className="h-9 bg-gradient-to-r from-[#2d2d2d] to-[#1a1a1a] flex items-center justify-between px-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-green-300 font-medium text-sm">terminal@portfolio:~</span>
        </div>
        <div className="flex items-center space-x-3">
          {isLoading && <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
          {!isCopied ? (
            <button 
              onClick={copyToClipboard} 
              className="hover:bg-[#424243] p-1 rounded transition-colors group"
              aria-label="Copy terminal content"
            >
              <ClipboardCopy className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <Check className="w-4 h-4 text-green-500" />
          )}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-[#424243] p-1 rounded transition-colors group"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <Minimize2 className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>
    
        </div>
      </div>
      
      {/* Terminal Content */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className="h-[calc(100%-36px)] overflow-y-auto custom-scrollbar p-3 font-mono text-sm backdrop-blur-sm"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#555 #1e1e1e', textShadow: '0 0 1px rgba(144, 238, 144, 0.3)' }}
        >
          <div className="mb-4 text-gray-400 text-xs">
            <span className="text-green-500 font-semibold">Welcome to Portfolio Terminal v1.2.3</span>. Type <span className="text-yellow-400">'help'</span> for available commands.
            <div className="text-xs text-gray-600 mt-1">
              • Use <span className="text-blue-400">Tab</span> to autocomplete commands
              • Use <span className="text-blue-400">Up/Down</span> arrows to navigate command history
            </div>
          </div>
          
          <p className="text-green-400 flex items-center mb-2">
            <span className="text-blue-400 mr-2">user@portfolio:~$</span> help
          </p>
          
          <div className="ml-4 mt-2 space-y-2 text-gray-300">
            <p className="text-green-400 font-medium mb-1">Available commands:</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">skills</span> - List all skills</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">clear</span> - Clear terminal</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">help</span> - Show this help</p>
            <p><span className="text-yellow-500 mr-2">→</span> <span className="text-blue-400 font-semibold">about</span> - About me</p>
          </div>
          
          {/* Command history */}
          {commandHistory.map((cmd, index) => (
            <div key={index} className="mt-4">
              <p className="text-green-400 flex items-center">
                <span className="text-blue-400 mr-2">user@portfolio:~$</span> {cmd}
              </p>
              {index === commandHistory.length - 1 && output}
            </div>
          ))}
          
          {/* Interactive prompt */}
          <div className="mt-4 flex items-center group">
            <span className="text-blue-400 mr-2">user@portfolio:~$</span>
            <div className="flex-grow flex items-center">
              <input 
                ref={inputRef}
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-green-400 flex-grow caret-transparent"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck="false"
              />
              {terminalCommand === "" && (
                <span className={`w-2.5 h-5 bg-green-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 shadow-[0_0_5px_rgba(0,255,0,0.7)]`}></span>
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
