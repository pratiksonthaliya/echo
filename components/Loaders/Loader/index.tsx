import React from 'react'

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="relative mx-auto h-32 w-32">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-75"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500 opacity-50"></div>
          <svg
            className="relative z-10 h-32 w-32 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white animate-pulse">Loading</h2>
        <p className="mt-2 text-sm text-gray-400">Please wait while we process your request.</p>
        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-blue-500"
              style={{ animation: `bounce 1.4s infinite ease-in-out ${i * 0.32}s` }}
            ></div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  )
}
