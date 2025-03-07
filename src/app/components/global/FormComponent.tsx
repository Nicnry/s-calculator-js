import FormComponentProps from "@/app/types/props/formComponentProps";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, type = "text" }) => (
          <div className="flex flex-col" key={name}>
            <label className="text-sm font-semibold text-gray-600">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] instanceof Date ? formData[name].toISOString().split('T')[0] : formData[name]}
              onChange={handleChange}
              required
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-1/2 mr-2"
          >
            {loading ? "En cours..." : "Valider"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors w-1/2 ml-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
