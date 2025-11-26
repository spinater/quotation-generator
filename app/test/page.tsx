'use client';

import { useState } from 'react';

export default function TestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🧪 UI Interaction Test Page
        </h1>

        {/* Click Test */}
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Click Test
          </h2>
          <button
            onClick={() => setClickCount(clickCount + 1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
            style={{ cursor: 'pointer', zIndex: 1000 }}
          >
            Click Me! (Count: {clickCount})
          </button>
          <p className="mt-4 text-gray-700">
            {clickCount === 0 && '👆 Click the button above'}
            {clickCount > 0 && clickCount < 5 && '✅ Clicking works! Keep going...'}
            {clickCount >= 5 && '🎉 Great! UI interactions are working perfectly!'}
          </p>
        </div>

        {/* Input Test */}
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold text-green-900 mb-4">
            Input Test
          </h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something here..."
            className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
            style={{ cursor: 'text', zIndex: 1000 }}
          />
          <p className="mt-4 text-gray-700">
            {!inputValue && '⌨️ Type in the input above'}
            {inputValue && `✅ You typed: "${inputValue}"`}
          </p>
        </div>

        {/* Link Test */}
        <div className="mb-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            Link Test
          </h2>
          <a
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors"
            style={{ cursor: 'pointer', zIndex: 1000 }}
          >
            Go Back to Home
          </a>
          <p className="mt-4 text-gray-700">
            👆 Click the link above to go back to home page
          </p>
        </div>

        {/* Hover Test */}
        <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">
            Hover Test
          </h2>
          <div
            className="p-4 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition-colors"
            style={{ cursor: 'pointer', zIndex: 1000 }}
          >
            Hover over this box - it should change color
          </div>
        </div>

        {/* Diagnostic Info */}
        <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Diagnostic Info
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ React Client Component: Active</li>
            <li>✅ State Management: {clickCount > 0 || inputValue ? 'Working' : 'Waiting for interaction'}</li>
            <li>✅ Tailwind CSS: {typeof window !== 'undefined' ? 'Loaded' : 'Loading'}</li>
            <li>✅ Browser: {typeof window !== 'undefined' ? window.navigator.userAgent.split(' ').pop() : 'Server'}</li>
          </ul>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-900 mb-4">
            ⚠️ If Nothing Works
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open browser DevTools (F12 or Cmd+Option+I)</li>
            <li>Check Console tab for JavaScript errors</li>
            <li>Check Network tab - ensure CSS is loading</li>
            <li>Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)</li>
            <li>Clear browser cache</li>
            <li>Try a different browser</li>
            <li>Check if browser extensions are blocking interactions</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
