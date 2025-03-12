import React, { useEffect, useState } from 'react';
import { FileCode } from 'lucide-react';

interface CodeEditorProps {
  activeFile: string;
  content: string;
  language: string;
  showLineNumbers?: boolean;
  onChange: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  activeFile, 
  content, 
  language, 
  showLineNumbers = true,
  onChange 
}) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [cursorLine, setCursorLine] = useState(4);
  const [editorContent, setEditorContent] = useState(content);
  
  // Update editor content when file changes
  useEffect(() => {
    setEditorContent(content);
  }, [content, activeFile]);
  
  // Generate line numbers based on content
  useEffect(() => {
    const lines = editorContent.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [editorContent]);
  
  // Handle textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange(newContent);
    
    // Update line count
    const lines = newContent.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  };
  
  // Handle cursor position
  const handleCursor = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const value = textarea.value;
    const selectionStart = textarea.selectionStart;
    
    // Count newlines before cursor position
    let line = 1;
    for (let i = 0; i < selectionStart; i++) {
      if (value[i] === '\n') line++;
    }
    
    setCursorLine(line);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">

      
      {/* Editor body with code content */}
      <div className="flex flex-1 overflow-hidden relative bg-[#1e1e1e]">
        {/* Line numbers column */}
        {showLineNumbers && (
          <div className="bg-[#1e1e1e] text-gray-500 text-right py-4 pr-3 pl-4 select-none border-r border-[#3c3c3c] border-opacity-30 min-w-[3rem] overflow-hidden">
            {lineNumbers.map(num => (
              <div 
                key={num} 
                className={`leading-6 ${num === cursorLine ? 'text-white' : ''}`}
              >
                {num}
              </div>
            ))}
          </div>
        )}
        
        {/* Syntax highlighted code overlay (read-only, for display only) */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <div className={showLineNumbers ? "" : ""} 
               style={{ paddingTop: "1rem", paddingRight: "1rem" }}>
            <pre className="whitespace-pre text-transparent">
              {editorContent.split('\n').map((line, i) => (
                <div key={i} className="leading-6">
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>
        
        {/* Editable textarea (where user actually types) */}
        <textarea
          value={editorContent}
          onChange={handleChange}
          onClick={handleCursor}
          onKeyUp={handleCursor}
          className="flex-1 bg-transparent text-gray-300 font-mono text-sm resize-none outline-none p-4 caret-white w-full"
          style={{ 
            lineHeight: "1.5rem",
            paddingLeft: showLineNumbers, 
            caretColor: "#fff",
            tabSize: 2
          }}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
      
      {/* Status bar - simulating VS Code editor footer */}
      <div className="flex items-center text-xs border-t border-[#3c3c3c] text-gray-400 px-3 py-1 bg-[#252526] mt-auto">
        <div className="flex-1">
          <span className="inline-block px-2">{activeFile}</span>
          <span className="inline-block px-2 border-l border-[#3c3c3c]">Ln {cursorLine}, Col 1</span>
          <span className="inline-block px-2 border-l border-[#3c3c3c]">Spaces: 2</span>
          <span className="inline-block px-2 border-l border-[#3c3c3c]">UTF-8</span>
        </div>
        <div>
          <span className="mr-3">{language}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;