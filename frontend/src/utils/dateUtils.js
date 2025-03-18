/**
 * Formats a UTC timestamp to the user's local time zone
 * @param {string} timestamp - ISO timestamp string
 * @param {Object} options - Formatting options for toLocaleString
 * @returns {string} Formatted date and time string in user's locale and timezone
 */
export const formatTimestamp = (timestamp, options = {}) => {
  const date = new Date(timestamp);
  
  // Default formatting options
  const defaultOptions = {
    dateStyle: 'medium',
    timeStyle: 'short'
  };
  
  // Merge default options with provided options
  const formattingOptions = { ...defaultOptions, ...options };
  
  // Format using user's browser locale and timezone settings
  return date.toLocaleString(navigator.language, formattingOptions);
}; 