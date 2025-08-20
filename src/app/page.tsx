'use client';

import { useState } from 'react';
import { analyzeCode } from './lib/analyzer';
import CodeInput from './components/CodeInput';
import BrowserSupportResult from './components/BrowserSupportResult';

export default function Home() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some JavaScript code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeCode(code);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the code');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            JavaScript Browser Support Analyzer
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Paste your JavaScript code below to check browser compatibility and support information.
            Get detailed insights about which browsers support the features you&apos;re using.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <CodeInput
              code={code}
              onChange={setCode}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              loading={loading}
            />
            
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">
                      Analysis Error
                    </h3>
                    <div className="mt-2 text-sm text-red-200">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <BrowserSupportResult analysis={analysis} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
