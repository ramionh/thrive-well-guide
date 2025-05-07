
export interface StrengthApplication {
  strength: string;
  application: string;
}

export interface BuildOnYourStrengthsFormProps {
  strengthApplications: StrengthApplication[];
  handleStrengthChange: (index: number, value: string) => void;
  handleApplicationChange: (index: number, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export interface BuildOnYourStrengthsProps {
  onComplete?: () => void;
}
