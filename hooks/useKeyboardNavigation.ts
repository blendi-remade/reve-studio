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
  enabledKeys = ['j', 'k']
}: KeyboardNavigationOptions<T>): KeyboardNavigationResult<T> {
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialSelectedId || (items.length > 0 ? getItemId(items[0]) : null)
  );

  const navigationOrder = items.map(getItemId);
  const selectedItem = items.find(item => getItemId(item) === selectedItemId) || null;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip navigation if user is typing in an input field
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, navigationOrder, enabledKeys]);

  useEffect(() => {
    // Auto-select first item when items are loaded and no item is selected
    if (items.length > 0 && !selectedItemId) {
      console.log('🔧 Auto-selecting first item:', getItemId(items[0]));
      setSelectedItemId(getItemId(items[0]));
    }
    // Clear selection if no items
    else if (items.length === 0 && selectedItemId) {
      setSelectedItemId(null);
    }
  }, [items.length, selectedItemId, items, getItemId]);

  return {
    selectedItem,
    selectedItemId,
    setSelectedItemId,
    navigateNext,
    navigatePrevious
  };
}
