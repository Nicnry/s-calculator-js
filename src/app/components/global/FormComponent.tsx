import FormComponentProps from "@/app/types/props/formComponentProps";
import FormField from "@/app/types/formField";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function FormComponent<T extends Record<string, string | number | Date>>({
  initialData,
  fields,
  onSubmit,
  title,
}: FormComponentProps<T>) {
  const router = useRouter();
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (formData[name] instanceof Date) {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const renderField = (field: FormField) => {
    const { name, label, type = "text", options = [] } = field;
    
    if (type === "select") {
      return (
        <div className="flex flex-col" key={name}>
          <label className="text-sm font-semibold text-gray-600">{label}</label>
          <select
            name={name}
            value={String(formData[name])}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="flex flex-col" key={name}>
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name] instanceof Date ? (formData[name] as Date).toISOString().split('T')[0] : formData[name]}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(renderField)}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors w-1/2 mr-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-1/2 ml-2"
          >
            {loading ? "En cours..." : "Valider"}
          </button>
        </div>
      </form>
    </div>
  );
}