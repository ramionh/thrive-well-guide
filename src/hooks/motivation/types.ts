
export interface MotivationFormOptions<T extends Record<string, any>, U extends Record<string, any> = Record<string, any>> {
  tableName: string;
  initialState: T;
  parseData?: (data: any) => T;
  transformData?: (data: T) => U;
  onSuccess?: () => void;
  stepNumber?: number;
  nextStepNumber?: number;
  stepName?: string;
  nextStepName?: string;
}
