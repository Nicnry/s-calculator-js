'use client'

import Link from 'next/link'
import { MoveLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-6 py-12 text-center">
        <div className="relative mb-8">
          <h1 className="font-mono text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
            404
          </h1>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
            <div className="text-8xl font-bold tracking-tighter text-emerald-500 animate-pulse">
              404
            </div>
          </div>
        </div>
        
        <h2 className="mb-6 text-2xl font-medium text-gray-800">
          Ce compte n'existe pas
        </h2>
        
        <p className="mb-8 text-gray-600">
          La page que vous recherchez n'a pas été trouvée. Revenez au tableau de bord pour continuer à gérer votre budget.
        </p>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <MoveLeft size={16} className="mr-2" />
            Retour
          </button>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <Home size={16} className="mr-2" />
            Tableau de bord
          </Link>
        </div>
      </div>
      
      <div className="relative w-full max-w-md h-64 mt-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-auto opacity-80" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="100" y="140" width="40" height="40" rx="4" fill="#10B981" />
            <rect x="150" y="120" width="40" height="60" rx="4" fill="#059669" />
            <rect x="200" y="100" width="40" height="80" rx="4" fill="#10B981" />
            <rect x="250" y="130" width="40" height="50" rx="4" fill="#059669" />
            
            <path d="M100 90C120 85 140 95 160 80C180 65 200 75 220 60C240 45 260 55 280 50" 
                  stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
            
            <circle cx="120" cy="50" r="15" fill="#E0F2FE" />
            <text x="120" y="55" textAnchor="middle" fill="#0369A1" fontFamily="monospace" fontSize="16" fontWeight="bold">€</text>
            
            <circle cx="270" cy="30" r="15" fill="#E0F2FE" />
            <text x="270" y="35" textAnchor="middle" fill="#0369A1" fontFamily="monospace" fontSize="16" fontWeight="bold">€</text>
          </svg>
        </div>
      </div>
    </div>
  )
}