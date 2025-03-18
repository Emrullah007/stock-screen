/**
 * Scrolls to an element with better support for mobile devices
 * @param {RefObject} elementRef - React ref to the target element
 * @param {number} offset - Vertical offset in pixels (negative values scroll up)
 */
export const scrollToElement = (elementRef, offset = -80) => {
  if (!elementRef?.current) return;
  
  // Use a longer timeout to ensure DOM is fully rendered
  setTimeout(() => {
    try {
      const element = elementRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
      
      // First scroll attempt
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Second attempt with a slight delay in case the first didn't work
      setTimeout(() => {
        const updatedY = element.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({
          top: updatedY,
          behavior: 'smooth'
        });
      }, 300);
    } catch (err) {
      console.error('Error scrolling to element:', err);
    }
  }, 200);
};

/**
 * Utility to ensure scroll position is optimal for viewing content
 * on mobile devices, especially in cases where virtual keyboards
 * might affect scroll position
 * @param {RefObject} elementRef - React ref to the target element
 */
export const ensureMobileViewportVisibility = (elementRef) => {
  if (!elementRef?.current || window.innerWidth >= 600) return;
  
  // Wait for any keyboard to close or UI to stabilize
  setTimeout(() => {
    try {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      
      // If element is not sufficiently visible in viewport
      if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
        const y = rect.top + window.pageYOffset - 100; // 100px from top
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error('Error ensuring element visibility:', err);
    }
  }, 600);
}; 