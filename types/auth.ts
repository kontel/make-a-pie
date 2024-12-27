export interface UserAuth {
  name: string;
  setName: (name: string) => void;
  reset: () => void;
}

export interface LoginFormProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
}
