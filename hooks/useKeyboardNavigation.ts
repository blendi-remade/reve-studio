import { useState, useEffect } from 'react';

export interface KeyboardNavigationOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
  initialSelectedId?: string;
  enabledKeys?: string[];
  // Fix the type to accept nullable refs
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  scrollToElement?: boolean;
  elementIdPrefix?: string; // Prefix for element IDs (e.g., 'comment-')
}

export interface KeyboardNavigationResult<T> {
  selectedItem: T | null;
  selectedItemId: string | null;
  setSelectedItemId: (id: string) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  isSpacePressed: boolean;
}

export function useKeyboardNavigation<T>({
  items,
  getItemId,
  initialSelectedId,
  enabledKeys = ['j', 'k', 'Tab', ' '],
  scrollContainerRef,
  scrollToElement = false,
  elementIdPrefix = ''
}: KeyboardNavigationOptions<T>): KeyboardNavigationResult<T> {
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialSelectedId || (items.length > 0 ? getItemId(items[0]) : null)
  );
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const navigationOrder = items.map(getItemId);
  const selectedItem = items.find(item => getItemId(item) === selectedItemId) || null;

  // Auto-select first item when items load
  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(getItemId(items[0]));
    }
  }, [items.length, selectedItemId, items, getItemId]);

  // Auto-scroll to selected element
  useEffect(() => {
    if (scrollToElement && selectedItemId && scrollContainerRef?.current) {
      const elementId = elementIdPrefix ? `${elementIdPrefix}${selectedItemId}` : selectedItemId;
      const selectedElement = document.getElementById(elementId);
      
      if (selectedElement) {
        const container = scrollContainerRef.current;
        const containerHeight = container.clientHeight;
        const elementHeight = selectedElement.offsetHeight;
        
        // Calculate scroll position to center the element
        const elementTop = selectedElement.offsetTop - container.offsetTop;
        const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedItemId, scrollToElement, scrollContainerRef, elementIdPrefix]);

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
      
      // Handle space key separately - don't prevent default for space
      if (e.key === ' ') {
        e.preventDefault(); // Prevent page scroll
        setIsSpacePressed(true);
        return;
      }
      
      e.preventDefault();
      
      if (e.key === 'j') {
        navigateNext();
      } else if (e.key === 'k') {
        navigatePrevious();
      } else if (e.key === 'Tab') {
        navigateToNextRoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedItemId, navigationOrder, enabledKeys, items]);

  return {
    selectedItem,
    selectedItemId,
    setSelectedItemId,
    navigateNext,
    navigatePrevious,
    isSpacePressed
  };
}
