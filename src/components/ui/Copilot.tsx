import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  X, 
  ChevronRight, 
  Send, 
  RefreshCw, 
  Copy, 
  Check,
  Lightbulb,
  Zap,
  Split,
  Trash
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  experienceData, 
  projectsData, 
  educationData, 
  achievementsData, 
  skillsData 
} from '../../data';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface CopilotSidebarProps {
  initiallyOpen?: boolean;
  userName?: string;
  userAvatar?: string;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}

type MessageType = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'error' | 'complete';
  codeBlocks?: string[];
};

const CopilotSidebar: React.FC<CopilotSidebarProps> = ({
  initiallyOpen = true,
  userName = 'Developer',
  userAvatar,
  onSendMessage,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [message, setMessage] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'suggestions' | 'history' | 'settings'>('chat');
  const [textareaHeight, setTextareaHeight] = useState('60px');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isInInlineMode, setIsInInlineMode] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  
  // Initial welcome message with data from personalData
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      role: 'system',
      content: `👋 Hi, I'm Rohit Yadav, a Software Engineer with ${experienceData[0].period.split('–')[0]} of experience in AI, ML, and cloud technologies. Currently working at ${experienceData[0].title.split('|')[0].trim()}.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'complete'
    }
  ]);


  const quickStarters = [
    "Tell me about your most challenging project",
    "What's your experience with React and TypeScript?",
    "How do you approach problem-solving?",
    "What are your team collaboration experiences?"
  ];

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Add keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
      setTextareaHeight(`${Math.min(scrollHeight, 150)}px`);
    }
  }, [message]);

  // Call to Google Gemini API
  const fetchGeminiResponse = async (userMessage: string) => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const context = `
        You are acting as Rohit Yadav, a software engineer. Here is information about yourself:
        Current Role: ${experienceData[0].title}
        Experience: ${experienceData[0].period}
        Education: ${educationData[0].degree} from ${educationData[0].institution}
        Skills: ${Object.values(skillsData).flat().join(', ')}
        Recent Projects: ${projectsData.map(p => p.title).join(', ')}
        Achievements: ${achievementsData.map(a => a.title).join(', ')}

        Always respond in first person as if you are Rohit Yadav. Be conversational, professional, and highlight your achievements when relevant.
        
        User message: ${userMessage}
      `;

      const result = await model.generateContent(context);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm sorry, I encountered an issue connecting to my knowledge base. Please try again in a moment.";
    }
  };
  
  // Function to simulate responses based on the question (for demonstration)
  // const simulateResponse = (query: string) => {
  //   const lowerQuery = query.toLowerCase();
    
  //   if (lowerQuery.includes('project') || lowerQuery.includes('portfolio')) {
  //     return `I've worked on several significant projects throughout my career. Some highlights include:

  // 1. ${personalData.projects[0].title} - ${personalData.projects[0].description}
  // 2. ${personalData.projects[1].title} - ${personalData.projects[1].description}

  // Would you like me to elaborate on any specific project?`;
  //   }
    
  //   if (lowerQuery.includes('skills') || lowerQuery.includes('technologies')) {
  //     return `I'm proficient in a variety of technologies. My core skills include:

  // ${personalData.skills.slice(0, 8).join(', ')}

  // I also have experience with ${personalData.skills.slice(8, 12).join(', ')} and am always expanding my technical toolkit.`;
  //   }
    
  //   if (lowerQuery.includes('education') || lowerQuery.includes('degree')) {
  //     return `Regarding my education: ${personalData.education}`;
  //   }
    
  //   if (lowerQuery.includes('experience') || lowerQuery.includes('work history')) {
  //     return `I have ${personalData.experience} years of professional experience in software development. 
  // I've worked across multiple domains including ${personalData.domains.join(', ')}.`;
  //   }
    
  //   return `Thanks for your question! As a software engineer with ${personalData.experience} years of experience, 
  // I've developed expertise in ${personalData.skills.slice(0, 3).join(', ')} and other technologies.

  // Is there something specific about my background or experience you'd like to know more about?`;
  // };

  // Enhanced handleSubmit with Gemini API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newUserMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      status: 'complete'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    if (onSendMessage) onSendMessage(message);
    setMessage('');
    setIsTyping(true);
    
    // Get the AI response
    const tempId = (Date.now() + 1).toString();
    const initialAssistantMessage: MessageType = {
      id: tempId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, initialAssistantMessage]);
    
    // Get response from Gemini
    const response = await fetchGeminiResponse(message);
    
    // Simulate progressive typing for assistant response
    let displayedResponse = '';
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < response.length) {
        displayedResponse += response[charIndex];
        
        // Extract code blocks for special rendering
        const codeBlocks = displayedResponse.match(/```[\s\S]+?```/g) || [];
        
        const updatedAssistantMessage: MessageType = {
          id: tempId,
          role: 'assistant',
          content: displayedResponse,
          timestamp: new Date(),
          status: charIndex < response.length - 1 ? 'sending' : 'complete',
          codeBlocks
        };
        
        setMessages(prev => {
          const lastMessageIndex = prev.findIndex(msg => msg.id === tempId);
          if (lastMessageIndex !== -1) {
            const newMessages = [...prev];
            newMessages[lastMessageIndex] = updatedAssistantMessage;
            return newMessages;
          }
          return [...prev, updatedAssistantMessage];
        });
        
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 15);
  };

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setActiveSuggestion(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleQuickStarterClick = (starter: string) => {
    setMessage(starter);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleInlineMode = () => {
    setIsInInlineMode(!isInInlineMode);
  };

  const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setActiveMessageId(messageId);
  };

  const handleClickOutside = useCallback(() => {
    setShowContextMenu(false);
  }, []);

  useEffect(() => {
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu, handleClickOutside]);

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setShowContextMenu(false);
  };

  // Function to extract and format code blocks
  const formatMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]+?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const language = part.match(/```(\w*)/)?.[1] || '';
        const code = part.replace(/```[\w]*\n|```$/g, '');
        return (
          <div key={index} className="my-2 relative group">
            <div className="absolute top-0 right-0 bg-[#2d2d2d] text-gray-400 text-xs px-2 py-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
              {language || 'code'}
              <button 
                className="ml-2 hover:text-white"
                onClick={() => handleCopyCode(code)}
              >
                {isCopying ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] p-3 rounded-md overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
    });
  };

  return (
    <>
      {/* Collapsed button when sidebar is closed */}
      {!isOpen && (
        <div 
          className="fixed right-4 bottom-24 bg-[#1c2b4b] hover:bg-[#2d4a7c] text-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group z-20"
          onClick={toggleSidebar}
        >
          <div className="flex items-center justify-center">
            Chat With Rohit's AI 🤖
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed bg-[#252526] shadow-lg rounded-md z-50 border border-[#3c3c3c] py-1 w-48"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button 
            className="w-full text-left px-3 py-1.5 hover:bg-[#3c3c3c] flex items-center gap-2"
            onClick={() => {
              const message = messages.find(msg => msg.id === activeMessageId);
              if (message) handleCopy(message.content, message.id);
              setShowContextMenu(false);
            }}
          >
            <Copy size={14} />
            <span>Copy message</span>
          </button>
          <button 
            className="w-full text-left px-3 py-1.5 hover:bg-[#3c3c3c] flex items-center gap-2"
            onClick={() => activeMessageId && deleteMessage(activeMessageId)}
          >
            <Trash size={14} />
            <span>Delete message</span>
          </button>
        </div>
      )}
      
      {/* Main sidebar */}
      <div 
        className={`my-6 fixed right-0 top-0 bottom-0 bg-[#1e1e1e] text-gray-200 shadow-xl transition-all duration-300 ease-in-out z-30 flex flex-col
          ${isOpen ? 'w-96 border-l border-[#3c3c3c]' : 'w-0 opacity-0'}`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[#3c3c3c] flex items-center justify-between bg-[#252526]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-lg">Chat with Rohit's AI</h3>
                {isInInlineMode && (
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">Inline</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-1 hover:bg-[#3c3c3c] rounded"
                  onClick={toggleInlineMode}
                  title={isInInlineMode ? "Switch to chat mode" : "Switch to inline mode"}
                >
                  <Split className={`w-4 h-4 ${isInInlineMode ? 'text-blue-400' : 'text-gray-400'}`} />
                </button>
                <button 
                  className="p-1 hover:bg-[#3c3c3c] rounded"
                  onClick={toggleSidebar}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 overflow-hidden flex flex-col ">
              {/* Chat view */}
              {activeView === 'chat' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} ${msg.role === 'system' ? 'opacity-80' : ''}`}
                      onContextMenu={(e) => handleContextMenu(e, msg.id)}
                    >
                      {/* Message header */}
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === 'assistant' ? (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                        ) : msg.role === 'user' ? (
                          userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold">{userName.charAt(0)}</span>
                            </div>
                          )
                        ) : (
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {msg.role === 'assistant' ? 'Rohit AI' : msg.role === 'user' ? userName : 'System'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                        {msg.status === 'sending' && (
                          <span className="text-xs text-blue-400 animate-pulse">typing...</span>
                        )}
                      </div>
                      
                      {/* Message content */}
                      <div 
                        className={`p-3 rounded-lg relative group max-w-[90%] ${
                          msg.role === 'user'
                            ? 'bg-[#2c2c7c] rounded-tr-none'
                            : msg.role === 'system'
                            ? 'bg-[#333333]'
                            : 'bg-[#2d2d2d] rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                          {formatMessageContent(msg.content)}
                        </div>
                        
                        {/* Actions for assistant messages */}
                        {msg.role === 'assistant' && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              className="p-1 hover:bg-[#3c3c3c] rounded"
                              onClick={() => handleCopy(msg.content, msg.id)}
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3 rounded-lg bg-[#2d2d2d] flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Quick suggestions area (shown only in chat view) */}
            {activeView === 'chat' && (
              <div className="p-3 bg-[#252526] border-t border-[#3c3c3c]">
              
                
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">QUICK START</h4>
                  <div className="space-y-1">
                    {quickStarters.map((starter, index) => (
                      <button
                        key={index}
                        className="w-full text-left text-xs p-1.5 hover:bg-[#3c3c3c] rounded flex items-center gap-1 text-gray-300"
                        onClick={() => handleQuickStarterClick(starter)}
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{starter}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Input area */}
            {activeView === 'chat' && (
              <div className="p-3 bg-[#1e1e1e] border-t border-[#3c3c3c]">
                <form onSubmit={handleSubmit} className="relative">
                  <textarea 
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#2d2d2d] border border-[#3c3c3c] rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#525252] focus:ring-1 focus:ring-[#525252] resize-none"
                    placeholder="Ask Rohit something..."
                    style={{ height: textareaHeight }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button 
                    type="submit" 
                    className={`absolute right-3 bottom-3 p-1 rounded-md ${message.trim() ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 cursor-not-allowed'}`}
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CopilotSidebar;