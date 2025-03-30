import { ChangeEvent, useState } from "react";

export function useFormData<T extends Record<string, string | number | Date | boolean>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (formData[name] instanceof Date) {
      setFormData({ ...formData, [name]: new Date(value) });
    } else if (e.target.type === "number" || e.target.type === "range") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return { formData, setFormData, loading, setLoading, handleChange };
}