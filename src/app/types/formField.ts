export default interface FormField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
}
