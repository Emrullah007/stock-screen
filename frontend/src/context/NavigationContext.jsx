import React, { createContext, useState, useEffect, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [sectionRefs, setSectionRefs] = useState({});

  // Register a section reference
  const registerSection = (id, ref, label) => {
    setSectionRefs(prev => ({ ...prev, [id]: ref }));
    
    // Add to sections array if not already there
    setSections(prev => {
      if (!prev.some(section => section.id === id)) {
        return [...prev, { id, label }];
      }
      return prev;
    });
  };

  // Update active section based on scroll position
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100; // Adding offset to improve detection
    
    let currentSection = null;
    let minDistance = Number.MAX_SAFE_INTEGER;
    
    // Find the section closest to the top of the viewport
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        const sectionTop = ref.current.getBoundingClientRect().top + window.scrollY;
        const distance = Math.abs(scrollPosition - sectionTop);
        
        if (distance < minDistance) {
          minDistance = distance;
          currentSection = id;
        }
      }
    });
    
    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  };

  // Navigate to a section by ID
  const navigateToSection = (sectionId) => {
    const sectionRef = sectionRefs[sectionId];
    if (sectionRef && sectionRef.current) {
      // Set active section first to update UI immediately
      setActiveSection(sectionId);
      
      // Calculate position accounting for fixed header (if any)
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Use window.scrollTo for more consistent behavior
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Temporarily disable scroll listener to prevent conflicts
      window.removeEventListener('scroll', handleScroll);
      setTimeout(() => {
        window.addEventListener('scroll', handleScroll);
      }, 1000); // Re-enable after animation completes
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs, activeSection]);

  const value = {
    activeSection,
    sections,
    registerSection,
    navigateToSection
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext; 