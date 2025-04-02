import { ReactNode } from "react";

type ValidationRule = {
  pattern?: RegExp;
  message: string;
  validate?: (value: string | number | Date | undefined) => boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: string | number;
  min?: number | Date;
  max?: number | Date;
}

type FormField = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "email" | "password" | "range" | "tel" | "url" | "textarea";
  placeholder?: string;
  value?: string | number | Date;
  options?: Array<{label: string, value: string | number}>;
  icon?: ReactNode;
  min?: number;
  max?: number;
  step?: number | "any";
  validation?: ValidationRule | ValidationRule[];
  errorClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helpText?: string;
  required?: boolean;
  rows?: number;
  cols?: number;
  onChange?: (value: string | number | Date) => void;
  onBlur?: () => void;
}

export default FormField;