"use client";

import { useState, useEffect } from 'react';

export function KeyboardNav() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Listen for visual feedback only - don't prevent default here
      const keyMap: Record<string, string> = {
        'KeyJ': 'j',
        'KeyK': 'k',
        'Tab': 'Tab',
        'Space': 'space'
      };
      
      const mappedKey = keyMap[e.code];
      if (mappedKey) {
        // Only prevent default for Tab and Space to avoid browser behavior
        if (e.code === 'Tab' || e.code === 'Space') {
          e.preventDefault();
        }
        setPressedKeys(prev => new Set([...prev, mappedKey]));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        'KeyJ': 'j',
        'KeyK': 'k',
        'Tab': 'Tab',
        'Space': 'space'
      };
      
      const mappedKey = keyMap[e.code];
      if (mappedKey) {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(mappedKey);
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
          ${isWide ? 'px-3' : 'px-2'} py-1 border-2 border-black font-mono text-xs font-bold
          transition-all duration-100 select-none
          ${isPressed 
            ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5' 
            : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
          }
        `}
      >
        {label}
      </div>
    );
  };

  // Make the keyboard component much more compact
  return (
    <div className="fixed bottom-3 right-3 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform z-50 text-xs">
      <div className="text-xs font-mono text-gray-600 mb-1 text-center">Navigate</div>
      
      {/* Navigation keys */}
      <div className="flex gap-1 items-center mb-1">
        <KeyButton keyName="j" label="J" />
        <div className="text-xs text-gray-500">↓</div>
        <KeyButton keyName="k" label="K" />
        <div className="text-xs text-gray-500">↑</div>
        <div className="mx-1 w-px h-3 bg-gray-300"></div>
        <KeyButton keyName="Tab" label="TAB" />
        <div className="text-xs text-gray-500">→</div>
      </div>
      
      {/* Compare key */}
      <div className="border-t border-black border-dashed pt-1">
        <div className="text-xs font-mono text-gray-600 mb-1 text-center">Compare</div>
        <div className="flex items-center justify-center">
          <KeyButton keyName="space" label="SPACE" isWide={true} />
        </div>
        <div className="text-xs text-gray-400 mt-1 text-center">Hold to view original</div>
      </div>
    </div>
  );
}
