const WebSocket = require('ws');
const pty = require('@lydell/node-pty');
const os = require('os');
const path = require('path');

// Terminal server configuration
const PORT = process.env.PORT || 4000;
const SHELL = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const HOME_DIR = os.homedir();

// Debug mode for verbose logging
const DEBUG = true;

// Log function with timestamp
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMethod = isError ? console.error : console.log;
  logMethod(`[${timestamp}] ${message}`);
}

// Create WebSocket server with ping timeout
const wss = new WebSocket.Server({ 
  port: PORT,
  // Increase timeout values
  pingTimeout: 60000,
  pingInterval: 25000
});

log(`Terminal WebSocket server started on port ${PORT}`);

// Ping all clients every 25 seconds to keep connections alive
const pingInterval = setInterval(() => {
  log('Pinging all clients...');
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      log('Terminating inactive client', true);
      return ws.terminate();
    }

    ws.isAlive = false;
    try {
      ws.ping();
      // Also send a custom ping message
      ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    } catch (err) {
      log(`Error pinging client: ${err.message}`, true);
      // Don't terminate here, let the next cycle handle it
    }
  });
}, 25000);

wss.on('close', () => {
  log('WebSocket server closing');
  clearInterval(pingInterval);
});

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  log(`New client connected from ${clientIp}`);
  
  // Mark client as alive initially
  ws.isAlive = true;
  
  // Respond to pong from ping
  ws.on('pong', () => {
    ws.isAlive = true;
    if (DEBUG) log(`Received pong from client ${clientIp}`);
  });
  
  // Create terminal process with explicit options
  const ptyProcess = pty.spawn(SHELL, [], {
    name: 'xterm-color',
    cols: 100, // Start with a larger terminal
    rows: 30,
    cwd: HOME_DIR,
    env: { ...process.env, TERM: 'xterm-color' }
  });
  
  log(`Created PTY process with PID: ${ptyProcess.pid}`);
  
  // Handle terminal data
  ptyProcess.onData((data) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'output',
          data: data
        }));
      } catch (err) {
        log(`Error sending terminal output: ${err.message}`, true);
      }
    }
  });
  
  // Handle terminal exit
  ptyProcess.onExit(({ exitCode, signal }) => {
    log(`Terminal process exited with code ${exitCode} and signal ${signal}`);
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'info',
          data: `Terminal process exited with code ${exitCode}`
        }));
      } catch (err) {
        log(`Error sending terminal exit message: ${err.message}`, true);
      }
    }
  });
  
  // Initial system info
  try {
    const systemInfo = {
      cwd: process.cwd(),
      user: os.userInfo().username,
      hostname: os.hostname(),
      platform: os.platform(),
      shell: SHELL,
      pid: ptyProcess.pid
    };
    
    ws.send(JSON.stringify({
      type: 'system',
      data: JSON.stringify(systemInfo)
    }));
    
    ws.send(JSON.stringify({
      type: 'info',
      data: 'Terminal session started'
    }));
  } catch (err) {
    log(`Error sending initial messages: ${err.message}`, true);
  }
  
  // Handle client messages
  ws.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      
      if (DEBUG) log(`Received message type: ${message.type}`);
      
      switch (message.type) {
        case 'input':
          ptyProcess.write(message.data);
          break;
          
        case 'resize':
          if (message.cols && message.rows) {
            if (DEBUG) log(`Resizing terminal to ${message.cols}x${message.rows}`);
            ptyProcess.resize(message.cols, message.rows);
          }
          break;
          
        case 'system':
          if (message.command === 'info') {
            const systemInfo = {
              cwd: process.cwd(),
              user: os.userInfo().username,
              hostname: os.hostname(),
              platform: os.platform(),
              shell: SHELL,
              pid: ptyProcess.pid
            };
            
            ws.send(JSON.stringify({
              type: 'system',
              data: JSON.stringify(systemInfo)
            }));
          }
          break;
          
        case 'ping':
          ws.isAlive = true;
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        case 'completion':
          ptyProcess.write('\t');
          break;
          
        default:
          log(`Unknown message type: ${message.type}`, true);
      }
    } catch (err) {
      log(`Error processing client message: ${err.message}`, true);
      try {
        ws.send(JSON.stringify({
          type: 'error',
          data: `Server error: ${err.message}`
        }));
      } catch (sendErr) {
        log(`Failed to send error message: ${sendErr.message}`, true);
      }
    }
  });
  
  // Handle client disconnect
  ws.on('close', (code, reason) => {
    log(`Client ${clientIp} disconnected with code ${code}, reason: ${reason || 'unknown'}`);
    try {
      ptyProcess.kill();
      log(`Killed PTY process ${ptyProcess.pid}`);
    } catch (err) {
      log(`Error killing PTY process: ${err.message}`, true);
    }
  });
  
  // Handle connection errors
  ws.on('error', (err) => {
    log(`WebSocket error for client ${clientIp}: ${err.message}`, true);
    try {
      ptyProcess.kill();
    } catch (killErr) {
      log(`Error killing PTY process: ${killErr.message}`, true);
    }
  });
});

// Handle server errors
wss.on('error', (err) => {
  log(`WebSocket server error: ${err.message}`, true);
});

// Handle process signals
process.on('SIGINT', () => {
  log('Received SIGINT signal, shutting down');
  wss.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM signal, shutting down');
  wss.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.message}`, true);
  log(err.stack, true);
  // Keep the server running despite exceptions
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled promise rejection: ${reason}`, true);
  // Keep the server running despite rejections
});

log(`Terminal server running on ws://localhost:${PORT}`);
