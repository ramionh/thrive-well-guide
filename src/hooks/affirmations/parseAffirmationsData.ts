
import { AffirmationItem } from "./types";

export const parseAffirmationsData = (data: any): AffirmationItem[] => {
  // Initialize default array with proper instances to avoid reference issues
  const parsedAffirmations: AffirmationItem[] = Array(5)
    .fill({})
    .map(() => ({ criticism: "", positive: "" }));

  if (!data) {
    console.log("No affirmations data to parse");
    return parsedAffirmations;
  }

  console.log("Parsing affirmation data:", data);
  
  try {
    // Find the actual affirmations array in the response
    let affirmationsData = null;
    
    if (typeof data.affirmations === 'string') {
      try {
        affirmationsData = JSON.parse(data.affirmations);
      } catch (e) {
        console.error("Failed to parse affirmations string");
      }
    } else {
      affirmationsData = data.affirmations;
    }
    
    console.log("Affirmations data (pre-processing):", affirmationsData);
    
    // Based on the DevTools screenshot, the data structure has "affirmations" as the top-level array
    if (Array.isArray(affirmationsData)) {
      // Map the array items to our expected format
      for (let i = 0; i < Math.min(affirmationsData.length, 5); i++) {
        const item = affirmationsData[i];
        if (item && typeof item === 'object') {
          parsedAffirmations[i] = {
            criticism: typeof item.criticism === 'string' ? item.criticism : "",
            positive: typeof item.positive === 'string' ? item.positive : ""
          };
        }
      }
    } 
    // Check for the specific numbered format seen in the DevTools screenshot
    else if (affirmationsData && typeof affirmationsData === 'object') {
      // It might be an object with numerical keys (0, 1, 2, etc.)
      for (let i = 0; i < 5; i++) {
        // Check if the key exists as either a number or string number
        const item = affirmationsData[i] || affirmationsData[String(i)];
        if (item && typeof item === 'object') {
          parsedAffirmations[i] = {
            criticism: typeof item.criticism === 'string' ? item.criticism : "",
            positive: typeof item.positive === 'string' ? item.positive : ""
          };
        }
      }
      
      // Special handling for the format seen in the DevTools screenshot
      // Where there are entries with "first", "Second", etc.
      if (parsedAffirmations.every(a => a.criticism === "" && a.positive === "")) {
        // Look for keys that match ordinal names or specific structure from DevTools
        const ordinalKeys = ["first", "Second", "Third", "Fourth", "fifth"];
        for (let i = 0; i < Math.min(5, ordinalKeys.length); i++) {
          // Find entries where criticism matches the ordinal key
          for (const key in affirmationsData) {
            const item = affirmationsData[key];
            if (
              item && 
              typeof item === 'object' && 
              item.criticism && 
              item.criticism.toLowerCase() === ordinalKeys[i].toLowerCase()
            ) {
              parsedAffirmations[i] = {
                criticism: ordinalKeys[i],
                positive: typeof item.positive === 'string' ? item.positive : String(i + 1)
              };
              break;
            }
          }
        }
      }
    }
    
    console.log("Parsed affirmations:", parsedAffirmations);
    return parsedAffirmations;
  } catch (parseError) {
    console.error("Error parsing affirmations data:", parseError);
    return parsedAffirmations;
  }
};
