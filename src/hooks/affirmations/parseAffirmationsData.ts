import { AffirmationItem } from "./types";

export const parseAffirmationsData = (data: any): AffirmationItem[] => {
  // Initialize default array with proper instances to avoid reference issues
  const parsedAffirmations: AffirmationItem[] = Array(5)
    .fill(null)
    .map(() => ({ criticism: "", positive: "" }));

  if (!data || !Array.isArray(data)) {
    console.log("No valid affirmations data to parse");
    return parsedAffirmations;
  }

  try {
    console.log("Parsing affirmation data:", data);

    // Assuming data is an array of objects, each with an 'affirmations' property
    for (let i = 0; i < Math.min(data.length, 5); i++) {
      const affirmationsObj = data[i];

      if (affirmationsObj && affirmationsObj.affirmations && Array.isArray(affirmationsObj.affirmations)) {
        const affirmationsArray = affirmationsObj.affirmations;

        for (let j = 0; j < Math.min(affirmationsArray.length, 5); j++) {
          const item = affirmationsArray[j];
          if (item && typeof item === 'object') {
            // Only overwrite if we have data, otherwise keep existing empty object
            if (item.criticism || item.positive) {
              parsedAffirmations[j] = {
                criticism: item.criticism || "",
                positive: item.positive || ""
              };
            }
          }
        }
        // If we found data in the first element, break out of the loop
        if (affirmationsArray.length > 0) {
          break;
        }
      }
    }

    console.log("Parsed affirmations:", parsedAffirmations);
    return parsedAffirmations.filter(item => item.criticism || item.positive); // Filter out empty objects

  } catch (parseError) {
    console.error("Error parsing affirmations data:", parseError);
    return parsedAffirmations;
  }
};
