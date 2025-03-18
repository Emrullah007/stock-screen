import { useEffect } from 'react';

const useScrollSnap = (options = {}) => {
  const { 
    enabled = false, // Disabled by default to prevent conflicts with navigation
    threshold = 0.3, // How close to the section boundary we need to be to snap
    delay = 150      // Debounce delay in ms
  } = options;

  useEffect(() => {
    if (!enabled) return;

    let timeoutId = null;
    let lastScrollPosition = window.scrollY;
    let scrollDirection = 'none';

    const getVisibleSections = () => {
      const sections = document.querySelectorAll('[data-section]');
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const visibleSections = [];

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const sectionHeight = rect.height;
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(scrollTop, sectionTop);
        const visibleBottom = Math.min(scrollTop + viewportHeight, sectionTop + sectionHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate visibility ratio
        const visibilityRatio = visibleHeight / sectionHeight;
        
        if (visibilityRatio > 0) {
          visibleSections.push({
            element: section,
            visibilityRatio,
            distance: Math.abs(rect.top),
            top: sectionTop
          });
        }
      });

      return visibleSections;
    };

    const snapToNearestSection = () => {
      const visibleSections = getVisibleSections();
      
      if (!visibleSections.length) return;
      
      // If we're at the start of a section (less than threshold away), snap to it
      const nearestSection = visibleSections.reduce((nearest, current) => {
        return current.distance < nearest.distance ? current : nearest;
      }, visibleSections[0]);
      
      // Only snap if we're close enough to a section boundary
      const viewportHeight = window.innerHeight;
      const closenessThreshold = viewportHeight * threshold;
      
      if (nearestSection.distance < closenessThreshold) {
        nearestSection.element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      
      // Determine scroll direction
      scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
      lastScrollPosition = currentScrollPosition;
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set a new timeout
      timeoutId = setTimeout(() => {
        // Only snap if the user has stopped scrolling
        if (window.scrollY === lastScrollPosition) {
          snapToNearestSection();
        }
      }, delay);
    };

    // Add data-section attribute to section elements
    document.querySelectorAll('.section-card').forEach(section => {
      section.setAttribute('data-section', '');
    });

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [enabled, threshold, delay]);
};

export default useScrollSnap; 