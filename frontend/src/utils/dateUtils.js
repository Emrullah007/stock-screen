/**
 * Formats a date in user's local timezone
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted date string with local timezone
 */
export const formatTimestamp = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Options for formatting
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Get local time
  const localTime = new Intl.DateTimeFormat('en-US', options).format(dateObj);

  // Get user's timezone abbreviation
  const timeZoneAbbr = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short'
  }).formatToParts(dateObj).find(part => part.type === 'timeZoneName')?.value || '';

  return `${localTime} ${timeZoneAbbr}`;
}; 