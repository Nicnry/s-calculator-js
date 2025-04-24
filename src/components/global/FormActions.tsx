import { useRouter } from "next/navigation";

type FormActionsProps = {
  loading: boolean;
};

export function FormActions({ loading }: FormActionsProps) {
  const router = useRouter();
  
  return (
    <div className="p-6 flex justify-end items-center">
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors"
        >
          Annuler
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? "En cours..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}