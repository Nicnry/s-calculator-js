'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showErrorDetails, setShowErrorDetails] = useState(false)
  
  useEffect(() => {
    // Optionnel: log l'erreur vers un service d'analytics
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center">
          <div className="p-3 mb-4 text-red-500 bg-red-50 rounded-full">
            <AlertTriangle size={28} />
          </div>
          
          <h2 className="text-2xl font-medium text-gray-900">
            Une erreur est survenue
          </h2>
          
          <p className="mt-2 text-center text-gray-600">
            Nous n'avons pas pu traiter votre requête. Veuillez réessayer ou revenir à l'accueil.
          </p>
          
          <div className="grid w-full grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => reset()}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw size={16} className="mr-2" />
              Réessayer
            </button>
            
            <Link 
              href="/"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft size={16} className="mr-2" />
              Accueil
            </Link>
          </div>
          
          <div className="w-full mt-6 border-t border-gray-200">
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="flex items-center justify-between w-full px-2 py-3 text-sm text-gray-500 hover:text-gray-700"
            >
              <span>Détails techniques</span>
              {showErrorDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showErrorDetails && (
              <div className="p-3 mt-1 overflow-auto text-xs font-mono bg-gray-100 rounded-md max-h-36">
                <p className="text-gray-700">
                  {error.message || "Erreur inconnue"}
                </p>
                {error.stack && (
                  <p className="mt-2 text-gray-600">
                    {error.stack}
                  </p>
                )}
                {error.digest && (
                  <p className="mt-2 text-gray-500">
                    ID d'erreur: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}