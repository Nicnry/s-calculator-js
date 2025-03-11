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
    const { name, label, type = "text", options = [], icon } = field;
    
    const labelElement = (
      <label 
        className={`text-sm font-semibold text-gray-700 ${icon ? 'flex items-center' : ''}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </label>
    );
    
    if (type === "select") {
      return (
        <div className="space-y-2" key={name}>
          {labelElement}
          <select
            name={name}
            value={String(formData[name])}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="space-y-2" key={name}>
        {labelElement}
        <input
          type={type}
          name={name}
          value={formData[name] instanceof Date ? (formData[name] as Date).toISOString().split('T')[0] : formData[name]}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  const mainTitle = title.split(':')[0];
  const subTitle = title.includes(':') ? title.split(':')[1].trim() : '';

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-blue-50 px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
          {mainTitle.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{mainTitle}</h1>
        {subTitle && <p className="text-gray-500 mb-4">{subTitle}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          {fields.map(renderField)}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Retour
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              {loading ? "En cours..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}