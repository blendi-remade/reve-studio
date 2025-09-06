import { useState, useEffect } from 'react';

export interface KeyboardNavigationOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
  initialSelectedId?: string;
  enabledKeys?: string[];
}

export interface KeyboardNavigationResult<T> {
  selectedItem: T | null;
  selectedItemId: string | null;
  setSelectedItemId: (id: string) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
}

export function useKeyboardNavigation<T>({
  items,
  getItemId,
  initialSelectedId,
  enabledKeys = ['j', 'k', 'Tab']  // Add Tab to enabled keys
}: KeyboardNavigationOptions<T>): KeyboardNavigationResult<T> {
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialSelectedId || (items.length > 0 ? getItemId(items[0]) : null)
  );

  const navigationOrder = items.map(getItemId);
  const selectedItem = items.find(item => getItemId(item) === selectedItemId) || null;

  // Auto-select first item when items load
  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(getItemId(items[0]));
    }
  }, [items.length, selectedItemId, items, getItemId]);

  const navigateNext = () => {
    if (!selectedItemId) return;
    const currentIndex = navigationOrder.indexOf(selectedItemId);
    if (currentIndex < navigationOrder.length - 1) {
      setSelectedItemId(navigationOrder[currentIndex + 1]);
    }
  };

  const navigatePrevious = () => {
    if (!selectedItemId) return;
    const currentIndex = navigationOrder.indexOf(selectedItemId);
    if (currentIndex > 0) {
      setSelectedItemId(navigationOrder[currentIndex - 1]);
    }
  };

  // Navigate to next root comment only
  const navigateToNextRoot = () => {
    if (!selectedItemId || items.length === 0) return;
    
    // Find all root comments (depth === 0)
    const rootComments = items.filter((item: any) => item.depth === 0);
    if (rootComments.length === 0) return;
    
    // Find current comment
    const currentComment = items.find(item => getItemId(item) === selectedItemId);
    if (!currentComment) return;
    
    // Find which root we're currently under
    let currentRootId = getItemId(currentComment);
    if ((currentComment as any).depth > 0) {
      // Find the root parent by going backwards in list
      const currentIndex = items.findIndex(item => getItemId(item) === selectedItemId);
      for (let i = currentIndex; i >= 0; i--) {
        if ((items[i] as any).depth === 0) {
          currentRootId = getItemId(items[i]);
          break;
        }
      }
    }
    
    // Find next root comment
    const currentRootIndex = rootComments.findIndex(item => getItemId(item) === currentRootId);
    if (currentRootIndex < rootComments.length - 1) {
      setSelectedItemId(getItemId(rootComments[currentRootIndex + 1]));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip navigation if user is typing
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!enabledKeys.includes(e.key)) return;
      
      e.preventDefault();
      
      if (e.key === 'j') {
        navigateNext();
      } else if (e.key === 'k') {
        navigatePrevious();
      } else if (e.key === 'Tab') {
        navigateToNextRoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, navigationOrder, enabledKeys, items]);

  return {
    selectedItem,
    selectedItemId,
    setSelectedItemId,
    navigateNext,
    navigatePrevious
  };
}
