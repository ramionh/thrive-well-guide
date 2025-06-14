
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
 * Type definition for financial resources data
 */
export interface FinancialResourcesFormData {
  income: string;
  job_stability: string;
  workplace_benefits: string;
  flexible_schedule: string;
  job_satisfaction: string;
  financial_feelings: string;
  build_resources: string;
}

/**
 * Function to parse financial resources data from the database
 */
export const parseFinancialResourcesData = (data: any): FinancialResourcesFormData => {
  if (!data) {
    console.log("parseFinancialResourcesData: No data to parse");
    return {
      income: "",
      job_stability: "",
      workplace_benefits: "",
      flexible_schedule: "",
      job_satisfaction: "",
      financial_feelings: "",
      build_resources: ""
    };
  }

  try {
    console.log("parseFinancialResourcesData: Raw data received:", data);

    // Create a clean data object with safer parsing
    const cleanData: FinancialResourcesFormData = {
      income: parseStringField(data.income),
      job_stability: parseStringField(data.job_stability),
      workplace_benefits: parseStringField(data.workplace_benefits),
      flexible_schedule: parseStringField(data.flexible_schedule),
      job_satisfaction: parseStringField(data.job_satisfaction),
      financial_feelings: parseStringField(data.financial_feelings),
      build_resources: parseStringField(data.build_resources)
    };

    console.log("parseFinancialResourcesData: Parsed data:", cleanData);
    return cleanData;
  } catch (parseError) {
    console.error("parseFinancialResourcesData: Error parsing data:", parseError);
    return {
      income: "",
      job_stability: "",
      workplace_benefits: "",
      flexible_schedule: "",
      job_satisfaction: "",
      financial_feelings: "",
      build_resources: ""
    };
  }
};
