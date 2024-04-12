/**
 * @param {[string]|undefined} previous - The previous stations that were generated
 * @returns {string} The prompt
 */
const getStationName = (previous) => `
Your first task is to create new tube stations for the city. 

The previous suggested station names were ${previous?.join(",")}.

The names must sound like realistic london tube stations, but must not already exist.
Try to avoid similar sounding names to previous entries. Try to keep a balance between one and two word station names e.g "Lower Donkington" and "Zoomsbury".
Do not include the word "Station"

What is your suggestion for at least 4 new station names? 
Reply with just your suggestions comma separated, no numbers.

The four stations:
  `;

export default getStationName;
