
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
    
    // If we have a nested 'affirmations' property, use that
    if (affirmationsData && typeof affirmationsData === 'object') {
      if ('affirmations' in affirmationsData) {
        affirmationsData = affirmationsData.affirmations;
      }
    }
    
    // Check if it's an array directly
    if (Array.isArray(affirmationsData)) {
      // Direct array format
      for (let i = 0; i < Math.min(affirmationsData.length, 5); i++) {
        const item = affirmationsData[i];
        if (item && typeof item === 'object') {
          parsedAffirmations[i] = {
            criticism: item.criticism || "",
            positive: item.positive || ""
          };
        }
      }
    } 
    // Check if it has numbered properties (0, 1, 2...) that should be treated as an array
    else if (affirmationsData && typeof affirmationsData === 'object') {
      // It might contain a nested 'affirmations' array
      if (Array.isArray(affirmationsData.affirmations)) {
        for (let i = 0; i < Math.min(affirmationsData.affirmations.length, 5); i++) {
          const item = affirmationsData.affirmations[i];
          if (item && typeof item === 'object') {
            parsedAffirmations[i] = {
              criticism: item.criticism || "",
              positive: item.positive || ""
            };
          }
        }
      }
      // Handle key-value pairs where keys are numbers or strings like "0", "1", etc.
      else {
        for (let i = 0; i < 5; i++) {
          const item = affirmationsData[i] || affirmationsData[String(i)];
          if (item && typeof item === 'object') {
            parsedAffirmations[i] = {
              criticism: item.criticism || "",
              positive: item.positive || ""
            };
          }
        }
      }
      
      // Look for specific format with "first", "Second", etc.
      if (parsedAffirmations.every(a => a.criticism === "" && a.positive === "")) {
        console.log("Checking for special format with 'first', etc.");
        if (affirmationsData[0] && affirmationsData[0].criticism === "first") {
          for (let i = 0; i < 5; i++) {
            const item = affirmationsData[i];
            if (item && typeof item === 'object') {
              parsedAffirmations[i] = {
                criticism: item.criticism || "",
                positive: item.positive || ""
              };
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
