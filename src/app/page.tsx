'use client';

import { useState } from 'react';
import { analyzeCode, type AnalysisResult } from './lib/analyzer';
import CodeInput from './components/CodeInput';
import BrowserSupportResult from './components/BrowserSupportResult';

export default function Home() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
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
        <div className="text-center mb-8 relative">
          {/* GitHub Link */}
          <a 
            href="https://github.com/ASOS-JoeGandy/browser-support-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-0 right-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/60 border border-gray-600/30 hover:border-gray-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 group backdrop-blur-sm"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm font-medium">View on GitHub</span>
            <svg 
              className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

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
