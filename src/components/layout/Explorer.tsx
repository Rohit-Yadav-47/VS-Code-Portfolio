import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, FileCode, Code, MoreHorizontal, PlusCircle, FolderOpen, Folder, X, Trash2, FolderPlus } from 'lucide-react';
// Import path utilities
import * as pathUtils from '../../utils/pathUtils';

// Define file data type
interface FileData {
  name: string;
  content: string;
  language: string;
  path: string;
  lastSaved?: Date;
  isDirectory?: boolean;
}

interface ExplorerProps {
  expandedItems: string[];
  toggleExpand: (item: string) => void;
  activeFile: string;
  setActiveFile: (file: string) => void;
  files: FileData[];
  addTab: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createNewFile: (name: string, type: string, path?: string) => void;
  deleteFile: (name: string, path: string) => void;
  createNewFolder?: (name: string, parentPath?: string) => Promise<boolean>;
}

const Explorer: React.FC<ExplorerProps> = ({
  expandedItems,
  toggleExpand,
  activeFile,
  setActiveFile,
  files,
  addTab,
  searchQuery,
  setSearchQuery,
  createNewFile,
  deleteFile,
  createNewFolder
}) => {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [fileType, setFileType] = useState('py');
  const [contextMenuFile, setContextMenuFile] = useState<string | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState('');

  // Filter files based on search query
  const filteredFiles = searchQuery 
    ? files.filter(file => file.path.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // Function to get file icon based on extension
  const getFileIcon = (fileName: string, isDirectory?: boolean) => {
    if (isDirectory) {
      return <Folder className="w-4 h-4 text-yellow-500" />;
    }
    
    const extension = fileName.split('.').pop() || '';
    
    if (extension.toLowerCase() === 'py') {
      return <div className="w-4 h-4 text-blue-500 font-mono text-[10px] font-bold">PY</div>;
    } else {
      return <FileCode className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateNewFile = () => {
    if (newFileName) {
      console.log('Creating new file from Explorer. Path:', currentPath, 'Filename:', newFileName);
      createNewFile(newFileName, fileType, currentPath);
      setNewFileName('');
      setShowNewFileDialog(false);
    }
  };
  
  const handleCreateNewFolder = async () => {
    if (newFolderName && createNewFolder) {
      console.log('Creating new folder from Explorer. Path:', currentPath, 'Folder name:', newFolderName);
      const success = await createNewFolder(newFolderName, currentPath);
      if (success) {
        setNewFolderName('');
        setShowNewFolderDialog(false);
      }
    }
  };

  // Handle file context menu with path
  const handleContextMenu = (e: React.MouseEvent, fileName: string, path: string) => {
    e.preventDefault();
    setContextMenuFile(fileName);
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    
    // Set the current path to parent directory
    const parentPath = pathUtils.dirname(path);
    console.log('Setting context menu path:', parentPath);
    setCurrentPath(parentPath);
  };

  // Close context menu when clicking elsewhere
  const handleClickOutside = () => {
    setContextMenuFile(null);
  };

  // Handle keypress in new file input 
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNewFile();
    } else if (e.key === 'Escape') {
      setShowNewFileDialog(false);
    }
  };
  
  // Handle keypress in new folder input
  const handleFolderKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNewFolder();
    } else if (e.key === 'Escape') {
      setShowNewFolderDialog(false);
    }
  };

  // Group files by directory for better organization
  const organizeFilesByDirectory = (files: FileData[]) => {
    const rootFiles: FileData[] = [];
    const directories: {[key: string]: FileData[]} = {};
    
    files.forEach(file => {
      if (file.isDirectory) return;
      
      const pathParts = file.path.split('/').filter(Boolean);
      
      if (pathParts.length === 1) {
        rootFiles.push(file);
      } else {
        const dirPath = '/' + pathParts.slice(0, -1).join('/');
        if (!directories[dirPath]) {
          directories[dirPath] = [];
        }
        directories[dirPath].push(file);
      }
    });
    
    return { rootFiles, directories };
  };
  
  const { rootFiles, directories } = organizeFilesByDirectory(filteredFiles);

  return (
    <div className="fixed left-12 top-8 bottom-6 w-60 bg-[#252526] flex flex-col z-10 shadow-lg md:block hidden border-r border-[#3c3c3c]">
      {/* Search Bar */}
      <div className="p-2.5 border-b border-[#3c3c3c]">
        <div className="flex items-center bg-[#3c3c3c] rounded px-2 py-1 hover:bg-[#4c4c4c] transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Explorer Header */}
      <div className="p-2.5 flex justify-between items-center border-b border-[#3c3c3c]">
        <span className="text-sm uppercase font-semibold text-gray-300">Explorer</span>
        <div className="flex items-center gap-1">
          {createNewFolder && (
            <button 
              className="p-1 hover:bg-[#3c3c3c] rounded transition-colors"
              title="New Folder"
              onClick={() => setShowNewFolderDialog(true)}
            >
              <FolderPlus className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <button 
            className="p-1 hover:bg-[#3c3c3c] rounded transition-colors"
            title="New Python File"
            onClick={() => {
              setCurrentPath('');
              setShowNewFileDialog(true);
            }}
          >
            <PlusCircle className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="p-3 border-b border-[#3c3c3c] bg-[#2d2d2d] animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">New Python File</h3>
            <button 
              className="text-gray-500 hover:text-gray-300"
              onClick={() => setShowNewFileDialog(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            placeholder="filename.py"
            className="w-full p-1.5 bg-[#3c3c3c] border border-[#525252] rounded text-sm mb-2 focus:outline-none focus:border-blue-500"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          
          {currentPath && (
            <div className="text-xs text-gray-400 mb-2">
              Path: {currentPath || '/'}
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded text-white text-xs"
              onClick={handleCreateNewFile}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* New Folder Dialog */}
      {showNewFolderDialog && createNewFolder && (
        <div className="p-3 border-b border-[#3c3c3c] bg-[#2d2d2d] animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">New Folder</h3>
            <button 
              className="text-gray-500 hover:text-gray-300"
              onClick={() => setShowNewFolderDialog(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            placeholder="folder name"
            className="w-full p-1.5 bg-[#3c3c3c] border border-[#525252] rounded text-sm mb-2 focus:outline-none focus:border-blue-500"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={handleFolderKeyPress}
            autoFocus
          />
          
          {currentPath && (
            <div className="text-xs text-gray-400 mb-2">
              Path: {currentPath || '/python'}
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded text-white text-xs"
              onClick={handleCreateNewFolder}
            >
              Create Folder
            </button>
          </div>
        </div>
      )}

      {/* Explorer Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={handleClickOutside}>
        <div className="p-2.5">
          {/* Open Editors Section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors"
            onClick={() => toggleExpand('OPEN_EDITORS')}
          >
            {expandedItems.includes('OPEN_EDITORS') ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-gray-300 text-xs font-medium">OPEN EDITORS</span>
          </div>
          
          {expandedItems.includes('OPEN_EDITORS') && (
            <div className="ml-4 space-y-1 mt-1">
              {files
                .filter(file => !file.isDirectory && file.name === activeFile)
                .map(file => (
                  <div 
                    key={file.name + file.path}
                    className="flex items-center justify-between px-2 py-1 rounded text-sm bg-[#37373d] border-l-2 border-blue-500"
                  >
                    <div 
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => {
                        setActiveFile(file.name);
                        addTab(file.name);
                      }}
                    >
                      {getFileIcon(file.name)}
                      <span className="ml-2 text-sm">{file.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {/* Python Files section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors mt-2"
            onClick={() => toggleExpand('PORTFOLIO')}
          >
            {expandedItems.includes('PORTFOLIO') ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs font-medium text-blue-300">PYTHON FILES</span>
          </div>
          
          {expandedItems.includes('PORTFOLIO') && (
            <div className="ml-4 space-y-1 mt-1">
              {/* Display root level Python files */}
              {rootFiles.map((file) => (
                <div 
                  key={file.path}
                  className={`flex items-center justify-between pr-1 rounded transition-colors ${
                    activeFile === file.name 
                      ? 'bg-[#094771] text-white' 
                      : 'hover:bg-[#37373d] text-gray-300'
                  }`}
                  onContextMenu={(e) => handleContextMenu(e, file.name, file.path)}
                >
                  <div
                    className="flex items-center py-1 pl-2 flex-1"
                    onClick={() => {
                      setActiveFile(file.name);
                      addTab(file.name);
                    }}
                  >
                    {getFileIcon(file.name, file.isDirectory)}
                    <span className="ml-2 text-sm">{file.name}</span>
                  </div>
                  
                  {/* Delete button that appears on hover */}
                  <button
                    className="opacity-0 hover:opacity-100 hover:bg-[#3c3c3c] p-1 rounded group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.name, file.path);
                    }}
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
              
              {/* Display directories and their files */}
              {files
                .filter(file => file.isDirectory)
                .map(dir => {
                  const dirPath = dir.path;
                  const dirFiles = directories[dirPath] || [];
                  const dirName = dir.name;
                  
                  return (
                    <div key={dirPath}>
                      <div 
                        className="flex items-center space-x-2 cursor-pointer hover:bg-[#37373d] p-1 rounded transition-colors"
                        onClick={() => toggleExpand(dirPath)}
                      >
                        {expandedItems.includes(dirPath) ? (
                          <>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                            <FolderOpen className="w-4 h-4 text-yellow-500" />
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <Folder className="w-4 h-4 text-yellow-500" />
                          </>
                        )}
                        <span className="text-sm">{dirName}</span>
                      </div>

                      {expandedItems.includes(dirPath) && (
                        <div className="ml-6 space-y-0.5 mt-1">
                          {/* Add New File in this directory button */}
                          <button
                            className="flex items-center w-full px-2 py-1 text-xs text-green-400 hover:bg-[#37373d] rounded"
                            onClick={() => {
                              setCurrentPath(dirPath);
                              setShowNewFileDialog(true);
                            }}
                          >
                            <PlusCircle className="w-3 h-3 mr-2" />
                            <span>New Python File</span>
                          </button>
                          
                          {dirFiles.length > 0 ? dirFiles.map(file => (
                            <div 
                              key={file.path}
                              className={`flex items-center justify-between pr-1 rounded transition-colors ${
                                activeFile === file.name 
                                  ? 'bg-[#094771] text-white' 
                                  : 'hover:bg-[#37373d] text-gray-300'
                              }`}
                              onContextMenu={(e) => handleContextMenu(e, file.name, file.path)}
                            >
                              <div
                                className="flex items-center py-1 pl-2 flex-1"
                                onClick={() => {
                                  setActiveFile(file.name);
                                  addTab(file.name);
                                }}
                              >
                                {getFileIcon(file.name)}
                                <span className="ml-2 text-sm">{file.name}</span>
                              </div>
                              
                              <button
                                className="opacity-0 hover:opacity-100 hover:bg-[#3c3c3c] p-1 rounded group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFile(file.name, file.path);
                                }}
                                title="Delete file"
                              >
                                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                              </button>
                            </div>
                          )) : (
                            <div className="text-gray-500 text-xs italic py-1 px-2">
                              Empty folder
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              }
              
              {/* Empty state when no files match search */}
              {searchQuery && filteredFiles.length === 0 && (
                <div className="text-gray-500 text-xs italic py-2 px-2">
                  No files match your search
                </div>
              )}
              
              {/* Create new file and folder options */}
              <div className="flex space-x-2 mt-4">
                <button 
                  className="flex items-center space-x-2 cursor-pointer p-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded text-sm flex-1 justify-center text-blue-400"
                  onClick={() => {
                    setCurrentPath('');
                    setShowNewFileDialog(true);
                  }}
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  <span className="text-xs">New File</span>
                </button>
                
                {createNewFolder && (
                  <button 
                    className="flex items-center space-x-2 cursor-pointer p-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded text-sm flex-1 justify-center text-yellow-400"
                    onClick={() => setShowNewFolderDialog(true)}
                  >
                    <FolderPlus className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs">New Folder</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenuFile && (
        <div
          className="fixed bg-[#2d2d2d] shadow-lg rounded z-50 border border-[#3c3c3c]"
          style={{
            top: contextMenuPos.y,
            left: contextMenuPos.x,
            minWidth: '160px'
          }}
        >
          <div 
            className="px-3 py-1.5 text-sm hover:bg-[#094771] cursor-pointer flex items-center"
            onClick={() => {
              if (contextMenuFile) {
                setActiveFile(contextMenuFile);
                addTab(contextMenuFile);
                setContextMenuFile(null);
              }
            }}
          >
            <Code className="w-4 h-4 mr-2" />
            Open
          </div>
          
          <div className="border-b border-[#3c3c3c] my-1"></div>
          
          {/* Add Create File in Same Directory option */}
          <div 
            className="px-3 py-1.5 text-sm hover:bg-[#094771] cursor-pointer flex items-center text-green-400"
            onClick={() => {
              setShowNewFileDialog(true);
              setContextMenuFile(null);
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create File Here
          </div>
          
          <div className="border-b border-[#3c3c3c] my-1"></div>
          
          {/* Create New Folder option */}
          {createNewFolder && (
            <>
              <div 
                className="px-3 py-1.5 text-sm hover:bg-[#094771] cursor-pointer flex items-center text-yellow-400"
                onClick={() => {
                  setShowNewFolderDialog(true);
                  setContextMenuFile(null);
                }}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder Here
              </div>
              <div className="border-b border-[#3c3c3c] my-1"></div>
            </>
          )}
          
          <div 
            className="px-3 py-1.5 text-sm hover:bg-[#094771] cursor-pointer flex items-center text-red-400"
            onClick={() => {
              if (contextMenuFile) {
                // Use path utilities to create correct path
                const filePath = pathUtils.join(currentPath, contextMenuFile);
                deleteFile(contextMenuFile, filePath);
                setContextMenuFile(null);
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorer;
