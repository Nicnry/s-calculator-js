import FormComponentProps from "@/app/types/props/formComponentProps";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFormData } from "@/app/hooks/useFormData";
import { FormHeader } from "@/app/components/global/FormHeader";
import { FormFields } from "@/app/components/global/FormFields";
import { FormActions } from "@/app/components/global/FormActions";

export default function FormComponent<T extends Record<string, string | number | Date | boolean>>({
  initialData,
  fields,
  onSubmit,
  title,
}: FormComponentProps<T>) {
  const router = useRouter();
  const { formData, loading, setLoading, handleChange } = useFormData<T>(initialData);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      router.back();
    } catch (error) {
      console.error("Erreur lors de la soumission", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <FormHeader title={title} />

      <form onSubmit={handleSubmit}>
        <FormFields 
          fields={fields} 
          formData={formData} 
          handleChange={handleChange} 
        />
        <FormActions loading={loading} />
      </form>
    </div>
  );
}