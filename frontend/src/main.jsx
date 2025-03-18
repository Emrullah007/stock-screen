import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add a script to detect and hide any blue elements at the top
window.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all elements are rendered
  setTimeout(() => {
    // Helper function to check if an element is blue
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
        console.log('Hiding blue element:', element);
        element.style.display = 'none';
      }
    });
  }, 500);
});
