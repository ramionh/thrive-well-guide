
import { AffirmationItem } from "./types";

export const parseAffirmationsData = (data: any): AffirmationItem[] => {
  const parsedAffirmations: AffirmationItem[] = Array(5)
    .fill(null) // Initialize with null or undefined
    .map(() => ({ criticism: "", positive: "" }));

  if (!data) {
    console.log("No affirmations data to parse");
    return parsedAffirmations;
  }

  try {
    if (Array.isArray(data) && data.length > 0 && data[0].affirmations) {
      const affirmationsArray = data[0].affirmations; // Access affirmations directly

      for (let i = 0; i < Math.min(affirmationsArray.length, 5); i++) {
        const item = affirmationsArray[i];
        if (item && typeof item === 'object') {
          parsedAffirmations[i] = {
            criticism: item.criticism || "",
            positive: item.positive || ""
          };
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
