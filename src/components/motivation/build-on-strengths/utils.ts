
import { StrengthApplication } from './types';

export const parseStrengthApplicationsData = (data: any) => {
  console.log("Parsing strength applications data:", data);
  
  let strengthApplications: StrengthApplication[] = [
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ];
  
  if (data.strength_applications) {
    if (Array.isArray(data.strength_applications)) {
      strengthApplications = data.strength_applications.length > 0 
        ? [...data.strength_applications]
        : strengthApplications;
    } else if (typeof data.strength_applications === 'string') {
      try {
        const parsed = JSON.parse(data.strength_applications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          strengthApplications = parsed;
        }
      } catch (e) {
        console.error("Error parsing strength_applications JSON:", e);
      }
    }
    
    // Ensure we have exactly 3 entries
    if (strengthApplications.length < 3) {
      const remaining = 3 - strengthApplications.length;
      for (let i = 0; i < remaining; i++) {
        strengthApplications.push({ strength: "", application: "" });
      }
    }
  }
  
  return { strength_applications: strengthApplications };
};
