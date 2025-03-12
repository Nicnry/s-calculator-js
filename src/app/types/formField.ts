import { ReactNode } from "react";

export default interface FormField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "email" | "password";
  placeholder?: string;
  value?: string;
  options?: string[];
  icon?: ReactNode;
}
