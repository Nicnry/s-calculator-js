import { useRouter } from "next/navigation";

type FormActionsProps = {
  loading: boolean;
};

export function FormActions({ loading }: FormActionsProps) {
  const router = useRouter();
  
  return (
    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
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
  );
}