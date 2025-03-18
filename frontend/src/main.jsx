import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * UI Fix Script
 * 
 * This script detects and hides any unwanted blue header elements that might be 
 * introduced by the embedding environment. It runs after the DOM is fully loaded
 * and searches for elements with blue backgrounds that appear at the top of the page.
 * 
 * This ensures the application UI remains clean and consistent across different environments.
 */
window.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all elements are rendered
  setTimeout(() => {
    /**
     * Determines if an element has a blue background and is positioned at the top of the page
     * @param {HTMLElement} element - DOM element to check
     * @returns {boolean} - True if element is blue and at the top
     */
    const isBlueElement = (element) => {
      if (!element) return false;
      
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const background = style.background;
      
      // Check if the element has a blue background
      const isBlue = (
        backgroundColor.includes('rgb(33, 150, 243)') || // #2196F3
        backgroundColor.includes('rgb(25, 118, 210)') || // #1976D2
        backgroundColor.includes('rgb(63, 81, 181)') ||  // #3F51B5
        background.includes('linear-gradient') && background.includes('rgb(33, 150, 243)')
      );
      
      // Check if element is at the top of the page
      const rect = element.getBoundingClientRect();
      const isAtTop = rect.top < 50;
      
      return isBlue && isAtTop;
    };
    
    // Find all elements in the document
    const allElements = document.querySelectorAll('*');
    
    // Hide any blue elements at the top
    allElements.forEach(element => {
      if (isBlueElement(element)) {
        // Hide the element
        element.style.display = 'none';
      }
    });
  }, 500);
});
