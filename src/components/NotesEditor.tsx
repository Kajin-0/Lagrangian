import React, { useState, useRef, useEffect } from 'react';

export default function NotesEditor({ systemId }: { systemId: string }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lagrangian_notes_${systemId}`);
      if (stored) {
        setContent(stored);
      } else {
        setContent('');
      }
    } catch (e) {
      console.error(e);
    }
  }, [systemId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    try {
      localStorage.setItem(`lagrangian_notes_${systemId}`, val);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const linesCount = content.split('\n').length;
  // Make sure we always show at least enough lines for the view height (e.g. 20)
  const lines = Array.from({ length: Math.max(20, linesCount) }, (_, i) => i + 1);

  return (
    <div className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm border border-black overflow-hidden flex flex-col min-h-[400px]">
      <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] px-4 py-1 text-xs text-[#858585] flex justify-between">
        <span>{systemId}.txt</span>
        <span>{content.length} bytes</span>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <div 
          ref={lineNumbersRef}
          className="bg-[#2d2d2d] text-[#858585] text-right py-2 pl-2 pr-3 select-none overflow-hidden flex flex-col"
          style={{ width: '3rem' }}
        >
          {lines.map(n => (
            <div key={n} className="leading-[1.5rem] min-h-[1.5rem]">{n}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onScroll={handleScroll}
          className="flex-1 bg-transparent text-[#d4d4d4] p-2 outline-none resize-none whitespace-pre overflow-auto"
          spellCheck={false}
          style={{ lineHeight: '1.5rem' }}
          placeholder="-- INSERT --"
        />
      </div>
    </div>
  );
}
