import FormField from "@/types/formField";

export default interface FormComponentProps<T> {
  initialData: T;
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  title: string;
}