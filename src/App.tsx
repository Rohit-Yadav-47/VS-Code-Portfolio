import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileCode, FolderOpen, Folder, Search, PlusCircle, 
  Save, Download, ChevronDown, ChevronRight
} from 'lucide-react';

// Component imports
import MenuBar from './components/layout/MenuBar';
import ActivityBar from './components/layout/ActivityBar';
import Explorer from './components/layout/Explorer';
import EditorTabs from './components/layout/EditorTabs';
import StatusBar from './components/layout/StatusBar';
import Breadcrumbs from './components/layout/Breadcrumbs';

import TerminalSection from './components/content/TerminalSection';
import Notification from './components/ui/Notification';
import Copilot from './components/ui/Copilot';
import CodeEditor from './components/content/CodeEditor';

// Import path utilities
import * as pathUtils from './utils/pathUtils';

// File system types
interface FileData {
  name: string;
  content: string;
  language: string;
  path: string;
  lastSaved?: Date;
  fileHandle?: FileSystemFileHandle;
  isDirectory?: boolean;
}

// Constants
const PYTHON_FOLDER_NAME = 'python';

function App() {
  const [activeSection, setActiveSection] = useState('main');
  const [expandedItems, setExpandedItems] = useState<string[]>(['OPEN_EDITORS', 'PYTHON_FILES']);
  const [activeTabs, setActiveTabs] = useState<string[]>(['main.py']);
  const [searchQuery, setSearchQuery] = useState('');
  const [animateContent, setAnimateContent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showMinimap, setShowMinimap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [gitBranch, setGitBranch] = useState('main');
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [hasFileSystemAccess, setHasFileSystemAccess] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState<FileSystemDirectoryHandle | null>(null);
  const [pythonFolderHandle, setPythonFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
  
  const [files, setFiles] = useState<FileData[]>([
    {
      name: 'main.py',
      content: '# Welcome to the Python editor\n\nprint("Hello, world!")',
      language: 'python',
      path: `/${PYTHON_FOLDER_NAME}/main.py`
    }
  ]);
  
  // Current active file - set to Python file
  const [activeFile, setActiveFile] = useState('main.py');
  
  useEffect(() => {
    setAnimateContent(true);
    const timer = setTimeout(() => setAnimateContent(false), 300);
    return () => clearTimeout(timer);
  }, [activeFile]);

  // Check for File System Access API support
  useEffect(() => {
    const checkFileSystemSupport = () => {
      if ('showDirectoryPicker' in window) {
        setHasFileSystemAccess(true);
      } else {
        showToast("Your browser doesn't support the File System Access API");
      }
    };
    
    checkFileSystemSupport();
  }, []);

  // Function to ensure the Python folder exists
  const ensurePythonFolder = async (directoryHandle: FileSystemDirectoryHandle): Promise<FileSystemDirectoryHandle> => {
    try {
      // Try to get the Python folder handle
      try {
        // @ts-ignore - TypeScript might not recognize the API
        return await directoryHandle.getDirectoryHandle(PYTHON_FOLDER_NAME, { create: true });
      } catch (err) {
        console.error(`Failed to create ${PYTHON_FOLDER_NAME} folder:`, err);
        showToast(`Failed to create ${PYTHON_FOLDER_NAME} folder. Using root directory instead.`);
        return directoryHandle; // Fallback to root if we can't create the Python folder
      }
    } catch (err) {
      console.error('Error in ensurePythonFolder:', err);
      return directoryHandle; // Fallback to root
    }
  };

  // Function to walk the file tree (similar to file.walk)
  const walkDirectory = async (dirHandle: FileSystemDirectoryHandle, callback: (dirPath: string, dirs: string[], files: string[]) => void, currentPath: string = '/'): Promise<void> => {
    const directories: string[] = [];
    const files: string[] = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        directories.push(entry.name);
      } else if (entry.kind === 'file') {
        files.push(entry.name);
      }
    }

    callback(currentPath, directories, files);

    for (const dirName of directories) {
      try {
        // @ts-ignore
        const subDirHandle = await dirHandle.getDirectoryHandle(dirName);
        await walkDirectory(subDirHandle, callback, `${currentPath}/${dirName}`);
      } catch (err) {
        console.error(`Error walking subdirectory ${dirName}:`, err);
      }
    }
  };

  // Function to create directories recursively (similar to file.mkdirs)
  const createDirectories = async (dirHandle: FileSystemDirectoryHandle, path: string): Promise<FileSystemDirectoryHandle> => {
    const pathParts = path.split('/').filter(Boolean);
    let currentDir = dirHandle;

    for (const dirName of pathParts) {
      try {
        // @ts-ignore
        currentDir = await currentDir.getDirectoryHandle(dirName, { create: true });
        console.log(`Created directory: ${dirName}`);
      } catch (err) {
        console.error(`Error creating directory ${dirName}:`, err);
        throw err; // Re-throw to stop further directory creation
      }
    }

    return currentDir;
  };

  // Function to open a directory picker
  const openDirectory = async () => {
    try {
      if (!hasFileSystemAccess) {
        showToast("Your browser doesn't support the File System Access API");
        return;
      }
      
      // @ts-ignore - TypeScript might not recognize the showDirectoryPicker API
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      
      setCurrentDirectory(dirHandle);
      showToast(`Opened directory: ${dirHandle.name}`);
      
      // Create or get the Python folder
      try {
        // @ts-ignore
        const pythonFolder = await dirHandle.getDirectoryHandle(PYTHON_FOLDER_NAME, { create: true });
        setPythonFolderHandle(pythonFolder);
        showToast(`Using ${PYTHON_FOLDER_NAME} folder for Python files`);
        
        // Read files from the Python folder
        const loadedFiles = await loadFilesFromPythonFolder(pythonFolder);
        
        if (loadedFiles.length > 0) {
          setFiles(loadedFiles);
          
          // Find first actual file (not directory) to open by default
          const firstFile = loadedFiles.find(file => !file.isDirectory);
          if (firstFile) {
            setActiveFile(firstFile.name);
            setActiveTabs([firstFile.name]);
          }
          
          showToast(`Loaded ${loadedFiles.filter(f => !f.isDirectory).length} Python files`);
        } else {
          // Create a default Python file if the folder is empty
          const defaultFile = {
            name: 'main.py',
            content: '# Welcome to Python Editor\n\ndef main():\n    print("Hello, world!")\n\nif __name__ == "__main__":\n    main()',
            language: 'python',
            path: `/${PYTHON_FOLDER_NAME}/main.py`
          };
          
          setFiles([defaultFile]);
          setActiveFile('main.py');
          setActiveTabs(['main.py']);
          
          // Save the default file to the filesystem
          await saveFile(defaultFile);
          showToast('Created default Python file');
        }

        // Example of using walkDirectory
        if (pythonFolderHandle) {
          await walkDirectory(pythonFolderHandle, (dirPath, dirs, files) => {
            console.log(`Directory: ${dirPath}`);
            console.log(`Subdirectories: ${dirs.join(', ')}`);
            console.log(`Files: ${files.join(', ')}`);
          });
        }

        // Example of using createDirectories
        if (pythonFolderHandle) {
          try {
            await createDirectories(pythonFolderHandle, 'test/this/path');
            showToast('Created directories test/this/path');
          } catch (err) {
            showToast(`Error creating directories: ${(err as Error).message}`);
          }
        }
      } catch (err) {
        console.error(`Error creating/accessing ${PYTHON_FOLDER_NAME} folder:`, err);
        showToast(`Error: ${(err as Error).message}`);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') { // Ignore if user canceled
        console.error('Error opening directory:', err);
        showToast(`Error opening directory: ${(err as Error).message}`);
      }
    }
  };

  // Function to load files from the Python folder only
  const loadFilesFromPythonFolder = async (folderHandle: FileSystemDirectoryHandle) => {
    try {
      const newFiles: FileData[] = [];
      const basePath = `/${PYTHON_FOLDER_NAME}`;
      
      // Iterate through all files in the Python folder
      for await (const entry of folderHandle.values()) {
        const entryPath = `${basePath}/${entry.name}`;
        
        if (entry.kind === 'file' && entry.name.endsWith('.py')) {
          try {
            const file = await entry.getFile();
            const content = await file.text();
            
            newFiles.push({
              name: entry.name,
              content: content,
              language: 'python',
              path: entryPath,
              lastSaved: new Date(file.lastModified),
              fileHandle: entry
            });
          } catch (err) {
            console.error(`Error reading file ${entry.name}:`, err);
          }
        } 
        else if (entry.kind === 'directory') {
          // Add the directory itself
          newFiles.push({
            name: entry.name,
            content: '',
            language: '',
            path: entryPath,
            isDirectory: true
          });
          
          // Recursively load subdirectories
          try {
            const subDirFiles = await loadFilesFromSubdirectory(entry, entryPath);
            newFiles.push(...subDirFiles);
          } catch (err) {
            console.error(`Error reading subdirectory ${entry.name}:`, err);
          }
        }
      }
      
      return newFiles;
    } catch (err) {
      console.error('Error loading files:', err);
      showToast(`Error loading files: ${(err as Error).message}`);
      return [];
    }
  };
  
  // Function to load files from subdirectories within the Python folder
  const loadFilesFromSubdirectory = async (dirHandle: FileSystemDirectoryHandle, basePath: string) => {
    try {
      const files: FileData[] = [];
      
      for await (const entry of dirHandle.values()) {
        const entryPath = `${basePath}/${entry.name}`;
        
        if (entry.kind === 'file' && entry.name.endsWith('.py')) {
          try {
            const file = await entry.getFile();
            const content = await file.text();
            
            files.push({
              name: entry.name,
              content: content,
              language: 'python',
              path: entryPath,
              lastSaved: new Date(file.lastModified),
              fileHandle: entry
            });
          } catch (err) {
            console.error(`Error reading file ${entry.name}:`, err);
          }
        } 
        else if (entry.kind === 'directory') {
          // Add the directory itself
          files.push({
            name: entry.name,
            content: '',
            language: '',
            path: entryPath,
            isDirectory: true
          });
          
          // Recursively load subdirectories
          try {
            // @ts-ignore
            const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
            const subDirFiles = await loadFilesFromSubdirectory(subDirHandle, entryPath);
            files.push(...subDirFiles);
          } catch (err) {
            console.error(`Error reading subdirectory ${entry.name}:`, err);
          }
        }
      }
      
      return files;
    } catch (err) {
      console.error('Error loading files from subdirectory:', err);
      return [];
    }
  };

  // Function to save the current file
  const saveFile = async (fileData: FileData) => {
    try {
      console.log('saveFile called for:', fileData.path);
      
      if (!pythonFolderHandle) {
        showToast(`No ${PYTHON_FOLDER_NAME} folder available. Please open a directory first.`);
        return false;
      }
      
      if (!fileData.name.endsWith('.py')) {
        showToast("Only Python files (.py) can be saved");
        return false;
      }
      
      // Use path utilities to get path components
      const pathParts = pathUtils.splitPath(fileData.path);
      const fileName = pathUtils.filename(fileData.path);
      let currentDir = pythonFolderHandle;
      
      console.log('Path parts for save:', pathParts);
      console.log('File name to save:', fileName);
      
      // Skip the first segment if it's the Python folder name
      const startIndex = pathParts[0] === PYTHON_FOLDER_NAME ? 1 : 0;
      
      // Navigate to the correct subdirectory (if any)
      for (let i = startIndex; i < pathParts.length - 1; i++) {
        const segment = pathParts[i];
        try {
          console.log(`Accessing/creating directory for save: "${segment}"`);
          // @ts-ignore
          currentDir = await currentDir.getDirectoryHandle(segment, { create: true });
          console.log(`Created/accessed directory for save: ${segment}`);
        } catch (err) {
          console.error(`Failed to create/access directory ${segment}:`, err);
          showToast(`Error creating directory ${segment}: ${(err as Error).message}`);
          return false;
        }
      }
      
      let fileHandle: FileSystemFileHandle;
      
      try {
        if (fileData.fileHandle) {
          // If we already have a handle, use it
          fileHandle = fileData.fileHandle;
          console.log('Using existing file handle');
        } else {
          console.log('Creating new file handle for:', fileName);
          // @ts-ignore
          fileHandle = await currentDir.getFileHandle(fileName, { create: true });
          console.log('Created new file handle successfully');
          
          // Update the fileHandle in our state
          setFiles(prevFiles => 
            prevFiles.map(file => 
              file.path === fileData.path ? { ...file, fileHandle } : file
            )
          );
        }
        
        // Create a writable stream and write the content
        console.log('Creating writable stream for file');
        const writable = await fileHandle.createWritable();
        console.log('Writing content to file');
        await writable.write(fileData.content);
        console.log('Closing writable stream');
        await writable.close();
        
        // Update the lastSaved timestamp
        const now = new Date();
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.path === fileData.path ? { ...file, lastSaved: now, fileHandle } : file
          )
        );
        
        showToast(`File ${fileData.name} saved successfully`);
        return true;
      } catch (err) {
        console.error('Error writing to file:', err);
        showToast(`Error writing to file: ${(err as Error).message}`);
        return false;
      }
    } catch (err) {
      console.error('Error saving file:', err);
      showToast(`Error saving file: ${(err as Error).message}`);
      return false;
    }
  };

  // Function to save all open files
  const saveAllFiles = async () => {
    let successCount = 0;
    for (const file of files) {
      if (!file.isDirectory && file.name.endsWith('.py')) {
        const success = await saveFile(file);
        if (success) successCount++;
      }
    }
    
    if (successCount > 0) {
      showToast(`Saved ${successCount} Python files successfully`);
    }
  };

  // Function to update file content
  const updateFileContent = useCallback((fileName: string, newContent: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === fileName ? { ...file, content: newContent } : file
      )
    );
    
    // If auto-save is enabled and we have a real file handle, save after a short delay
    if (autoSave) {
      const fileData = files.find(f => f.name === fileName);
      if (fileData && fileData.fileHandle && pythonFolderHandle) {
        const debounceTimer = setTimeout(async () => {
          await saveFile(fileData);
        }, 1000); // 1-second debounce
        
        return () => clearTimeout(debounceTimer);
      }
    }
  }, [files, autoSave, pythonFolderHandle]);

  // Improved path joining function similar to file.path.join
  const pathJoin = (base: string, path: string): string => {
    if (!base) return path;
    if (!path) return base;
    
    const baseEndsWithSlash = base.endsWith('/');
    const pathStartsWithSlash = path.startsWith('/');
    
    if (baseEndsWithSlash && pathStartsWithSlash) {
      return base + path.substring(1);
    } else if (!baseEndsWithSlash && !pathStartsWithSlash) {
      return `${base}/${path}`;
    } else {
      return base + path;
    }
  };

  // Enhanced function to normalize paths
  const normalizePath = (path: string): string => {
    // Ensure path starts with a slash
    const startWithSlash = path.startsWith('/') ? path : `/${path}`;
    // Remove double slashes and trailing slash
    return startWithSlash.replace(/\/+/g, '/').replace(/\/$/, '');
  };

  // Function to get relative path similar to file.path.relativePath
  const getRelativePath = (rootPath: string, fullPath: string): string => {
    const normalizedRoot = normalizePath(rootPath);
    const normalizedFull = normalizePath(fullPath);
    
    if (normalizedFull.startsWith(normalizedRoot)) {
      const relativePath = normalizedFull.substring(normalizedRoot.length);
      return relativePath || '/';
    }
    
    return fullPath; // If not a subpath, return original
  };

  // Enhanced function to create a new file at a specific path
  const createNewFile = async (fileName: string, fileType: string = 'py', dirPath: string = '') => {
    console.log('createNewFile called with:', { fileName, fileType, dirPath });
    
    // Only allow Python files
    if (fileType !== 'py') {
      showToast("Currently only Python files are supported");
      fileType = 'py';
    }
    
    // Generate appropriate file extension if not in the name
    const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${fileType}`;
    
    // Default content for Python files - more useful template
    const defaultContent = `# ${fullFileName}
# Created: ${new Date().toLocaleString()}

def main():
    print("Hello from ${fullFileName}")
    
    # Your code here
    
if __name__ == "__main__":
    main()
`;
    
    const language = 'python';
    
    // Normalize the paths using our path utilities
    const pythonRoot = `/${PYTHON_FOLDER_NAME}`;
    let filePath: string;
    
    if (dirPath) {
      if (dirPath.startsWith(pythonRoot)) {
        filePath = pathUtils.join(dirPath, fullFileName);
      } else {
        filePath = pathUtils.join(pythonRoot, pathUtils.join(dirPath, fullFileName));
      }
    } else {
      filePath = pathUtils.join(pythonRoot, fullFileName);
    }
    
    // Normalize the final path
    filePath = pathUtils.normalize(filePath);
    console.log('Normalized file path:', filePath);
    
    // Check if file already exists at the path
    if (files.some(file => file.path === filePath)) {
      showToast(`File ${fullFileName} already exists at this location`);
      return;
    }
    
    // Create new file
    const newFile: FileData = {
      name: fullFileName,
      content: defaultContent,
      language,
      path: filePath
    };
    
    // Update UI first
    setFiles(prev => [...prev, newFile]);
    addTab(fullFileName);
    setActiveFile(fullFileName);
    
    // If we have a Python folder open, try to save the file immediately
    if (pythonFolderHandle) {
      try {
        console.log('Ensuring directory exists for path:', filePath);
        // Ensure parent directory exists first
        const parentDirPath = pathUtils.dirname(filePath);
        const relativeDirPath = pathUtils.relativePath(`/${PYTHON_FOLDER_NAME}`, parentDirPath);
        console.log('Parent directory path:', parentDirPath);
        console.log('Relative directory path:', relativeDirPath);
        
        // Create directory path if needed
        if (relativeDirPath !== '/') {
          await createDirectories(pythonFolderHandle, relativeDirPath.substring(1)); // Remove leading slash
        }
        
        // Then save the file
        console.log('Saving file with path:', filePath);
        const success = await saveFile(newFile);
        console.log('File saved successfully:', success);
        
        if (success) {
          showToast(`Created and saved ${fullFileName}`);
          
          // Refresh the file list to update any filehandles
          const updatedFiles = await loadFilesFromPythonFolder(pythonFolderHandle);
          setFiles(prev => {
            // Preserve the currently edited file content
            const currentEditedFile = prev.find(f => f.path === filePath);
            return updatedFiles.map(f => 
              f.path === filePath && currentEditedFile 
                ? {...f, content: currentEditedFile.content} 
                : f
            );
          });
        } else {
          showToast(`Created ${fullFileName} but failed to save to filesystem`);
        }
      } catch (err) {
        console.error('Error creating file:', err);
        showToast(`Error creating file: ${(err as Error).message}`);
      }
    } else {
      showToast(`Created ${fullFileName} (not saved to filesystem)`);
    }
  };

  // Enhanced function to ensure a directory path exists
  const ensureDirectoryExists = async (filePath: string): Promise<FileSystemDirectoryHandle | null> => {
    if (!pythonFolderHandle) return null;
    
    try {
      console.log('ensureDirectoryExists for path:', filePath);
      // Parse the path to get directory segments
      const pathParts = filePath.split('/').filter(Boolean);
      
      // Remove the filename from the end and the Python folder from the start
      const dirSegments = pathParts.slice(1, -1); // Skip python folder and filename
      
      console.log('Directory segments to create:', dirSegments);
      
      if (dirSegments.length === 0) {
        // No directories to create, file is directly in python folder
        console.log('No directories to create, file will be in Python folder root');
        return pythonFolderHandle;
      }
      
      let currentDir = pythonFolderHandle;
      let createdDirs = false;
      
      // Create each directory level if it doesn't exist
      for (let i = 0; i < dirSegments.length; i++) {
        const segment = dirSegments[i];
        try {
          console.log(`Creating directory segment: "${segment}"`);
          // @ts-ignore
          currentDir = await currentDir.getDirectoryHandle(segment, { create: true });
          createdDirs = true;
          console.log(`Successfully created/accessed directory: ${segment}`);
        } catch (err) {
          console.error(`Error creating directory ${segment}:`, err);
          showToast(`Error creating directory ${segment}: ${(err as Error).message}`);
          return null;
        }
      }
      
      if (createdDirs) {
        console.log('Created directory structure successfully');
        // Refresh file list to show the new directory structure
        const updatedFiles = await loadFilesFromPythonFolder(pythonFolderHandle);
        setFiles(prev => {
          // Preserve currently edited files
          const editedFiles = prev.filter(f => !f.isDirectory && !updatedFiles.some(u => u.path === f.path));
          return [...updatedFiles, ...editedFiles];
        });
      }
      
      return currentDir;
    } catch (err) {
      console.error('Error ensuring directory exists:', err);
      return null;
    }
  };

  // Function to create a new folder in the current directory
  const createNewFolder = async (folderName: string, parentPath: string = '') => {
    try {
      if (!pythonFolderHandle) {
        showToast(`No ${PYTHON_FOLDER_NAME} folder available. Please open a directory first.`);
        return false;
      }

      if (!folderName) {
        showToast("Please provide a folder name");
        return false;
      }

      console.log('Creating folder:', folderName, 'at parent path:', parentPath);
      
      // Start with the Python folder
      let currentDir = pythonFolderHandle;
      
      // Process parent path to make sure it's relative to the Python folder
      if (parentPath) {
        const pathSegments = parentPath.split('/').filter(Boolean);
        
        // Skip the Python folder name if it's the first segment
        const startIndex = pathSegments[0] === PYTHON_FOLDER_NAME ? 1 : 0;
        
        // Navigate to each directory segment
        for (let i = startIndex; i < pathSegments.length; i++) {
          try {
            // @ts-ignore
            currentDir = await currentDir.getDirectoryHandle(pathSegments[i], { create: true });
            console.log(`Navigated to directory: ${pathSegments[i]}`);
          } catch (err) {
            console.error(`Error navigating to directory ${pathSegments[i]}:`, err);
            showToast(`Error navigating to directory ${pathSegments[i]}: ${(err as Error).message}`);
            return false;
          }
        }
      }

      // Create the new folder in the current directory
      try {
        // @ts-ignore
        await currentDir.getDirectoryHandle(folderName, { create: true });
        console.log('Created folder:', folderName);
        
        // Construct the full path for the UI
        let fullPath: string;
        if (parentPath) {
          if (parentPath.startsWith(`/${PYTHON_FOLDER_NAME}`)) {
            fullPath = `${parentPath}/${folderName}`;
          } else {
            fullPath = `/${PYTHON_FOLDER_NAME}${parentPath}/${folderName}`;
          }
        } else {
          fullPath = `/${PYTHON_FOLDER_NAME}/${folderName}`;
        }
        
        // Add to the files state
        const newFolderData: FileData = {
          name: folderName,
          content: '',
          language: '',
          path: fullPath,
          isDirectory: true
        };
        
        setFiles(prev => [...prev, newFolderData]);
        showToast(`Created folder: ${folderName}`);
        
        // Refresh the file list to ensure we have the latest structure
        if (pythonFolderHandle) {
          const updatedFiles = await loadFilesFromPythonFolder(pythonFolderHandle);
          setFiles(updatedFiles);
        }
        
        return true;
      } catch (err) {
        console.error('Error creating folder:', err);
        showToast(`Error creating folder: ${(err as Error).message}`);
        return false;
      }
    } catch (err) {
      console.error('Error in createNewFolder:', err);
      showToast(`Error creating folder: ${(err as Error).message}`);
      return false;
    }
  };

  // Function to delete a file
  const deleteFile = async (fileName: string, filePath: string) => {
    try {
      console.log('Deleting file:', fileName, 'at path:', filePath);
      
      // If we have a Python folder handle, try to delete the actual file
      if (pythonFolderHandle && filePath) {
        // Find file from path
        const fileToDelete = files.find(file => file.path === filePath);
        
        if (fileToDelete && fileToDelete.fileHandle) {
          try {
            // Delete the file from the filesystem
            // @ts-ignore
            await fileToDelete.fileHandle.remove();
            console.log('File deleted from filesystem');
            showToast(`Deleted ${fileName} from filesystem`);
          } catch (err) {
            console.error('Error deleting file from filesystem:', err);
          }
        } else {
          // If we don't have a file handle, try to navigate to the file and delete it
          try {
            const pathSegments = filePath.split('/').filter(Boolean);
            
            // Skip the Python folder name if it's the first segment
            const startIndex = pathSegments[0] === PYTHON_FOLDER_NAME ? 1 : 0;
            
            // The last segment is the file name
            const targetFileName = pathSegments[pathSegments.length - 1];
            let currentDir = pythonFolderHandle;
            
            // Navigate to the directory containing the file
            for (let i = startIndex; i < pathSegments.length - 1; i++) {
              // @ts-ignore
              currentDir = await currentDir.getDirectoryHandle(pathSegments[i]);
            }
            
            // Now try to delete the file
            // @ts-ignore
            const fileHandle = await currentDir.getFileHandle(targetFileName);
            // @ts-ignore
            await fileHandle.remove();
            console.log('File deleted using path navigation');
            showToast(`Deleted ${fileName} from filesystem`);
          } catch (err) {
            console.error('Error deleting file using path navigation:', err);
          }
        }
      }
      
      // Handle UI updates
      // Check if file is active and if there are other tabs
      if (activeFile === fileName && activeTabs.length > 1) {
        const newActiveTabs = activeTabs.filter(tab => tab !== fileName);
        setActiveTabs(newActiveTabs);
        setActiveFile(newActiveTabs[0]);
      } else if (activeFile === fileName) {
        // If it's the only tab, create a new default Python file
        createNewFile('untitled', 'py');
        setActiveTabs(['untitled.py']);
        setActiveFile('untitled.py');
      }
      
      // Remove from tabs if it exists
      if (activeTabs.includes(fileName)) {
        setActiveTabs(activeTabs.filter(tab => tab !== fileName));
      }
      
      // Remove the file from state
      setFiles(files.filter(file => file.path !== filePath));
      
      // Refresh the file list to ensure we have the latest structure
      if (pythonFolderHandle) {
        const updatedFiles = await loadFilesFromPythonFolder(pythonFolderHandle);
        setFiles(updatedFiles);
      }
      
    } catch (err) {
      console.error('Error during file deletion:', err);
      showToast(`Error deleting file: ${(err as Error).message}`);
    }
  };

  const toggleExpand = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const addTab = (fileName: string, filePath?: string) => {
    if (!activeTabs.includes(fileName)) {
      setActiveTabs([...activeTabs, fileName]);
    }
    setActiveFile(fileName);
  };

  const closeTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = activeTabs.filter(tab => tab !== fileName);
    setActiveTabs(newTabs);
    if (newTabs.length > 0 && activeFile === fileName) {
      setActiveFile(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      // If all tabs are closed, create a default file
      createNewFile('untitled', 'py');
      setActiveTabs(['untitled.py']);
      setActiveFile('untitled.py');
    }
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Get the currently active file data
  const currentFileData = files.find(file => file.name === activeFile) || files[0];

  return (
    <div className="h-screen bg-[#1e1e1e] text-gray-300 flex flex-col overflow-hidden">
      {/* Notification */}
      {showNotification && (
        <Notification message={notificationMessage} />
      )}
      
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <MenuBar />
      </div>

      {/* Content area */}
      <div className="flex flex-1 pt-8 overflow-hidden">
        <ActivityBar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          errorCount={errorCount}
          warningCount={warningCount}
        />

        <Explorer 
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          files={files}
          addTab={addTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          createNewFile={createNewFile}
          deleteFile={deleteFile}
          createNewFolder={createNewFolder}
        />

        <div className="flex-1 relative flex flex-col">
          <div className="ml-72 flex flex-1 flex-col h-full relative">
            <EditorTabs 
              activeTabs={activeTabs}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              closeTab={closeTab}
              files={files}
            />
            
            {showBreadcrumbs && (
              <Breadcrumbs activeSection={currentFileData.path} />
            )}

            {/* Scrollable content area with proper padding */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-0 relative">
              {/* Add VS Code-like indent guides */}
              <div className="absolute top-0 left-12 bottom-0 w-6 flex flex-col items-center z-0 pointer-events-none">
                <div className="h-full w-px bg-[#3c3c3c] opacity-30"></div>
              </div>
              
              {/* Code Editor takes full space */}
              <div className="h-full">
                <CodeEditor 
                  activeFile={activeFile}
                  content={currentFileData.content}
                  language={currentFileData.language}
                  showLineNumbers={showLineNumbers}
                  onChange={(newContent) => updateFileContent(activeFile, newContent)}
                />
              </div>
            </div>

            {/* Terminal Section */}
            <TerminalSection />
          </div>

          {/* Minimap overlay */}
          {showMinimap && (
            <Copilot />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar 
        gitBranch={gitBranch}
        errorCount={errorCount}
        warningCount={warningCount}
        language={currentFileData.language}
        fileName={activeFile}
        lastSaved={currentFileData.lastSaved}
        autoSave={autoSave}
        hasFileAccess={!!pythonFolderHandle}
        onSave={() => saveFile(currentFileData)}
      />

      {/* Global styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #777;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        body {
          overflow: hidden;
        }
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.06),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        /* VS Code-like indent guides */
        .indent-guide {
          position: absolute;
          left: 0;
          height: 100%;
          border-left: 1px solid rgba(60, 60, 60, 0.3);
        }
      `}</style>
    </div>
  );
}

export default App;