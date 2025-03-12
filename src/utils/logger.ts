const DEBUG = true;

export const logger = {
  log: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  info: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  
  // Special logger for file system operations
  fileSystem: (operation: string, path: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[FILE SYSTEM] ${operation}: ${path}`, ...args);
    }
  }
};

export default logger;
