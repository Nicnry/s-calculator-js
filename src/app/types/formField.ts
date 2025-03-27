import { ReactNode } from "react";

type FormField = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "email" | "password" | "range";
  placeholder?: string;
  value?: string;
  options?: string[];
  icon?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
}

export default FormField;