/**
 * Prompt for the user to send a fortune
 * @param {[string]|undefined} previous - The weirdness factor for the fortune
 * @returns {string} The prompt
 */
const getStationName = (previous) => `
  It's your first day on the job as a city planner for London. Your first task
  is to create new tube stations for the city. 
  
  The previous suggested station names were ${previous?.join(",")}.

  The names must sound like realistic tube stations, but must not already exist.
  Try to avoid similar sounding names to previous entries. Try to keep a balance between one and two word station names e.g "Lower Donkington" and "Zoomsbury".
  Do not include the word "Station"

    What is your suggestion for 4 new station names? 
    Reply with just your suggestions, in the format:
    
    <name>, <name>, <name>, <name> 

  `;

export default getStationName;
