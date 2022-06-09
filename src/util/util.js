/**
 * Function to make a text with capital letter
 * @param {string} text The string to make the format capital letter
 * @returns A string with the first letter upper case
 */
const capitalLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
};

/**
 * Function to make a text lower case
 * @param {string} text The text to make lower case
 * @returns The string provided but in lower case
 */
const toLowerCase = (text) => text.toLowerCase();

module.exports = { capitalLetter, toLowerCase };
