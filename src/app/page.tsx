import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Calculateur de salaire
        </h1>
        <p className="text-gray-600 mb-6">
          Consultez la liste des utilisateurs en cliquant sur le lien ci-dessous :
        </p>
        <Link
          href="/users/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Voir les utilisateurs
        </Link>
      </div>
    </div>
  );
}
