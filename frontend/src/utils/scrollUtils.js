/**
 * Scrolls to an element with better support for mobile devices
 * 
 * This utility solves common issues with mobile scrolling by making multiple scroll
 * attempts with delays between them. This approach helps overcome various browser
 * quirks and timing issues that can prevent smooth scrolling to elements.
 * 
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
      // This is particularly important on mobile devices where rendering delays are common
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
 * Ensures an element is optimally visible in the mobile viewport
 * 
 * This utility addresses scenarios where elements might be obscured by:
 * - Virtual keyboards that have just closed
 * - Fixed position headers/footers
 * - Dynamic content that shifts the viewport
 * 
 * It checks if the element is sufficiently visible and adjusts the scroll
 * position if needed, providing a better user experience on mobile devices.
 * 
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
      // (less than 100px from top or bottom of viewport)
      if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
        // Position the element 100px from the top of the viewport
        const y = rect.top + window.pageYOffset - 100;
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