"use client";

import { useState, useEffect } from 'react';

export function KeyboardNav() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['j', 'k', 'Tab', ' '].includes(e.key)) {
        e.preventDefault(); // Prevent default behaviors
        setPressedKeys(prev => new Set([...prev, e.key]));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['j', 'k', 'Tab', ' '].includes(e.key)) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(e.key);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const KeyButton = ({ keyName, label, isWide = false }: { keyName: string; label: string; isWide?: boolean }) => {
    const isPressed = pressedKeys.has(keyName);
    return (
      <div
        className={`
          ${isWide ? 'px-6' : 'px-3'} py-2 border-2 border-black font-mono text-sm font-bold
          transition-all duration-100 select-none
          ${isPressed 
            ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
            : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1'
          }
        `}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-black p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform z-50">
      <div className="text-xs font-mono text-gray-600 mb-2 text-center">Navigate</div>
      
      {/* Navigation keys */}
      <div className="flex gap-1 items-center mb-2">
        <KeyButton keyName="j" label="J" />
        <div className="text-xs text-gray-500">↓</div>
        <KeyButton keyName="k" label="K" />
        <div className="text-xs text-gray-500">↑</div>
        <div className="mx-1 w-px h-4 bg-gray-300"></div>
        <KeyButton keyName="Tab" label="TAB" />
        <div className="text-xs text-gray-500">→</div>
      </div>
      
      {/* Compare key */}
      <div className="border-t border-black border-dashed pt-2">
        <div className="text-xs font-mono text-gray-600 mb-1 text-center">Compare</div>
        <div className="flex items-center justify-center">
          <KeyButton keyName=" " label="SPACE" isWide={true} />
        </div>
        <div className="text-xs text-gray-400 mt-1 text-center">Hold to view original</div>
      </div>
    </div>
  );
}
