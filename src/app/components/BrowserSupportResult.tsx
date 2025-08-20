interface CodeSnippet {
  text: string;
  startLine: number;
  matchLine: number;
  matchCol: number;
  matchLength: number;
  matchText: string;
}

interface DetectedFeature {
  feature: string;
  description: string;
  support: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
    ie: string;
  };
  notes?: string;
  codeSnippets: CodeSnippet[];
}

interface AnalysisResult {
  features: DetectedFeature[];
  summary: {
    totalFeatures: number;
    modernFeatures: number;
    legacySupport: boolean;
  };
  minimumVersions: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
    ie: string;
  };
}

interface BrowserSupportResultProps {
  analysis: AnalysisResult | null;
  loading: boolean;
}

const browserIcons = {
  chrome: '🟢',
  firefox: '🟠', 
  safari: '🔵',
  edge: '🟦',
  ie: '🟪'
};

const browserNames = {
  chrome: 'Chrome',
  firefox: 'Firefox',
  safari: 'Safari',
  edge: 'Edge',
  ie: 'Internet Explorer'
};

export default function BrowserSupportResult({ analysis, loading }: BrowserSupportResultProps) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Ready to Analyze</h3>
          <p className="text-gray-300">Paste your JavaScript code and click &ldquo;Analyze Browser Support&rdquo; to see compatibility information.</p>
        </div>
      </div>
    );
  }

  const getSupportColor = (support: string) => {
    if (support === 'No') return 'text-red-300 bg-red-600/20 border border-red-500/30';
    if (support.includes('*')) return 'text-yellow-300 bg-yellow-600/20 border border-yellow-500/30';
    return 'text-green-300 bg-green-600/20 border border-green-500/30';
  };

  const getOverallScore = () => {
    const totalFeatures = analysis.features.length;
    if (totalFeatures === 0) return 100;
    
    const supportedFeatures = analysis.features.filter(feature => 
      Object.values(feature.support).every(support => support !== 'No')
    ).length;
    
    return Math.round((supportedFeatures / totalFeatures) * 100);
  };

  const overallScore = getOverallScore();

  const getFeatureCategories = () => {
    const categories = {
      syntax: ['Arrow Functions', 'Classes', 'Template Literals', 'Destructuring Assignment', 'Spread Operator', 'Const Declaration', 'Let Declaration', 'Default Parameters', 'Rest Parameters', 'Generator Functions', 'Private Class Fields', 'Static Class Fields', 'Private Class Methods', 'Decorators', 'Hashbang Grammar'],
      methods: ['Array.from()', 'Array.fromAsync()', 'Array.find()', 'Array.findIndex()', 'Array.findLast()', 'Array.findLastIndex()', 'Array.includes()', 'Array.flat()', 'Array.flatMap()', 'Array.at()', 'Array.toReversed()', 'Array.toSorted()', 'Array.toSpliced()', 'Array.with()', 'TypedArray.at()', 'TypedArray.with()', 'Object.assign()', 'Object.keys()', 'Object.values()', 'Object.entries()', 'Object.fromEntries()', 'Object.hasOwn()', 'Object.groupBy()', 'String.includes()', 'String.startsWith()', 'String.endsWith()', 'String.repeat()', 'String.padStart()', 'String.padEnd()', 'String.replaceAll()', 'String.at()', 'String.matchAll()', 'String.trimStart()', 'String.trimEnd()', 'String.isWellFormed()', 'String.toWellFormed()', 'structuredClone()', 'queueMicrotask()', 'reportError()'],
      async: ['Async/Await', 'Promises', 'Promise.allSettled()', 'Promise.any()', 'Top-level Await', 'Async Iteration'],
      modules: ['ES6 Modules (import)', 'ES6 Modules (export)', 'Dynamic Import', 'import.meta', 'Import Assertions', 'Import Attributes'],
      advanced: ['Optional Chaining', 'Nullish Coalescing', 'BigInt', 'Logical Assignment', 'Numeric Separators', 'globalThis', 'Iterator Helpers'],
      dataStructures: ['Map Object', 'Set Object', 'WeakMap', 'WeakSet', 'WeakRef', 'FinalizationRegistry', 'Symbol', 'Proxy', 'Reflect', 'SharedArrayBuffer', 'BigInt64Array', 'BigUint64Array', 'Resizable ArrayBuffer'],
      regex: ['RegExp Named Capture Groups', 'RegExp Lookbehind Assertions', 'RegExp Unicode Property Escapes', 'RegExp dotAll Flag', 'RegExp Match Indices', 'RegExp v Flag'],
      intl: ['Intl.RelativeTimeFormat', 'Intl.ListFormat'],
      error: ['Error.cause', 'AggregateError'],
      concurrency: ['Atomics', 'SharedArrayBuffer'],
      webApis: ['Fetch API', 'URLSearchParams', 'URL Constructor', 'AbortController', 'IntersectionObserver', 'MutationObserver', 'ResizeObserver', 'performance.now()', 'crypto.getRandomValues()', 'crypto.randomUUID()', 'localStorage', 'sessionStorage', 'IndexedDB'],
      experimental: ['Temporal API', 'Decorators', 'Iterator Helpers']
    };

    const counts = {
      syntax: 0,
      methods: 0,
      async: 0,
      modules: 0,
      advanced: 0,
      dataStructures: 0,
      regex: 0,
      intl: 0,
      error: 0,
      concurrency: 0,
      webApis: 0,
      experimental: 0
    };

    analysis.features.forEach(feature => {
      Object.entries(categories).forEach(([category, featureNames]) => {
        if (featureNames.includes(feature.feature)) {
          counts[category as keyof typeof counts]++;
        }
      });
    });

    return counts;
  };

  const featureCategories = getFeatureCategories();

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Browser Support Summary</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{analysis.summary.totalFeatures}</div>
            <div className="text-sm text-gray-300">Total Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{analysis.summary.modernFeatures}</div>
            <div className="text-sm text-gray-300">Modern Only</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{analysis.summary.totalFeatures - analysis.summary.modernFeatures}</div>
            <div className="text-sm text-gray-300">Legacy Compatible</div>
          </div>
        </div>

        {/* Feature Categories */}
        {Object.values(featureCategories).some(count => count > 0) && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Feature Categories</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {featureCategories.syntax > 0 && (
                <div className="flex justify-between p-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300">
                  <span>Syntax</span>
                  <span className="font-semibold">{featureCategories.syntax}</span>
                </div>
              )}
              {featureCategories.methods > 0 && (
                <div className="flex justify-between p-2 bg-green-600/20 border border-green-500/30 rounded text-green-300">
                  <span>Methods</span>
                  <span className="font-semibold">{featureCategories.methods}</span>
                </div>
              )}
              {featureCategories.async > 0 && (
                <div className="flex justify-between p-2 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300">
                  <span>Async</span>
                  <span className="font-semibold">{featureCategories.async}</span>
                </div>
              )}
              {featureCategories.modules > 0 && (
                <div className="flex justify-between p-2 bg-yellow-600/20 border border-yellow-500/30 rounded text-yellow-300">
                  <span>Modules</span>
                  <span className="font-semibold">{featureCategories.modules}</span>
                </div>
              )}
              {featureCategories.advanced > 0 && (
                <div className="flex justify-between p-2 bg-red-600/20 border border-red-500/30 rounded text-red-300">
                  <span>Advanced</span>
                  <span className="font-semibold">{featureCategories.advanced}</span>
                </div>
              )}
              {featureCategories.dataStructures > 0 && (
                <div className="flex justify-between p-2 bg-indigo-600/20 border border-indigo-500/30 rounded text-indigo-300">
                  <span>Data Types</span>
                  <span className="font-semibold">{featureCategories.dataStructures}</span>
                </div>
              )}
              {featureCategories.regex > 0 && (
                <div className="flex justify-between p-2 bg-pink-600/20 border border-pink-500/30 rounded text-pink-300">
                  <span>RegExp</span>
                  <span className="font-semibold">{featureCategories.regex}</span>
                </div>
              )}
              {featureCategories.intl > 0 && (
                <div className="flex justify-between p-2 bg-teal-600/20 border border-teal-500/30 rounded text-teal-300">
                  <span>Intl</span>
                  <span className="font-semibold">{featureCategories.intl}</span>
                </div>
              )}
              {featureCategories.error > 0 && (
                <div className="flex justify-between p-2 bg-orange-600/20 border border-orange-500/30 rounded text-orange-300">
                  <span>Error</span>
                  <span className="font-semibold">{featureCategories.error}</span>
                </div>
              )}
              {featureCategories.concurrency > 0 && (
                <div className="flex justify-between p-2 bg-cyan-600/20 border border-cyan-500/30 rounded text-cyan-300">
                  <span>Concurrency</span>
                  <span className="font-semibold">{featureCategories.concurrency}</span>
                </div>
              )}
              {featureCategories.webApis > 0 && (
                <div className="flex justify-between p-2 bg-teal-600/20 border border-teal-500/30 rounded text-teal-300">
                  <span>Web APIs</span>
                  <span className="font-semibold">{featureCategories.webApis}</span>
                </div>
              )}
              {featureCategories.experimental > 0 && (
                <div className="flex justify-between p-2 bg-amber-600/20 border border-amber-500/30 rounded text-amber-300">
                  <span>Experimental</span>
                  <span className="font-semibold">{featureCategories.experimental}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">Overall Compatibility</span>
            <span className="text-sm font-semibold text-white">{overallScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${overallScore >= 80 ? 'bg-green-500' : overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
          <div className={`text-sm p-3 rounded-lg border ${analysis.summary.legacySupport ? 'bg-green-600/20 border-green-500/30 text-green-300' : 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300'}`}>
            {analysis.summary.legacySupport 
              ? '✅ All features have some level of legacy browser support'
              : '⚠️ Some features require modern browsers'
            }
          </div>
        </div>
      </div>

      {/* Compact Features Summary */}
      {analysis.features.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detected Features Summary</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.features.map((feature, index) => {
              const hasIssues = feature.support.ie === 'No' || Object.values(feature.support).some(support => support.includes('*'));
              return (
                <span
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    hasIssues 
                      ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' 
                      : 'bg-green-600/20 text-green-300 border-green-500/30'
                  }`}
                  title={feature.description}
                >
                  {hasIssues && <span className="mr-1">⚠️</span>}
                  {feature.feature}
                </span>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <span className="inline-flex items-center mr-4">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Well supported
            </span>
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
              Modern browsers only
            </span>
          </div>
        </div>
      )}

      {/* Minimum Browser Versions Required */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Minimum Browser Versions Required</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(analysis.minimumVersions).map(([browser, version]) => (
            <div key={browser} className="text-center">
              <div className="text-2xl mb-2">
                {browserIcons[browser as keyof typeof browserIcons]}
              </div>
              <div className="text-sm font-medium text-gray-300 mb-1">
                {browserNames[browser as keyof typeof browserNames]}
              </div>
              <div className={`text-sm px-2 py-1 rounded font-semibold ${getSupportColor(version)}`}>
                {version}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          These are the minimum browser versions you need to target to support ALL JavaScript features in your code. This represents the furthest back you can go while maintaining full compatibility.
        </div>
      </div>

      {/* Features List */}
      {analysis.features.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detected Features</h3>
          
          <div className="space-y-4">
            {analysis.features.map((feature, index) => (
              <div key={index} className="border border-gray-600 bg-gray-800/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{feature.feature}</h4>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                    {feature.notes && (
                      <p className="text-xs text-yellow-400 mt-1">⚠️ {feature.notes}</p>
                    )}
                    {feature.codeSnippets && feature.codeSnippets.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Found in code:</p>
                        <div className="space-y-2">
                          {feature.codeSnippets.slice(0, 3).map((snippet, snippetIndex) => (
                            <div key={snippetIndex} className="bg-gray-900/50 border border-gray-600 rounded text-xs font-mono overflow-x-auto">
                              <div className="bg-gray-700/50 px-2 py-1 text-gray-300 border-b border-gray-600">
                                Match on line {snippet.matchLine}: <span className="font-semibold text-blue-400">{snippet.matchText}</span>
                              </div>
                              <div className="p-2">
                                {snippet.text.split('\n').map((line, lineIndex) => {
                                  const lineNumber = snippet.startLine + lineIndex;
                                  const isMatchLine = lineNumber === snippet.matchLine;
                                  
                                  return (
                                    <div key={lineIndex} className={`flex ${isMatchLine ? 'bg-yellow-900/30' : ''}`}>
                                      <span className="text-gray-500 mr-3 select-none min-w-[2rem] text-right">
                                        {lineNumber}
                                      </span>
                                      <span className="flex-1 text-gray-200">
                                        {isMatchLine ? (
                                          <span>
                                            {line.substring(0, snippet.matchCol)}
                                            <span className="bg-yellow-500 text-black px-1 rounded">
                                              {line.substring(snippet.matchCol, snippet.matchCol + snippet.matchLength)}
                                            </span>
                                            {line.substring(snippet.matchCol + snippet.matchLength)}
                                          </span>
                                        ) : (
                                          line
                                        )}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          {feature.codeSnippets.length > 3 && (
                            <p className="text-xs text-gray-400">+ {feature.codeSnippets.length - 3} more occurrences</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(feature.support).map(([browser, support]) => (
                    <div key={browser} className="text-center">
                      <div className="text-lg mb-1">
                        {browserIcons[browser as keyof typeof browserIcons]}
                      </div>
                      <div className="text-xs font-medium text-gray-300 mb-1">
                        {browserNames[browser as keyof typeof browserNames]}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${getSupportColor(support)}`}>
                        {support}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-gray-300">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Full Support</span>
          </div>
          <div className="flex items-center text-gray-300">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>Partial Support (*)</span>
          </div>
          <div className="flex items-center text-gray-300">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>No Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
