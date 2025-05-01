
/**
 * Helper function to safely parse string fields from various data formats
 */
export const parseStringField = (value: any): string => {
  if (value === null || value === undefined) return "";
  
  // Already a string
  if (typeof value === 'string') return value;
  
  // Try to handle case where value might be a JSON object/array
  if (typeof value === 'object') {
    try {
      // If it's an object that contains a text property
      if (value.text) return String(value.text);
      // If it's an array and has a first element with text
      if (Array.isArray(value) && value[0]?.text) return String(value[0].text);
      // Last resort, stringify it
      return JSON.stringify(value);
    } catch (e) {
      return "";
    }
  }
  
  // Default fallback
  return String(value);
};

/**
 * Interface for support types
 */
export interface SupportTypes {
  financial: string;
  listeners: string;
  encouragers: string;
  valuers: string;
  talkers: string;
}

/**
 * Interface for social support form data
 */
export interface SocialSupportFormData {
  supportTypes: SupportTypes;
  socialSkills: string[];
  socialFeelings: string;
  buildSocial: string;
}

/**
 * Parse support types from various data formats
 */
export const parseSupportTypes = (data: any): SupportTypes => {
  const defaultTypes: SupportTypes = {
    financial: "",
    listeners: "",
    encouragers: "",
    valuers: "",
    talkers: ""
  };
  
  if (!data) return defaultTypes;
  
  try {
    // If it's already an object
    if (typeof data === 'object' && data !== null) {
      return {
        financial: parseStringField(data.financial),
        listeners: parseStringField(data.listeners),
        encouragers: parseStringField(data.encouragers),
        valuers: parseStringField(data.valuers),
        talkers: parseStringField(data.talkers)
      };
    }
    
    // If it's a JSON string
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return {
          financial: parseStringField(parsed.financial),
          listeners: parseStringField(parsed.listeners),
          encouragers: parseStringField(parsed.encouragers),
          valuers: parseStringField(parsed.valuers),
          talkers: parseStringField(parsed.talkers)
        };
      } catch (e) {
        console.error("Error parsing support_types as JSON string:", e);
        return defaultTypes;
      }
    }
  } catch (e) {
    console.error("Error parsing support_types:", e);
  }
  
  return defaultTypes;
};

/**
 * Parse social skills from various data formats
 */
export const parseSocialSkills = (data: any): string[] => {
  if (!data) return [];
  
  try {
    // If it's already an array
    if (Array.isArray(data)) {
      return data.map(skill => String(skill));
    }
    
    // If it's a JSON string
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map(skill => String(skill));
        }
        return [String(data)];
      } catch (e) {
        console.error("Error parsing social_skills as JSON string:", e);
        return [String(data)];
      }
    }
  } catch (e) {
    console.error("Error parsing social_skills:", e);
  }
  
  return [];
};

/**
 * Function to parse social support data from the database
 */
export const parseSocialSupportData = (data: any): SocialSupportFormData => {
  if (!data) {
    console.log("No social support data to parse");
    return {
      supportTypes: {
        financial: "",
        listeners: "",
        encouragers: "",
        valuers: "",
        talkers: ""
      },
      socialSkills: [],
      socialFeelings: "",
      buildSocial: ""
    };
  }

  try {
    console.log("Parsing social support data:", data);

    // Create a clean data object with safer parsing
    const cleanData: SocialSupportFormData = {
      supportTypes: parseSupportTypes(data.support_types),
      socialSkills: parseSocialSkills(data.social_skills),
      socialFeelings: parseStringField(data.social_feelings),
      buildSocial: parseStringField(data.build_social)
    };

    console.log("Parsed social support data:", cleanData);
    return cleanData;
  } catch (parseError) {
    console.error("Error parsing social support data:", parseError);
    return {
      supportTypes: {
        financial: "",
        listeners: "",
        encouragers: "",
        valuers: "",
        talkers: ""
      },
      socialSkills: [],
      socialFeelings: "",
      buildSocial: ""
    };
  }
};
