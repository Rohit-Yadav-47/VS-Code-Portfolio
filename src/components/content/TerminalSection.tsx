import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ClipboardCopy, Check, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

// For WebSocket terminal connections
interface TerminalMessage {
  type: 'output' | 'error' | 'info' | 'system' | 'pong';
  data?: string;
  timestamp?: number;
}

const TerminalSection: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [username, setUsername] = useState("user");
  const [hostname, setHostname] = useState("localhost");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttemptsRef = useRef<number>(10); // Limit reconnect attempts
  const isUnmountingRef = useRef<boolean>(false);
  
  // Get WebSocket URL from environment or use default with fallbacks
  const getWebSocketUrl = () => {
    // Try to get from environment, fallback to window.location based URL, then localhost
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // Use environment variable if available (e.g., set by build process)
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_TERMINAL_WS_URL) {
      return process.env.REACT_APP_TERMINAL_WS_URL;
    }
    
    // Fallback to same host as app but different port if in development
    if (process.env.NODE_ENV === 'development') {
      return 'ws://localhost:4000';
    }
    
    // In production, assume the terminal service is on the same domain with path
    return `${protocol}//${host}/api/terminal`;
  };
  
  // Initialize xterm.js
  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Create and configure xterm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#eeeeee',
        cursor: '#ffffff',
        selection: '#5DA5D533',
        black: '#2e3436',
        red: '#cc0000',
        green: '#4e9a06',
        yellow: '#c4a000',
        blue: '#3465a4',
        magenta: '#75507b',
        cyan: '#06989a',
        white: '#d3d7cf',
        brightBlack: '#555753',
        brightRed: '#ef2929',
        brightGreen: '#8ae234',
        brightYellow: '#fce94f',
        brightBlue: '#729fcf',
        brightMagenta: '#ad7fa8',
        brightCyan: '#34e2e2',
        brightWhite: '#eeeeec'
      },
      scrollback: 1000,
      allowTransparency: true
    });
    
    // Add the fit addon
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;
    
    // Add web links addon
    term.loadAddon(new WebLinksAddon());
    
    // Open the terminal in the container
    term.open(terminalRef.current);
    xtermRef.current = term;
    
    // Handle terminal input
    term.onData(data => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'input', data }));
      }
    });
    
    // Handle terminal resize events with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleTermResize = (size: { cols: number; rows: number }) => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'resize',
            cols: size.cols,
            rows: size.rows
          }));
        }
      }, 100); // Debounce resize events
    };
    
    term.onResize(handleTermResize);
    
    // Initial terminal welcome message
    term.writeln("\x1b[1;34mWelcome to the Web Terminal\x1b[0m");
    term.writeln("\x1b[90mConnecting to server...\x1b[0m");
    
    // Auto-fit terminal to container
    if (fitAddonRef.current) {
      setTimeout(() => {
        try {
          fitAddonRef.current?.fit();
          // Send initial size to server
          if (wsRef.current && 
              wsRef.current.readyState === WebSocket.OPEN && 
              term.rows && 
              term.cols) {
            wsRef.current.send(JSON.stringify({
              type: 'resize',
              cols: term.cols,
              rows: term.rows
            }));
          }
        } catch (error) {
          console.error('Error during initial fit:', error);
        }
      }, 100);
    }
    
    // Handle resize events
    const handleResize = () => {
      if (fitAddonRef.current && !isMinimized) {
        try {
          fitAddonRef.current.fit();
          // Don't need to manually call handleTermResize here as xterm's onResize will be triggered
        } catch (error) {
          console.error('Error during window resize:', error);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      isUnmountingRef.current = true;
      window.removeEventListener('resize', handleResize);
      try {
        term.dispose();
      } catch (error) {
        console.error('Error disposing terminal:', error);
      }
    };
  }, [isMinimized]);
  
  // Re-fit terminal after minimized state changes
  useEffect(() => {
    if (!isMinimized && fitAddonRef.current && xtermRef.current) {
      setTimeout(() => {
        try {
          fitAddonRef.current?.fit();
          
          // Re-send terminal size after maximizing
          if (wsRef.current && 
              wsRef.current.readyState === WebSocket.OPEN && 
              xtermRef.current?.rows && 
              xtermRef.current?.cols) {
            wsRef.current.send(JSON.stringify({
              type: 'resize',
              cols: xtermRef.current.cols,
              rows: xtermRef.current.rows
            }));
          }
        } catch (error) {
          console.error('Error during fit after minimize state change:', error);
        }
      }, 300); // Wait for animation to complete
    }
  }, [isMinimized]);
  
  // Health check for WebSocket connection with more tolerance
  useEffect(() => {
    const checkConnectionHealth = () => {
      // Only check if we think we're connected
      if (connected && wsRef.current) {
        // If we haven't received a ping response in 45 seconds (more tolerance)
        if (lastPingTime && Date.now() - lastPingTime > 45000) {
          console.warn('Connection health check failed - no recent pings');
          
          // Check actual WebSocket state
          if (wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket is not in OPEN state:', wsRef.current.readyState);
            
            // Force reconnection
            try {
              wsRef.current.close();
            } catch (e) {
              console.error('Error closing stale connection:', e);
            }
            
            // Reset state
            setConnected(false);
            setIsLoading(true);
            
            // Update UI
            if (xtermRef.current) {
              xtermRef.current.writeln("\x1b[1;31mConnection health check failed, reconnecting...\x1b[0m");
            }
          } else {
            // WebSocket is open but we're not getting pings
            // Send a test ping to verify connection
            try {
              wsRef.current.send(JSON.stringify({ 
                type: 'ping',
                timestamp: Date.now() 
              }));
              console.log('Test ping sent during health check');
            } catch (e) {
              console.error('Error sending test ping - connection likely dead:', e);
              
              // Force close and reconnect
              try {
                wsRef.current.close();
              } catch (innerE) {
                console.error('Error closing broken connection:', innerE);
              }
              
              setConnected(false);
              setIsLoading(true);
              
              if (xtermRef.current) {
                xtermRef.current.writeln("\x1b[1;31mConnection test failed, reconnecting...\x1b[0m");
              }
            }
          }
        }
      }
    };
    
    // Check connection health less frequently (15 seconds instead of 10)
    const healthInterval = setInterval(checkConnectionHealth, 15000);
    connectionCheckIntervalRef.current = healthInterval;
    
    return () => {
      clearInterval(healthInterval);
    };
  }, [connected, lastPingTime]);
  
  // Initialize WebSocket connection to terminal server with better error handling
  useEffect(() => {
    const connectToTerminal = () => {
      if (isUnmountingRef.current) return;
      
      // Use our dynamic WebSocket URL getter function
      const socketUrl = getWebSocketUrl();
      
      try {
        // Clear any existing timeouts and intervals
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        
        // Close existing connection if any
        if (wsRef.current) {
          try {
            if (wsRef.current.readyState === WebSocket.OPEN || 
                wsRef.current.readyState === WebSocket.CONNECTING) {
              wsRef.current.close();
            }
          } catch (error) {
            console.error('Error closing existing WebSocket:', error);
          }
          wsRef.current = null;
        }
        
        setIsLoading(true);
        console.log('Connecting to terminal server at:', socketUrl);
        
        // Create new WebSocket connection
        const socket = new WebSocket(socketUrl);
        wsRef.current = socket;
        
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            console.warn('Connection attempt timed out');
            socket.close();
            // The close handler will handle reconnection
          }
        }, 10000); // 10 second connection timeout
        
        // Connection opened handler
        socket.addEventListener('open', () => {
          clearTimeout(connectionTimeout);
          console.log('Connected to terminal server');
          setConnected(true);
          setIsLoading(false);
          setReconnectAttempts(0); // Reset reconnect attempts on successful connection
          setLastPingTime(Date.now()); // Initialize ping time
          
          if (xtermRef.current) {
            xtermRef.current.writeln("\x1b[1;32mConnected to terminal server\x1b[0m");
            
            // Send initial terminal size
            if (xtermRef.current.rows && xtermRef.current.cols) {
              try {
                socket.send(JSON.stringify({
                  type: 'resize',
                  cols: xtermRef.current.cols,
                  rows: xtermRef.current.rows
                }));
              } catch (error) {
                console.error('Error sending initial resize:', error);
              }
            }
            
            // Request initial system info
            try {
              socket.send(JSON.stringify({ type: 'system', command: 'info' }));
            } catch (error) {
              console.error('Error sending system info request:', error);
            }
          }
        });
        
        // Set up keep-alive ping to prevent disconnections
        // Use a more reliable ping interval of 15 seconds (instead of 5)
        const pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            try {
              socket.send(JSON.stringify({ 
                type: 'ping',
                timestamp: Date.now() 
              }));
              console.log('Ping sent to server');
            } catch (e) {
              console.error('Error sending ping:', e);
              
              // If we can't send a ping, the connection might be dead
              // Let the health check handle reconnection
            }
          }
        }, 15000); // 15 seconds ping interval
        
        pingIntervalRef.current = pingInterval;
        
        // Handle incoming messages from terminal with improved error handling
        socket.addEventListener('message', (event) => {
          try {
            const message: TerminalMessage = JSON.parse(event.data);
            
            switch (message.type) {
              case 'output':
                if (xtermRef.current && message.data) {
                  xtermRef.current.write(message.data);
                }
                setIsLoading(false);
                break;
                
              case 'error':
                if (xtermRef.current && message.data) {
                  xtermRef.current.write(`\x1b[31m${message.data}\x1b[0m`);
                }
                setIsLoading(false);
                break;
                
              case 'system':
                // Handle system messages like current directory, username, etc.
                try {
                  if (message.data) {
                    const systemData = JSON.parse(message.data);
                    if (systemData.cwd) setCurrentDirectory(systemData.cwd);
                    if (systemData.user) setUsername(systemData.user);
                    if (systemData.hostname) setHostname(systemData.hostname);
                  }
                } catch (err) {
                  console.error('Failed to parse system data:', err);
                }
                break;
                
              case 'info':
                // Informational messages
                if (xtermRef.current && message.data) {
                  xtermRef.current.writeln(`\x1b[90m${message.data}\x1b[0m`);
                }
                break;
                
              case 'pong':
                // Keep-alive response
                console.log('Received pong from server');
                setLastPingTime(Date.now());
                break;
                
              case 'ping':
                // Server initiated ping, respond with pong
                if (socket.readyState === WebSocket.OPEN) {
                  try {
                    socket.send(JSON.stringify({ 
                      type: 'pong',
                      timestamp: message.timestamp
                    }));
                    console.log('Received ping from server, sent pong');
                    setLastPingTime(Date.now());
                  } catch (error) {
                    console.error('Error sending pong response:', error);
                  }
                }
                break;
                
              default:
                console.warn('Unknown message type received:', message.type);
            }
          } catch (error) {
            console.error('Failed to parse message from terminal server:', error, event.data);
            if (xtermRef.current) {
              xtermRef.current.writeln(`\x1b[31mError: Failed to parse server message\x1b[0m`);
            }
          }
        });
        
        // Handle connection closure with smarter reconnect logic
        socket.addEventListener('close', (event) => {
          clearTimeout(connectionTimeout);
          
          console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason || 'No reason provided'}`);
          setConnected(false);
          setIsLoading(false);
          
          // Clear ping interval
          if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
          }
          
          if (isUnmountingRef.current) {
            console.log('Component unmounting, not attempting reconnection');
            return;
          }
          
          if (xtermRef.current) {
            xtermRef.current.writeln("\x1b[1;31mDisconnected from terminal server\x1b[0m");
            
            // Don't retry indefinitely
            if (reconnectAttempts >= maxReconnectAttemptsRef.current) {
              xtermRef.current.writeln(`\x1b[1;31mMaximum reconnection attempts (${maxReconnectAttemptsRef.current}) reached. Please refresh the page.\x1b[0m`);
              return;
            }
            
            // Progressive backoff for reconnection attempts, with a cap
            // Start with 1s, then 2s, 4s, 8s, etc. up to 30s max
            const nextAttempt = Math.min(30, Math.pow(2, reconnectAttempts));
            xtermRef.current.writeln(`\x1b[90mReconnecting in ${nextAttempt} seconds (attempt ${reconnectAttempts + 1})...\x1b[0m`);
            
            // Update reconnect attempts
            setReconnectAttempts(prev => prev + 1);
            
            // Attempt to reconnect with progressive backoff
            const timeout = setTimeout(() => {
              if (!isUnmountingRef.current) {
                connectToTerminal();
              }
            }, nextAttempt * 1000);
            
            reconnectTimeoutRef.current = timeout;
          }
        });
        
        // Handle connection errors
        socket.addEventListener('error', (error) => {
          console.error('Terminal WebSocket error:', error);
          // Do not set isLoading false here, let the close handler deal with it
          if (xtermRef.current) {
            xtermRef.current.writeln(`\x1b[1;31mConnection error. Details: ${error.toString()}\x1b[0m`);
          }
          // Don't attempt reconnect here - the close handler will do that
        });
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
        setIsLoading(false);
        if (xtermRef.current) {
          xtermRef.current.writeln("\x1b[1;31mFailed to connect to terminal server.\x1b[0m");
          
          // Check if we've reached the maximum number of attempts
          if (reconnectAttempts >= maxReconnectAttemptsRef.current) {
            xtermRef.current.writeln(`\x1b[1;31mMaximum reconnection attempts (${maxReconnectAttemptsRef.current}) reached. Please refresh the page.\x1b[0m`);
            return;
          }
          
          // Progressive backoff as before
          const nextAttempt = Math.min(30, Math.pow(2, reconnectAttempts));
          xtermRef.current.writeln(`\x1b[90mRetrying in ${nextAttempt} seconds (attempt ${reconnectAttempts + 1})...\x1b[0m`);
        }
        
        // Update reconnect attempts
        setReconnectAttempts(prev => prev + 1);
        
        // Try to reconnect with progressive backoff
        if (!isUnmountingRef.current) {
          const timeout = setTimeout(() => {
            if (!isUnmountingRef.current) {
              connectToTerminal();
            }
          }, nextAttempt * 1000);
          
          reconnectTimeoutRef.current = timeout;
        }
      }
    };
    
    // Establish initial connection
    setIsLoading(true);
    connectToTerminal();
    
    // Cleanup on unmount
    return () => {
      isUnmountingRef.current = true;
      
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (error) {
          console.error('Error closing WebSocket during cleanup:', error);
        }
      }
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current);
      }
    };
  }, []);
  
  // Add network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored');
      if (xtermRef.current) {
        xtermRef.current.writeln("\x1b[32mNetwork connection restored, attempting to reconnect...\x1b[0m");
      }
      
      // Try to reconnect if we're not already connected
      if (!connected && wsRef.current?.readyState !== WebSocket.OPEN) {
        // Reset reconnect attempts when network comes back online
        setReconnectAttempts(0);
        
        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Reconnect after a short delay to ensure network is stable
        reconnectTimeoutRef.current = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN && !isUnmountingRef.current) {
            // Close existing socket if any
            if (wsRef.current) {
              try {
                wsRef.current.close();
              } catch (error) {
                console.error('Error closing socket during network recovery:', error);
              }
            }
            
            // Connect to terminal server
            setIsLoading(true);
            
            // Clear any existing connection check interval
            if (connectionCheckIntervalRef.current) {
              clearInterval(connectionCheckIntervalRef.current);
              connectionCheckIntervalRef.current = null;
            }
            
            // Connect to terminal server (reuse existing function)
            if (!isUnmountingRef.current) {
              // Get the connectToTerminal function
              const event = new Event('reconnect-terminal');
              window.dispatchEvent(event);
            }
          }
        }, 1000);
      }
    };
    
    const handleOffline = () => {
      console.log('Network connection lost');
      if (xtermRef.current) {
        xtermRef.current.writeln("\x1b[31mNetwork connection lost. Waiting for connection to restore...\x1b[0m");
      }
      
      // Update UI to show disconnected state
      setConnected(false);
      setIsLoading(false);
    };
    
    // Listen for reconnect-terminal events (custom event to trigger reconnection)
    const handleReconnectTerminal = () => {
      // Force reconnection by closing the WebSocket
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (error) {
          console.error('Error closing socket during forced reconnection:', error);
        }
      }
      
      // Reset reconnect attempts for a fresh start
      setReconnectAttempts(0);
      
      // Connect to terminal server
      setIsLoading(true);
      
      // Clear any existing connection check interval
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current);
        connectionCheckIntervalRef.current = null;
      }
      
      // Trigger the effect that contains connectToTerminal
      setIsLoading(prev => {
        // This is a trick to re-trigger the connection effect
        setTimeout(() => setIsLoading(true), 0);
        return false;
      });
    };
    
    // Register event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('reconnect-terminal', handleReconnectTerminal);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('reconnect-terminal', handleReconnectTerminal);
    };
  }, [connected]);

  const copyToClipboard = () => {
    if (xtermRef.current) {
      const selection = xtermRef.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            if (xtermRef.current) {
              xtermRef.current.writeln("\x1b[31mFailed to copy selection to clipboard\x1b[0m");
            }
          });
      }
    }
  };
  
  const handleReconnectClick = () => {
    // Manually trigger reconnection
    window.dispatchEvent(new Event('reconnect-terminal'));
  };

  return (
    <div className={`absolute bottom-6 z-10 min-w-full right-0 bg-[#1e1e1e] border border-[#3c3c3c] rounded-md transition-all duration-300 ${
      isMinimized ? 'h-9' : 'sm:h-72 h-60'
    }`}>
      {/* Terminal Header */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 border-b border-[#3c3c3c] rounded-t-md">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 font-medium text-sm">
            {username}@{hostname}:{currentDirectory}
            {!connected && <span className="text-red-400 ml-2">(disconnected)</span>}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {isLoading && <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
          {!connected && (
            <button 
              onClick={handleReconnectClick} 
              className="hover:bg-[#4c4c4c] p-1 rounded transition-colors group"
              aria-label="Force reconnect"
            >
              <RefreshCw className="w-3 h-3 text-gray-400 group-hover:text-gray-200 transition-colors" />
            </button>
          )}
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
        <div className="h-[calc(100%-36px)] overflow-hidden p-1 font-mono text-sm">
          <div 
            ref={terminalRef} 
            className="w-full h-full" 
          />
        </div>
      )}
    </div>
  );
};

export default TerminalSection;