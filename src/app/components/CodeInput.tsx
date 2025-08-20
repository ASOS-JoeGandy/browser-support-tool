interface CodeInputProps {
  code: string;
  onChange: (code: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  loading: boolean;
}

export default function CodeInput({ code, onChange, onAnalyze, onClear, loading }: CodeInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  const exampleCode = `// Comprehensive JavaScript Features Demo
import { fetchData } from './api.js';
export { UserManager as default };

class UserManager {
  #users = new Map();
  static instance = null;
  
  constructor(initialUsers = []) {
    // For...of loop, destructuring, default parameters
    for (const { id, ...userData } of initialUsers) {
      this.#users.set(id, userData);
    }
  }
  
  // Async/await, template literals, optional chaining
  async fetchUser(userId, options = {}) {
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      
      // Nullish coalescing, object methods
      const user = {
        id: userId,
        name: data?.name ?? 'Unknown',
        email: data.email?.toLowerCase(),
        tags: data.tags?.flat() || [],
        ...Object.fromEntries(
          Object.entries(data.metadata || {})
            .filter(([key]) => key.startsWith('profile_'))
        )
      };
      
      return user;
    } catch (error) {
      console.error('Fetch failed:', error);
      return null;
    }
  }
  
  // Array methods, logical assignment
  updateUsers(updates) {
    const validUpdates = updates.filter(update => 
      update.id && this.#users.has(update.id)
    );
    
    validUpdates.forEach(update => {
      const existing = this.#users.get(update.id);
      existing.lastModified ||= new Date().toISOString();
      Object.assign(existing, update);
    });
    
    return validUpdates.map(u => u.id);
  }
  
  // Generator function, symbols, BigInt
  *getUserBatches(batchSize = 10n) {
    const userArray = Array.from(this.#users.values());
    const batchSymbol = Symbol('batch');
    
    for (let i = 0; i < userArray.length; i += Number(batchSize)) {
      yield {
        [batchSymbol]: userArray.slice(i, i + Number(batchSize)),
        index: i / Number(batchSize)
      };
    }
  }
}

// Modern features: numeric separators, WeakSet, Proxy
const cache = new WeakSet();
const CACHE_SIZE = 1_000_000;

const createProxy = (target) => new Proxy(target, {
  get: Reflect.get,
  set: Reflect.set
});`;

  const insertExample = () => {
    onChange(exampleCode);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">JavaScript Code</h2>
        <button
          onClick={insertExample}
          className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
        >
          Insert Example
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your JavaScript code here..."
            className="w-full h-64 p-4 border border-gray-600 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            Ctrl+Enter to analyze
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onAnalyze}
            disabled={loading || !code.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              'Analyze Browser Support'
            )}
          </button>
          
          <button
            onClick={onClear}
            disabled={loading}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
