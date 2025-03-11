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
  Trash,
  Bookmark,
  Code,
  Briefcase
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
  category?: 'general' | 'technical' | 'career';
  saved?: boolean;
};

type Theme = 'dark' | 'light';

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
  const [hideQuickStart, setHideQuickStart] = useState(false);
  
  // Initial welcome message with intro about Rohit
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      role: 'system',
      content: `👋 Hi, I'm Rohit's AI assistant. Rohit is a skilled software engineer with experience in:

• Full-stack development with React, TypeScript, and Node.js
• Machine learning and AI systems
• Cloud architecture on AWS and GCP
• Mobile app development with React Native

You can ask me anything about Rohit's experience, skills, or projects, and I'll help you learn more about his background and expertise.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'complete',
      category: 'general'
    }
  ]);

  const quickStarters = [
    {
      text: "Tell me about your most challenging project",
      category: "code",
      icon: <Code size={12} />
    },
    {
      text: "What's your experience with React and TypeScript?",
      category: "code",
      icon: <Code size={12} />
    },
    {
      text: "How do you approach problem-solving?",
      category: "work",
      icon: <Lightbulb size={12} />
    },
    {
      text: "What are your team collaboration experiences?",
      category: "work",
      icon: <Briefcase size={12} />
    }
  ];

  // Theme styles
  const themeStyles = {
    bg: 'bg-[#1e1e1e]',
    header: 'bg-[#252526]',
    sidebar: 'bg-[#1e1e1e] text-gray-200',
    input: 'bg-[#2d2d2d] border-[#3c3c3c]',
    hover: 'hover:bg-[#3c3c3c]',
    border: 'border-[#3c3c3c]',
    userMessage: 'bg-gradient-to-r from-indigo-900 to-purple-900',
    assistantMessage: 'bg-[#2d2d2d]',
    systemMessage: 'bg-[#333333]',
    codeBlock: 'bg-[#1a1a1a] border-[#444]',
  };

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
        If discussing code, include well-formatted examples with syntax highlighting.
        
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

  // Simplified handleSubmit without categories
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Hide quick starters after sending a message
    setHideQuickStart(true);
    
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
          codeBlocks,
          saved: false
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
    setHideQuickStart(true);
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

  const toggleSaveMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, saved: !msg.saved }
          : msg
      )
    );
  };

  // Function to extract and format code blocks
  const formatMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]+?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const language = part.match(/```(\w*)/)?.[1] || '';
        const code = part.replace(/```[\w]*\n|```$/g, '');
        return (
          <div key={index} className={`my-3 relative group rounded-md overflow-hidden border ${themeStyles.codeBlock}`}>
            <div className="flex justify-between items-center px-3 py-2 text-xs font-mono border-b border-gray-700">
              <span>{language || 'code'}</span>
              <button 
                className="hover:text-blue-400 transition-colors"
                onClick={() => handleCopyCode(code)}
              >
                {isCopying ? (
                  <span className="flex items-center gap-1"><Check size={14} /> Copied</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy size={14} /> Copy</span>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return part.trim() ? <ReactMarkdown key={index}>{part}</ReactMarkdown> : null;
    });
  };

  return (
    <>
      {/* Collapsed button when sidebar is closed */}
      {!isOpen && (
        <div 
          className="fixed right-4 bottom-24 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-full p-3.5 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group z-20"
          onClick={toggleSidebar}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Chat With Rohit's AI</span>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className={`fixed ${themeStyles.bg} shadow-lg rounded-md z-50 border ${themeStyles.border} py-1 w-48`}
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button 
            className={`w-full text-left px-3 py-1.5 ${themeStyles.hover} flex items-center gap-2`}
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
            className={`w-full text-left px-3 py-1.5 ${themeStyles.hover} flex items-center gap-2`}
            onClick={() => {
              if (activeMessageId) toggleSaveMessage(activeMessageId);
              setShowContextMenu(false);
            }}
          >
            <Bookmark size={14} />
            <span>Save message</span>
          </button>
          <button 
            className={`w-full text-left px-3 py-1.5 ${themeStyles.hover} flex items-center gap-2`}
            onClick={() => activeMessageId && deleteMessage(activeMessageId)}
          >
            <Trash size={14} />
            <span>Delete message</span>
          </button>
        </div>
      )}
      
      {/* Main sidebar */}
      <div 
        className={`my-6 fixed right-0 top-0 bottom-0 ${themeStyles.sidebar} shadow-xl transition-all duration-300 ease-in-out z-30 flex flex-col
          ${isOpen ? 'w-96 border-l ' + themeStyles.border : 'w-0 opacity-0'}`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className={`p-4 border-b ${themeStyles.border} flex items-center justify-between ${themeStyles.header}`}>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-1.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Chat with Rohit's AI</h3>
                {isInInlineMode && (
                  <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded">Inline</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className={`p-1.5 ${themeStyles.hover} rounded-full`}
                  onClick={toggleInlineMode}
                  title={isInInlineMode ? "Switch to chat mode" : "Switch to inline mode"}
                >
                  <Split className={`w-4 h-4 ${isInInlineMode ? 'text-indigo-400' : ''}`} />
                </button>
                <button 
                  className={`p-1.5 ${themeStyles.hover} rounded-full`}
                  onClick={toggleSidebar}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Chat view */}
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
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : msg.role === 'user' ? (
                        userAvatar ? (
                          <img src={userAvatar} alt={userName} className="w-6 h-6 rounded-full border-2 border-blue-400" />
                        ) : (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">{userName.charAt(0)}</span>
                          </div>
                        )
                      ) : (
                        <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                          <Lightbulb className="w-3.5 h-3.5 text-white" />
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
                      {msg.saved && (
                        <Bookmark size={12} className="text-blue-400" />
                      )}
                    </div>
                    
                    {/* Message content */}
                    <div 
                      className={`p-3 rounded-lg relative group max-w-[90%] ${
                        msg.role === 'user'
                          ? themeStyles.userMessage + ' rounded-tr-none'
                          : msg.role === 'system'
                          ? themeStyles.systemMessage
                          : themeStyles.assistantMessage + ' rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {formatMessageContent(msg.content)}
                      </div>
                      
                      {/* Actions for messages */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          className={`p-1 ${themeStyles.hover} rounded`}
                          onClick={() => handleCopy(msg.content, msg.id)}
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button 
                          className={`p-1 ${themeStyles.hover} rounded`}
                          onClick={() => toggleSaveMessage(msg.id)}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${msg.saved ? 'text-blue-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-[#2d2d2d] flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Updated Quick suggestions area - hidden after first message */}
            {!hideQuickStart && (
              <div className="p-4 bg-gradient-to-b from-[#252526] to-[#1e1e1e] border-t border-[#3c3c3c]">
                <h4 className="text-xs font-medium text-gray-400 mb-3">SUGGESTED PROMPTS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickStarters.map((starter, index) => (
                    <button
                      key={index}
                      className="text-left text-xs p-2 bg-[#2d2d2d] hover:bg-[#3c3c3c] border border-[#444] rounded-md flex items-center gap-2 text-gray-300 transition-colors"
                      onClick={() => handleQuickStarterClick(starter.text)}
                    >
                      <div className="p-1 rounded-full bg-[#3c3c3c] flex-shrink-0">
                        {starter.icon}
                      </div>
                      <span className="truncate">{starter.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input area */}
            <div className="p-3 bg-[#1e1e1e] border-t border-[#3c3c3c]">
              <form onSubmit={handleSubmit} className="relative">
                <textarea 
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full ${themeStyles.input} rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none`}
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
                  className={`absolute right-3 bottom-3 p-1 rounded-md transition-colors ${message.trim() ? 'text-indigo-400 hover:text-indigo-300' : 'text-gray-500 cursor-not-allowed'}`}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CopilotSidebar;
