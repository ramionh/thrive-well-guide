
export type QuestionnaireResponse = {
  [key: string]: string | string[];
};

export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
};

export type QuestionnaireSection = {
  title: string;
  questions: Question[];
};
