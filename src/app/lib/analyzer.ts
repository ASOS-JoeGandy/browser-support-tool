import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

interface CodeSnippet {
  text: string;
  startLine: number;
  matchLine: number;
  matchCol: number;
  matchLength: number;
  matchText: string;
}

interface FeatureSupport {
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
}

interface DetectedFeature extends FeatureSupport {
  codeSnippets: CodeSnippet[];
}

export interface AnalysisResult {
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

// Feature detection mapping
const featureMap: Record<string, FeatureSupport> = {
  'arrow-function': {
    feature: 'Arrow Functions',
    description: 'Arrow function expressions (=>)',
    support: {
      chrome: '45+',
      firefox: '22+',
      safari: '10+',
      edge: '12+',
      ie: 'No'
    }
  },
  'const-declaration': {
    feature: 'Const Declaration',
    description: 'Block-scoped constant declarations',
    support: {
      chrome: '49+',
      firefox: '36+',
      safari: '10+',
      edge: '12+',
      ie: '11*'
    },
    notes: 'IE11 has partial support'
  },
  'let-declaration': {
    feature: 'Let Declaration',
    description: 'Block-scoped variable declarations',
    support: {
      chrome: '49+',
      firefox: '44+',
      safari: '10+',
      edge: '12+',
      ie: '11*'
    },
    notes: 'IE11 has partial support'
  },
  'template-literal': {
    feature: 'Template Literals',
    description: 'Template literal syntax with ${} interpolation',
    support: {
      chrome: '41+',
      firefox: '34+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'destructuring': {
    feature: 'Destructuring Assignment',
    description: 'Destructuring objects and arrays',
    support: {
      chrome: '49+',
      firefox: '41+',
      safari: '8+',
      edge: '14+',
      ie: 'No'
    }
  },
  'spread-operator': {
    feature: 'Spread Operator',
    description: 'Spread syntax (...) for arrays and objects',
    support: {
      chrome: '46+',
      firefox: '16+',
      safari: '10+',
      edge: '12+',
      ie: 'No'
    }
  },
  'async-await': {
    feature: 'Async/Await',
    description: 'Asynchronous function syntax',
    support: {
      chrome: '55+',
      firefox: '52+',
      safari: '10.1+',
      edge: '14+',
      ie: 'No'
    }
  },
  'promise': {
    feature: 'Promises',
    description: 'Native Promise implementation',
    support: {
      chrome: '32+',
      firefox: '29+',
      safari: '7.1+',
      edge: '12+',
      ie: 'No'
    }
  },
  'class-declaration': {
    feature: 'Classes',
    description: 'ES6 class syntax',
    support: {
      chrome: '49+',
      firefox: '45+',
      safari: '9+',
      edge: '13+',
      ie: 'No'
    }
  },
  'for-of': {
    feature: 'For...of Loop',
    description: 'For...of iteration syntax',
    support: {
      chrome: '38+',
      firefox: '13+',
      safari: '7+',
      edge: '12+',
      ie: 'No'
    }
  },
  'optional-chaining': {
    feature: 'Optional Chaining',
    description: 'Optional chaining operator (?.)',
    support: {
      chrome: '80+',
      firefox: '72+',
      safari: '13.1+',
      edge: '80+',
      ie: 'No'
    }
  },
  'nullish-coalescing': {
    feature: 'Nullish Coalescing',
    description: 'Nullish coalescing operator (??)',
    support: {
      chrome: '80+',
      firefox: '72+',
      safari: '13.1+',
      edge: '80+',
      ie: 'No'
    }
  },
  'map-object': {
    feature: 'Map Object',
    description: 'Native Map data structure',
    support: {
      chrome: '38+',
      firefox: '13+',
      safari: '7.1+',
      edge: '12+',
      ie: '11+'
    }
  },
  'set-object': {
    feature: 'Set Object',
    description: 'Native Set data structure',
    support: {
      chrome: '38+',
      firefox: '13+',
      safari: '7.1+',
      edge: '12+',
      ie: '11+'
    }
  },
  'symbol': {
    feature: 'Symbol',
    description: 'Symbol primitive type',
    support: {
      chrome: '38+',
      firefox: '36+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'default-parameters': {
    feature: 'Default Parameters',
    description: 'Function default parameter values',
    support: {
      chrome: '49+',
      firefox: '15+',
      safari: '10+',
      edge: '14+',
      ie: 'No'
    }
  },
  'rest-parameters': {
    feature: 'Rest Parameters',
    description: 'Rest parameters (...args)',
    support: {
      chrome: '47+',
      firefox: '15+',
      safari: '10+',
      edge: '12+',
      ie: 'No'
    }
  },
  'computed-property': {
    feature: 'Computed Property Names',
    description: 'Object computed property names [key]: value',
    support: {
      chrome: '47+',
      firefox: '34+',
      safari: '8+',
      edge: '12+',
      ie: 'No'
    }
  },
  'shorthand-property': {
    feature: 'Shorthand Properties',
    description: 'Object shorthand property syntax {a, b}',
    support: {
      chrome: '43+',
      firefox: '33+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'method-definition': {
    feature: 'Method Definitions',
    description: 'Object method shorthand {method() {}}',
    support: {
      chrome: '39+',
      firefox: '34+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'generator-function': {
    feature: 'Generator Functions',
    description: 'Generator functions function*',
    support: {
      chrome: '39+',
      firefox: '26+',
      safari: '10+',
      edge: '13+',
      ie: 'No'
    }
  },
  'import-statement': {
    feature: 'ES6 Modules (import)',
    description: 'ES6 import statements',
    support: {
      chrome: '61+',
      firefox: '60+',
      safari: '10.1+',
      edge: '16+',
      ie: 'No'
    }
  },
  'export-statement': {
    feature: 'ES6 Modules (export)',
    description: 'ES6 export statements',
    support: {
      chrome: '61+',
      firefox: '60+',
      safari: '10.1+',
      edge: '16+',
      ie: 'No'
    }
  },
  'dynamic-import': {
    feature: 'Dynamic Import',
    description: 'Dynamic import() syntax',
    support: {
      chrome: '63+',
      firefox: '67+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'array-from': {
    feature: 'Array.from()',
    description: 'Array.from() method',
    support: {
      chrome: '45+',
      firefox: '32+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'array-find': {
    feature: 'Array.find()',
    description: 'Array.prototype.find() method',
    support: {
      chrome: '45+',
      firefox: '25+',
      safari: '7.1+',
      edge: '12+',
      ie: 'No'
    }
  },
  'array-findindex': {
    feature: 'Array.findIndex()',
    description: 'Array.prototype.findIndex() method',
    support: {
      chrome: '45+',
      firefox: '25+',
      safari: '7.1+',
      edge: '12+',
      ie: 'No'
    }
  },
  'array-includes': {
    feature: 'Array.includes()',
    description: 'Array.prototype.includes() method',
    support: {
      chrome: '47+',
      firefox: '43+',
      safari: '9+',
      edge: '14+',
      ie: 'No'
    }
  },
  'array-flat': {
    feature: 'Array.flat()',
    description: 'Array.prototype.flat() method',
    support: {
      chrome: '69+',
      firefox: '62+',
      safari: '12+',
      edge: '79+',
      ie: 'No'
    }
  },
  'array-flatmap': {
    feature: 'Array.flatMap()',
    description: 'Array.prototype.flatMap() method',
    support: {
      chrome: '69+',
      firefox: '62+',
      safari: '12+',
      edge: '79+',
      ie: 'No'
    }
  },
  'object-assign': {
    feature: 'Object.assign()',
    description: 'Object.assign() method',
    support: {
      chrome: '45+',
      firefox: '34+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'object-keys': {
    feature: 'Object.keys()',
    description: 'Object.keys() method',
    support: {
      chrome: '5+',
      firefox: '4+',
      safari: '5+',
      edge: '12+',
      ie: '9+'
    }
  },
  'object-values': {
    feature: 'Object.values()',
    description: 'Object.values() method',
    support: {
      chrome: '54+',
      firefox: '47+',
      safari: '10.1+',
      edge: '14+',
      ie: 'No'
    }
  },
  'object-entries': {
    feature: 'Object.entries()',
    description: 'Object.entries() method',
    support: {
      chrome: '54+',
      firefox: '47+',
      safari: '10.1+',
      edge: '14+',
      ie: 'No'
    }
  },
  'object-fromentries': {
    feature: 'Object.fromEntries()',
    description: 'Object.fromEntries() method',
    support: {
      chrome: '73+',
      firefox: '63+',
      safari: '12.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'string-includes': {
    feature: 'String.includes()',
    description: 'String.prototype.includes() method',
    support: {
      chrome: '41+',
      firefox: '40+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'string-startswith': {
    feature: 'String.startsWith()',
    description: 'String.prototype.startsWith() method',
    support: {
      chrome: '41+',
      firefox: '17+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'string-endswith': {
    feature: 'String.endsWith()',
    description: 'String.prototype.endsWith() method',
    support: {
      chrome: '41+',
      firefox: '17+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'string-repeat': {
    feature: 'String.repeat()',
    description: 'String.prototype.repeat() method',
    support: {
      chrome: '41+',
      firefox: '24+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'string-padstart': {
    feature: 'String.padStart()',
    description: 'String.prototype.padStart() method',
    support: {
      chrome: '57+',
      firefox: '48+',
      safari: '10+',
      edge: '15+',
      ie: 'No'
    }
  },
  'string-padend': {
    feature: 'String.padEnd()',
    description: 'String.prototype.padEnd() method',
    support: {
      chrome: '57+',
      firefox: '48+',
      safari: '10+',
      edge: '15+',
      ie: 'No'
    }
  },
  'weakmap': {
    feature: 'WeakMap',
    description: 'WeakMap data structure',
    support: {
      chrome: '36+',
      firefox: '6+',
      safari: '7.1+',
      edge: '12+',
      ie: '11+'
    }
  },
  'weakset': {
    feature: 'WeakSet',
    description: 'WeakSet data structure',
    support: {
      chrome: '36+',
      firefox: '34+',
      safari: '9+',
      edge: '12+',
      ie: 'No'
    }
  },
  'proxy': {
    feature: 'Proxy',
    description: 'Proxy object for meta-programming',
    support: {
      chrome: '49+',
      firefox: '18+',
      safari: '10+',
      edge: '12+',
      ie: 'No'
    }
  },
  'reflect': {
    feature: 'Reflect',
    description: 'Reflect global object',
    support: {
      chrome: '49+',
      firefox: '42+',
      safari: '10+',
      edge: '12+',
      ie: 'No'
    }
  },
  'bigint': {
    feature: 'BigInt',
    description: 'BigInt primitive type',
    support: {
      chrome: '67+',
      firefox: '68+',
      safari: '14+',
      edge: '79+',
      ie: 'No'
    }
  },
  'private-fields': {
    feature: 'Private Class Fields',
    description: 'Private class fields (#field)',
    support: {
      chrome: '74+',
      firefox: '90+',
      safari: '14.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'static-class-fields': {
    feature: 'Static Class Fields',
    description: 'Static class fields',
    support: {
      chrome: '72+',
      firefox: '75+',
      safari: '14.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'logical-assignment': {
    feature: 'Logical Assignment',
    description: 'Logical assignment operators (&&=, ||=, ??=)',
    support: {
      chrome: '85+',
      firefox: '79+',
      safari: '14+',
      edge: '85+',
      ie: 'No'
    }
  },
  'numeric-separators': {
    feature: 'Numeric Separators',
    description: 'Numeric separators (1_000_000)',
    support: {
      chrome: '75+',
      firefox: '70+',
      safari: '13+',
      edge: '79+',
      ie: 'No'
    }
  },
  'top-level-await': {
    feature: 'Top-level Await',
    description: 'Await expressions at module top level',
    support: {
      chrome: '89+',
      firefox: '89+',
      safari: '15+',
      edge: '89+',
      ie: 'No'
    }
  },
  'regex-named-groups': {
    feature: 'RegExp Named Capture Groups',
    description: 'Named capture groups in regular expressions (?<name>...)',
    support: {
      chrome: '64+',
      firefox: '78+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'regex-lookbehind': {
    feature: 'RegExp Lookbehind Assertions',
    description: 'Lookbehind assertions in regular expressions (?<=...) (?<!...)',
    support: {
      chrome: '62+',
      firefox: '78+',
      safari: '16.4+',
      edge: '79+',
      ie: 'No'
    }
  },
  'regex-unicode-property': {
    feature: 'RegExp Unicode Property Escapes',
    description: 'Unicode property escapes in regular expressions \\p{...}',
    support: {
      chrome: '64+',
      firefox: '78+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'regex-s-flag': {
    feature: 'RegExp dotAll Flag',
    description: 'Regular expression s flag (dotAll)',
    support: {
      chrome: '62+',
      firefox: '78+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'globalthis': {
    feature: 'globalThis',
    description: 'Global object reference',
    support: {
      chrome: '71+',
      firefox: '65+',
      safari: '12.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'import-meta': {
    feature: 'import.meta',
    description: 'Module metadata object',
    support: {
      chrome: '64+',
      firefox: '62+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'array-at': {
    feature: 'Array.at()',
    description: 'Array.prototype.at() method for relative indexing',
    support: {
      chrome: '92+',
      firefox: '90+',
      safari: '15.4+',
      edge: '92+',
      ie: 'No'
    }
  },
  'string-at': {
    feature: 'String.at()',
    description: 'String.prototype.at() method for relative indexing',
    support: {
      chrome: '92+',
      firefox: '90+',
      safari: '15.4+',
      edge: '92+',
      ie: 'No'
    }
  },
  'string-replaceall': {
    feature: 'String.replaceAll()',
    description: 'String.prototype.replaceAll() method',
    support: {
      chrome: '85+',
      firefox: '77+',
      safari: '13.1+',
      edge: '85+',
      ie: 'No'
    }
  },
  'promise-allsettled': {
    feature: 'Promise.allSettled()',
    description: 'Promise.allSettled() method',
    support: {
      chrome: '76+',
      firefox: '71+',
      safari: '13+',
      edge: '79+',
      ie: 'No'
    }
  },
  'promise-any': {
    feature: 'Promise.any()',
    description: 'Promise.any() method',
    support: {
      chrome: '85+',
      firefox: '79+',
      safari: '14+',
      edge: '85+',
      ie: 'No'
    }
  },
  'intl-relativetimeformat': {
    feature: 'Intl.RelativeTimeFormat',
    description: 'Internationalization relative time formatting',
    support: {
      chrome: '71+',
      firefox: '65+',
      safari: '14+',
      edge: '79+',
      ie: 'No'
    }
  },
  'intl-listformat': {
    feature: 'Intl.ListFormat',
    description: 'Internationalization list formatting',
    support: {
      chrome: '72+',
      firefox: '78+',
      safari: '14.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'finalizationregistry': {
    feature: 'FinalizationRegistry',
    description: 'Weak references and finalization',
    support: {
      chrome: '84+',
      firefox: '79+',
      safari: '14.1+',
      edge: '84+',
      ie: 'No'
    }
  },
  'weakref': {
    feature: 'WeakRef',
    description: 'Weak references',
    support: {
      chrome: '84+',
      firefox: '79+',
      safari: '14.1+',
      edge: '84+',
      ie: 'No'
    }
  },
  'private-methods': {
    feature: 'Private Class Methods',
    description: 'Private class methods (#method)',
    support: {
      chrome: '84+',
      firefox: '90+',
      safari: '15+',
      edge: '84+',
      ie: 'No'
    }
  },
  'array-findlast': {
    feature: 'Array.findLast()',
    description: 'Array.prototype.findLast() method',
    support: {
      chrome: '97+',
      firefox: '104+',
      safari: '15.4+',
      edge: '97+',
      ie: 'No'
    }
  },
  'array-findlastindex': {
    feature: 'Array.findLastIndex()',
    description: 'Array.prototype.findLastIndex() method',
    support: {
      chrome: '97+',
      firefox: '104+',
      safari: '15.4+',
      edge: '97+',
      ie: 'No'
    }
  },
  'structuredclone': {
    feature: 'structuredClone()',
    description: 'Global structuredClone() function',
    support: {
      chrome: '98+',
      firefox: '94+',
      safari: '15.4+',
      edge: '98+',
      ie: 'No'
    }
  },
  'string-matchall': {
    feature: 'String.matchAll()',
    description: 'String.prototype.matchAll() method',
    support: {
      chrome: '73+',
      firefox: '67+',
      safari: '13+',
      edge: '79+',
      ie: 'No'
    }
  },
  'array-toreversed': {
    feature: 'Array.toReversed()',
    description: 'Array.prototype.toReversed() method (immutable reverse)',
    support: {
      chrome: '110+',
      firefox: '115+',
      safari: '16+',
      edge: '110+',
      ie: 'No'
    }
  },
  'array-tosorted': {
    feature: 'Array.toSorted()',
    description: 'Array.prototype.toSorted() method (immutable sort)',
    support: {
      chrome: '110+',
      firefox: '115+',
      safari: '16+',
      edge: '110+',
      ie: 'No'
    }
  },
  'array-tospliced': {
    feature: 'Array.toSpliced()',
    description: 'Array.prototype.toSpliced() method (immutable splice)',
    support: {
      chrome: '110+',
      firefox: '115+',
      safari: '16+',
      edge: '110+',
      ie: 'No'
    }
  },
  'array-with': {
    feature: 'Array.with()',
    description: 'Array.prototype.with() method (immutable element replacement)',
    support: {
      chrome: '110+',
      firefox: '115+',
      safari: '16+',
      edge: '110+',
      ie: 'No'
    }
  },
  'string-trimstart': {
    feature: 'String.trimStart()',
    description: 'String.prototype.trimStart() method',
    support: {
      chrome: '66+',
      firefox: '61+',
      safari: '12+',
      edge: '79+',
      ie: 'No'
    }
  },
  'string-trimend': {
    feature: 'String.trimEnd()',
    description: 'String.prototype.trimEnd() method',
    support: {
      chrome: '66+',
      firefox: '61+',
      safari: '12+',
      edge: '79+',
      ie: 'No'
    }
  },
  'object-hasown': {
    feature: 'Object.hasOwn()',
    description: 'Object.hasOwn() method',
    support: {
      chrome: '93+',
      firefox: '92+',
      safari: '15.4+',
      edge: '93+',
      ie: 'No'
    }
  },
  'object-groupby': {
    feature: 'Object.groupBy()',
    description: 'Object.groupBy() method',
    support: {
      chrome: '117+',
      firefox: '119+',
      safari: '17+',
      edge: '117+',
      ie: 'No'
    }
  },
  'json-parse-reviver': {
    feature: 'JSON.parse() with source',
    description: 'JSON.parse() with source text access',
    support: {
      chrome: '105+',
      firefox: 'No',
      safari: '16+',
      edge: '105+',
      ie: 'No'
    }
  },
  'temporal': {
    feature: 'Temporal API',
    description: 'New date/time API (Stage 3)',
    support: {
      chrome: 'No*',
      firefox: 'No*',
      safari: 'No*',
      edge: 'No*',
      ie: 'No'
    },
    notes: 'Stage 3 proposal, available behind flags'
  },
  'decorators': {
    feature: 'Decorators',
    description: 'Class and method decorators',
    support: {
      chrome: '120+',
      firefox: 'No*',
      safari: 'No*',
      edge: '120+',
      ie: 'No'
    },
    notes: 'Stage 3 proposal with limited support'
  },
  'iterator-helpers': {
    feature: 'Iterator Helpers',
    description: 'Iterator.prototype methods (map, filter, etc.)',
    support: {
      chrome: '122+',
      firefox: 'No*',
      safari: 'No*',
      edge: '122+',
      ie: 'No'
    },
    notes: 'Stage 3 proposal'
  },
  'atomics': {
    feature: 'Atomics',
    description: 'Atomic operations for SharedArrayBuffer',
    support: {
      chrome: '68+',
      firefox: '78+',
      safari: '15.2+',
      edge: '79+',
      ie: 'No'
    }
  },
  'sharedarraybuffer': {
    feature: 'SharedArrayBuffer',
    description: 'Shared memory between workers',
    support: {
      chrome: '68+',
      firefox: '79+',
      safari: '15.2+',
      edge: '79+',
      ie: 'No'
    }
  },
  'bigint64array': {
    feature: 'BigInt64Array',
    description: 'Typed array for 64-bit integers',
    support: {
      chrome: '67+',
      firefox: '68+',
      safari: '15+',
      edge: '79+',
      ie: 'No'
    }
  },
  'biguint64array': {
    feature: 'BigUint64Array',
    description: 'Typed array for 64-bit unsigned integers',
    support: {
      chrome: '67+',
      firefox: '68+',
      safari: '15+',
      edge: '79+',
      ie: 'No'
    }
  },
  'error-cause': {
    feature: 'Error.cause',
    description: 'Error constructor with cause option',
    support: {
      chrome: '93+',
      firefox: '91+',
      safari: '15+',
      edge: '93+',
      ie: 'No'
    }
  },
  'aggregate-error': {
    feature: 'AggregateError',
    description: 'Error that wraps multiple errors',
    support: {
      chrome: '85+',
      firefox: '79+',
      safari: '14+',
      edge: '85+',
      ie: 'No'
    }
  },
  'regex-match-indices': {
    feature: 'RegExp Match Indices',
    description: 'RegExp d flag for match indices',
    support: {
      chrome: '90+',
      firefox: '88+',
      safari: '15+',
      edge: '90+',
      ie: 'No'
    }
  },
  'hashbang': {
    feature: 'Hashbang Grammar',
    description: 'Shebang (#!) support in modules',
    support: {
      chrome: '74+',
      firefox: '67+',
      safari: '13.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'import-assertions': {
    feature: 'Import Assertions',
    description: 'Import with type assertions',
    support: {
      chrome: '91+',
      firefox: 'No*',
      safari: 'No*',
      edge: '91+',
      ie: 'No'
    },
    notes: 'Being replaced by Import Attributes'
  },
  'import-attributes': {
    feature: 'Import Attributes',
    description: 'Import with attributes (replaces assertions)',
    support: {
      chrome: '123+',
      firefox: 'No*',
      safari: 'No*',
      edge: '123+',
      ie: 'No'
    },
    notes: 'Stage 3 proposal'
  },
  'resizable-arraybuffer': {
    feature: 'Resizable ArrayBuffer',
    description: 'ArrayBuffer.prototype.resize()',
    support: {
      chrome: '111+',
      firefox: 'No*',
      safari: '16.4+',
      edge: '111+',
      ie: 'No'
    }
  },
  'async-iteration': {
    feature: 'Async Iteration',
    description: 'for-await-of loops and async generators',
    support: {
      chrome: '63+',
      firefox: '57+',
      safari: '11.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'regex-v-flag': {
    feature: 'RegExp v Flag',
    description: 'RegExp v flag for extended Unicode support',
    support: {
      chrome: '112+',
      firefox: '116+',
      safari: '17+',
      edge: '112+',
      ie: 'No'
    }
  },
  'fetch-api': {
    feature: 'Fetch API',
    description: 'Modern fetch() for network requests',
    support: {
      chrome: '42+',
      firefox: '39+',
      safari: '10.1+',
      edge: '14+',
      ie: 'No'
    }
  },
  'urlsearchparams': {
    feature: 'URLSearchParams',
    description: 'URL query string manipulation API',
    support: {
      chrome: '49+',
      firefox: '29+',
      safari: '10.1+',
      edge: '17+',
      ie: 'No'
    }
  },
  'url-constructor': {
    feature: 'URL Constructor',
    description: 'URL constructor for URL parsing and manipulation',
    support: {
      chrome: '32+',
      firefox: '26+',
      safari: '7+',
      edge: '12+',
      ie: 'No'
    }
  },
  'abortcontroller': {
    feature: 'AbortController',
    description: 'Abort API for cancelling fetch requests',
    support: {
      chrome: '66+',
      firefox: '57+',
      safari: '11.1+',
      edge: '16+',
      ie: 'No'
    }
  },
  'intersectionobserver': {
    feature: 'IntersectionObserver',
    description: 'API to observe element visibility changes',
    support: {
      chrome: '51+',
      firefox: '55+',
      safari: '12.1+',
      edge: '15+',
      ie: 'No'
    }
  },
  'mutationobserver': {
    feature: 'MutationObserver',
    description: 'API to observe DOM mutations',
    support: {
      chrome: '26+',
      firefox: '14+',
      safari: '7+',
      edge: '12+',
      ie: '11+'
    }
  },
  'resizeobserver': {
    feature: 'ResizeObserver',
    description: 'API to observe element resize events',
    support: {
      chrome: '64+',
      firefox: '69+',
      safari: '13.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'array-fromasync': {
    feature: 'Array.fromAsync()',
    description: 'Create array from async iterable (ES2024)',
    support: {
      chrome: '121+',
      firefox: '119+',
      safari: '16.4+',
      edge: '121+',
      ie: 'No'
    }
  },
  'string-iswellformed': {
    feature: 'String.isWellFormed()',
    description: 'Check if string is well-formed Unicode (ES2024)',
    support: {
      chrome: '111+',
      firefox: '119+',
      safari: '16.4+',
      edge: '111+',
      ie: 'No'
    }
  },
  'string-towellformed': {
    feature: 'String.toWellFormed()',
    description: 'Convert to well-formed Unicode string (ES2024)',
    support: {
      chrome: '111+',
      firefox: '119+',
      safari: '16.4+',
      edge: '111+',
      ie: 'No'
    }
  },
  'performance-now': {
    feature: 'performance.now()',
    description: 'High resolution timestamp API',
    support: {
      chrome: '24+',
      firefox: '15+',
      safari: '8+',
      edge: '12+',
      ie: '10+'
    }
  },
  'queuemicrotask': {
    feature: 'queueMicrotask()',
    description: 'Queue a microtask in the event loop',
    support: {
      chrome: '71+',
      firefox: '69+',
      safari: '12.1+',
      edge: '79+',
      ie: 'No'
    }
  },
  'crypto-getrandomvalues': {
    feature: 'crypto.getRandomValues()',
    description: 'Cryptographically secure random values',
    support: {
      chrome: '11+',
      firefox: '26+',
      safari: '6.1+',
      edge: '12+',
      ie: '11+'
    }
  },
  'crypto-randomuuid': {
    feature: 'crypto.randomUUID()',
    description: 'Generate cryptographically secure UUIDs',
    support: {
      chrome: '92+',
      firefox: '95+',
      safari: '15.4+',
      edge: '92+',
      ie: 'No'
    }
  },
  'typedarray-at': {
    feature: 'TypedArray.at()',
    description: 'Array.at() method for TypedArrays',
    support: {
      chrome: '92+',
      firefox: '90+',
      safari: '15.4+',
      edge: '92+',
      ie: 'No'
    }
  },
  'typedarray-with': {
    feature: 'TypedArray.with()',
    description: 'Array.with() method for TypedArrays',
    support: {
      chrome: '110+',
      firefox: '115+',
      safari: '16+',
      edge: '110+',
      ie: 'No'
    }
  },
  'localstorage': {
    feature: 'localStorage',
    description: 'Local storage web API',
    support: {
      chrome: '4+',
      firefox: '3.5+',
      safari: '4+',
      edge: '12+',
      ie: '8+'
    }
  },
  'sessionstorage': {
    feature: 'sessionStorage',
    description: 'Session storage web API',
    support: {
      chrome: '5+',
      firefox: '2+',
      safari: '4+',
      edge: '12+',
      ie: '8+'
    }
  },
  'indexeddb': {
    feature: 'IndexedDB',
    description: 'Client-side database API',
    support: {
      chrome: '24+',
      firefox: '16+',
      safari: '7+',
      edge: '12+',
      ie: '10+'
    }
  },
  'reporterror': {
    feature: 'reportError()',
    description: 'Report unhandled exceptions to global error handlers',
    support: {
      chrome: '95+',
      firefox: '93+',
      safari: '15.4+',
      edge: '95+',
      ie: 'No'
    }
  }
};

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const detectedFeatures: Set<string> = new Set();
  const featureSnippets: Map<string, Set<CodeSnippet>> = new Map();

  // Helper function to extract code snippet around a node with context
  const extractSnippet = (start: number, end: number): CodeSnippet => {
    const lines = code.split('\n');
    let currentPos = 0;
    let startLine = 0;
    let endLine = 0;
    let startCol = 0;

    // Find line numbers for start and end positions
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline
      if (currentPos + lineLength > start && startLine === 0) {
        startLine = i + 1;
        startCol = start - currentPos;
      }
      if (currentPos + lineLength > end && endLine === 0) {
        endLine = i + 1;
        break;
      }
      currentPos += lineLength;
    }

    // Extract context lines (2 before, 2 after)
    const contextStart = Math.max(0, startLine - 3);
    const contextEnd = Math.min(lines.length, endLine + 2);
    const contextLines = lines.slice(contextStart, contextEnd);
    
    const matchText = code.slice(start, end);
    
    return {
      text: contextLines.join('\n'),
      startLine: contextStart + 1,
      matchLine: startLine,
      matchCol: startCol,
      matchLength: end - start,
      matchText
    };
  };

  // Helper function to add feature with snippet
  const addFeature = (featureKey: string, start?: number | null, end?: number | null) => {
    detectedFeatures.add(featureKey);
    
    if (start !== null && start !== undefined && end !== null && end !== undefined) {
      if (!featureSnippets.has(featureKey)) {
        featureSnippets.set(featureKey, new Set());
      }
      const snippet = extractSnippet(start, end);
      featureSnippets.get(featureKey)!.add(snippet);
    }
  };

  try {
    // Check for hashbang at the start of the code
    if (code.startsWith('#!')) {
      addFeature('hashbang', 0, 2);
    }

    // Parse the code with Babel
    const ast = parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: [
        'jsx',
        'typescript',
        'decorators-legacy',
        'classProperties',
        'objectRestSpread',
        'functionBind',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'dynamicImport',
        'nullishCoalescingOperator',
        'optionalChaining'
      ]
    });

    // Traverse the AST to detect features
    traverse(ast, {
      ArrowFunctionExpression(path) {
        addFeature('arrow-function', path.node.start, path.node.end);
        // Check for default parameters
        if (path.node.params.some(param => t.isAssignmentPattern(param))) {
          addFeature('default-parameters', path.node.start, path.node.end);
        }
        // Check for rest parameters
        if (path.node.params.some(param => t.isRestElement(param))) {
          addFeature('rest-parameters', path.node.start, path.node.end);
        }
      },
      VariableDeclaration(path) {
        if (path.node.kind === 'const') {
          addFeature('const-declaration', path.node.start, path.node.end);
        }
        if (path.node.kind === 'let') {
          addFeature('let-declaration', path.node.start, path.node.end);
        }
      },
      TemplateLiteral(path) {
        addFeature('template-literal', path.node.start, path.node.end);
      },
      ObjectPattern(path) {
        addFeature('destructuring', path.node.start, path.node.end);
      },
      ArrayPattern(path) {
        addFeature('destructuring', path.node.start, path.node.end);
      },
      SpreadElement(path) {
        addFeature('spread-operator', path.node.start, path.node.end);
      },
      RestElement(path) {
        addFeature('spread-operator', path.node.start, path.node.end);
      },
      AwaitExpression(path) {
        addFeature('async-await', path.node.start, path.node.end);
        
        // Check if this await is at the top level (not inside a function)
        let parent = path.scope.parent;
        let isTopLevel = true;
        while (parent) {
          if (parent.block.type === 'Program') {
            break;
          }
          if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'ObjectMethod', 'ClassMethod'].includes(parent.block.type)) {
            isTopLevel = false;
            break;
          }
          parent = parent.parent;
        }
        if (isTopLevel) {
          addFeature('top-level-await', path.node.start, path.node.end);
        }
      },
      FunctionDeclaration(path) {
        if (path.node.async) {
          addFeature('async-await', path.node.start, path.node.end);
        }
        if (path.node.generator) {
          addFeature('generator-function', path.node.start, path.node.end);
        }
        // Check for default parameters
        if (path.node.params.some(param => t.isAssignmentPattern(param))) {
          addFeature('default-parameters', path.node.start, path.node.end);
        }
        // Check for rest parameters
        if (path.node.params.some(param => t.isRestElement(param))) {
          addFeature('rest-parameters', path.node.start, path.node.end);
        }
      },
      FunctionExpression(path) {
        if (path.node.async) {
          addFeature('async-await', path.node.start, path.node.end);
        }
        if (path.node.generator) {
          addFeature('generator-function', path.node.start, path.node.end);
        }
        // Check for default parameters
        if (path.node.params.some(param => t.isAssignmentPattern(param))) {
          addFeature('default-parameters', path.node.start, path.node.end);
        }
        // Check for rest parameters
        if (path.node.params.some(param => t.isRestElement(param))) {
          addFeature('rest-parameters', path.node.start, path.node.end);
        }
      },
      NewExpression(path) {
        if (t.isIdentifier(path.node.callee)) {
          const name = path.node.callee.name;
          if (name === 'Promise') {
            addFeature('promise', path.node.start, path.node.end);
          }
          if (name === 'Map') {
            addFeature('map-object', path.node.start, path.node.end);
          }
          if (name === 'Set') {
            addFeature('set-object', path.node.start, path.node.end);
          }
          if (name === 'WeakMap') {
            addFeature('weakmap', path.node.start, path.node.end);
          }
          if (name === 'WeakSet') {
            addFeature('weakset', path.node.start, path.node.end);
          }
          if (name === 'WeakRef') {
            addFeature('weakref', path.node.start, path.node.end);
          }
          if (name === 'FinalizationRegistry') {
            addFeature('finalizationregistry', path.node.start, path.node.end);
          }
          if (name === 'Proxy') {
            addFeature('proxy', path.node.start, path.node.end);
          }
          if (name === 'SharedArrayBuffer') {
            addFeature('sharedarraybuffer', path.node.start, path.node.end);
          }
          if (name === 'BigInt64Array') {
            addFeature('bigint64array', path.node.start, path.node.end);
          }
          if (name === 'BigUint64Array') {
            addFeature('biguint64array', path.node.start, path.node.end);
          }
          if (name === 'AggregateError') {
            addFeature('aggregate-error', path.node.start, path.node.end);
          }
          // Check for Error with cause
          if (name === 'Error' && path.node.arguments.length >= 2) {
            // Check if second argument is an object (could have cause)
            const secondArg = path.node.arguments[1];
            if (t.isObjectExpression(secondArg)) {
              addFeature('error-cause', path.node.start, path.node.end);
            }
          }
        }
        // Check for Intl.RelativeTimeFormat, Intl.ListFormat
        if (t.isMemberExpression(path.node.callee) && 
            t.isIdentifier(path.node.callee.object) && 
            path.node.callee.object.name === 'Intl') {
          if (t.isIdentifier(path.node.callee.property)) {
            const intlFeature = path.node.callee.property.name;
            if (intlFeature === 'RelativeTimeFormat') {
              addFeature('intl-relativetimeformat', path.node.start, path.node.end);
            }
            if (intlFeature === 'ListFormat') {
              addFeature('intl-listformat', path.node.start, path.node.end);
            }
          }
        }
      },
      ClassDeclaration(path) {
        addFeature('class-declaration', path.node.start, path.node.end);
      },
      ClassExpression(path) {
        addFeature('class-declaration', path.node.start, path.node.end);
      },
      ClassProperty(path) {
        if (path.node.static) {
          addFeature('static-class-fields', path.node.start, path.node.end);
        }
      },
      PrivateName(path) {
        addFeature('private-fields', path.node.start, path.node.end);
      },
      ForOfStatement(path) {
        addFeature('for-of', path.node.start, path.node.end);
        // Check for for-await-of (async iteration)
        if (path.node.await) {
          addFeature('async-iteration', path.node.start, path.node.end);
        }
      },
      OptionalMemberExpression(path) {
        addFeature('optional-chaining', path.node.start, path.node.end);
      },
      OptionalCallExpression(path) {
        addFeature('optional-chaining', path.node.start, path.node.end);
      },
      LogicalExpression(path) {
        if (path.node.operator === '??') {
          addFeature('nullish-coalescing', path.node.start, path.node.end);
        }
      },
      AssignmentExpression(path) {
        if (['&&=', '||=', '??='].includes(path.node.operator)) {
          addFeature('logical-assignment', path.node.start, path.node.end);
        }
      },
      ObjectProperty(path) {
        // Computed property names
        if (path.node.computed) {
          addFeature('computed-property', path.node.start, path.node.end);
        }
        // Shorthand properties
        if (path.node.shorthand) {
          addFeature('shorthand-property', path.node.start, path.node.end);
        }
      },
      ObjectMethod() {
        detectedFeatures.add('method-definition');
      },
      ImportDeclaration(path) {
        detectedFeatures.add('import-statement');
        
        // Check for import assertions/attributes
        if (path.node.attributes && path.node.attributes.length > 0) {
          addFeature('import-attributes', path.node.start, path.node.end);
        }
        // Legacy: check for assertions (older syntax)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((path.node as any).assertions && (path.node as any).assertions.length > 0) {
          addFeature('import-assertions', path.node.start, path.node.end);
        }
      },
      ExportNamedDeclaration() {
        detectedFeatures.add('export-statement');
      },
      ExportDefaultDeclaration() {
        detectedFeatures.add('export-statement');
      },
      Import() {
        detectedFeatures.add('dynamic-import');
      },
      NumericLiteral(path) {
        // Check for numeric separators
        if (path.node.extra && typeof path.node.extra.raw === 'string' && path.node.extra.raw.includes('_')) {
          detectedFeatures.add('numeric-separators');
        }
      },
      BigIntLiteral() {
        detectedFeatures.add('bigint');
      },
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee)) {
          if (path.node.callee.name === 'Symbol') {
            addFeature('symbol', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'structuredClone') {
            addFeature('structuredclone', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'fetch') {
            addFeature('fetch-api', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'queueMicrotask') {
            addFeature('queuemicrotask', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'reportError') {
            addFeature('reporterror', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'AbortController') {
            addFeature('abortcontroller', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'IntersectionObserver') {
            addFeature('intersectionobserver', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'MutationObserver') {
            addFeature('mutationobserver', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'ResizeObserver') {
            addFeature('resizeobserver', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'URL') {
            addFeature('url-constructor', path.node.start, path.node.end);
          }
          if (path.node.callee.name === 'URLSearchParams') {
            addFeature('urlsearchparams', path.node.start, path.node.end);
          }
        }
        
        // Check for various built-in methods
        if (t.isMemberExpression(path.node.callee)) {
          const object = path.node.callee.object;
          const property = path.node.callee.property;
          
          if (t.isIdentifier(property)) {
            const methodName = property.name;
            
            // Array methods
            if (methodName === 'find') addFeature('array-find', path.node.start, path.node.end);
            if (methodName === 'findIndex') addFeature('array-findindex', path.node.start, path.node.end);
            if (methodName === 'findLast') addFeature('array-findlast', path.node.start, path.node.end);
            if (methodName === 'findLastIndex') addFeature('array-findlastindex', path.node.start, path.node.end);
            if (methodName === 'at') {
              // Could be Array.at or String.at
              addFeature('array-at', path.node.start, path.node.end);
              addFeature('string-at', path.node.start, path.node.end);
            }
            if (methodName === 'includes') {
              // Could be Array.includes or String.includes
              addFeature('array-includes', path.node.start, path.node.end);
              addFeature('string-includes', path.node.start, path.node.end);
            }
            if (methodName === 'flat') addFeature('array-flat', path.node.start, path.node.end);
            if (methodName === 'flatMap') addFeature('array-flatmap', path.node.start, path.node.end);
            if (methodName === 'startsWith') addFeature('string-startswith', path.node.start, path.node.end);
            if (methodName === 'endsWith') addFeature('string-endswith', path.node.start, path.node.end);
            if (methodName === 'repeat') addFeature('string-repeat', path.node.start, path.node.end);
            if (methodName === 'padStart') addFeature('string-padstart', path.node.start, path.node.end);
            if (methodName === 'padEnd') addFeature('string-padend', path.node.start, path.node.end);
            if (methodName === 'replaceAll') addFeature('string-replaceall', path.node.start, path.node.end);
            if (methodName === 'matchAll') addFeature('string-matchall', path.node.start, path.node.end);
            if (methodName === 'trimStart') addFeature('string-trimstart', path.node.start, path.node.end);
            if (methodName === 'trimEnd') addFeature('string-trimend', path.node.start, path.node.end);
            if (methodName === 'toReversed') addFeature('array-toreversed', path.node.start, path.node.end);
            if (methodName === 'toSorted') addFeature('array-tosorted', path.node.start, path.node.end);
            if (methodName === 'toSpliced') addFeature('array-tospliced', path.node.start, path.node.end);
            if (methodName === 'with') addFeature('array-with', path.node.start, path.node.end);
            
            // Static methods
            if (t.isIdentifier(object)) {
              if (object.name === 'Array') {
                if (methodName === 'from') addFeature('array-from', path.node.start, path.node.end);
                if (methodName === 'fromAsync') addFeature('array-fromasync', path.node.start, path.node.end);
              }
              if (object.name === 'Object') {
                if (methodName === 'assign') addFeature('object-assign', path.node.start, path.node.end);
                if (methodName === 'keys') addFeature('object-keys', path.node.start, path.node.end);
                if (methodName === 'values') addFeature('object-values', path.node.start, path.node.end);
                if (methodName === 'entries') addFeature('object-entries', path.node.start, path.node.end);
                if (methodName === 'fromEntries') addFeature('object-fromentries', path.node.start, path.node.end);
                if (methodName === 'hasOwn') addFeature('object-hasown', path.node.start, path.node.end);
                if (methodName === 'groupBy') addFeature('object-groupby', path.node.start, path.node.end);
              }
              if (object.name === 'Promise') {
                if (methodName === 'allSettled') addFeature('promise-allsettled', path.node.start, path.node.end);
                if (methodName === 'any') addFeature('promise-any', path.node.start, path.node.end);
              }
              if (object.name === 'Reflect') {
                addFeature('reflect', path.node.start, path.node.end);
              }
              if (object.name === 'JSON' && methodName === 'parse') {
                // Check if it has a third parameter (source)
                if (path.node.arguments.length >= 3) {
                  addFeature('json-parse-reviver', path.node.start, path.node.end);
                }
              }
              if (object.name === 'Atomics') {
                addFeature('atomics', path.node.start, path.node.end);
              }
              if (object.name === 'crypto') {
                if (methodName === 'getRandomValues') addFeature('crypto-getrandomvalues', path.node.start, path.node.end);
                if (methodName === 'randomUUID') addFeature('crypto-randomuuid', path.node.start, path.node.end);
              }
              if (object.name === 'performance' && methodName === 'now') {
                addFeature('performance-now', path.node.start, path.node.end);
              }
            }
            
            // Check for String methods (ES2024)
            if (methodName === 'isWellFormed') addFeature('string-iswellformed', path.node.start, path.node.end);
            if (methodName === 'toWellFormed') addFeature('string-towellformed', path.node.start, path.node.end);
            
            // TypedArray methods
            if (methodName === 'at') {
              // Could be Array.at, String.at, or TypedArray.at
              addFeature('array-at', path.node.start, path.node.end);
              addFeature('string-at', path.node.start, path.node.end);
              addFeature('typedarray-at', path.node.start, path.node.end);
            }
            if (methodName === 'with') {
              // Could be Array.with or TypedArray.with
              addFeature('array-with', path.node.start, path.node.end);
              addFeature('typedarray-with', path.node.start, path.node.end);
            }
          }
        }
      },
      // Check for new global objects and APIs
      MemberExpression(path) {
        if (t.isIdentifier(path.node.object) && path.node.object.name === 'globalThis') {
          addFeature('globalthis', path.node.start, path.node.end);
        }
        if (t.isIdentifier(path.node.object) && path.node.object.name === 'import' && 
            t.isIdentifier(path.node.property) && path.node.property.name === 'meta') {
          addFeature('import-meta', path.node.start, path.node.end);
        }
        if (t.isIdentifier(path.node.object) && path.node.object.name === 'localStorage') {
          addFeature('localstorage', path.node.start, path.node.end);
        }
        if (t.isIdentifier(path.node.object) && path.node.object.name === 'sessionStorage') {
          addFeature('sessionstorage', path.node.start, path.node.end);
        }
        if (t.isIdentifier(path.node.object) && path.node.object.name === 'indexedDB') {
          addFeature('indexeddb', path.node.start, path.node.end);
        }
      },
      // Check for regular expression features
      RegExpLiteral(path) {
        const flags = path.node.flags || '';
        const pattern = path.node.pattern;
        
        // Check for s flag (dotAll)
        if (flags.includes('s')) {
          addFeature('regex-s-flag', path.node.start, path.node.end);
        }
        
        // Check for d flag (match indices)
        if (flags.includes('d')) {
          addFeature('regex-match-indices', path.node.start, path.node.end);
        }
        
        // Check for v flag (extended Unicode)
        if (flags.includes('v')) {
          addFeature('regex-v-flag', path.node.start, path.node.end);
        }
        
        // Check for named capture groups: (?<name>...)
        if (pattern.includes('(?<')) {
          addFeature('regex-named-groups', path.node.start, path.node.end);
        }
        
        // Check for lookbehind assertions: (?<=...) or (?<!...)
        if (pattern.includes('(?<=') || pattern.includes('(?<!')) {
          addFeature('regex-lookbehind', path.node.start, path.node.end);
        }
        
        // Check for unicode property escapes: \p{...}
        if (pattern.includes('\\p{')) {
          addFeature('regex-unicode-property', path.node.start, path.node.end);
        }
      },
      // Check for private methods
      ClassPrivateMethod(path) {
        addFeature('private-methods', path.node.start, path.node.end);
      }
    });

    // Build the result
    const features = Array.from(detectedFeatures)
      .map(featureKey => {
        const featureSupport = featureMap[featureKey];
        if (!featureSupport) return null;
        
        const snippets = featureSnippets.get(featureKey);
        const codeSnippets = snippets ? Array.from(snippets) : [];
        
        return {
          ...featureSupport,
          codeSnippets
        };
      })
      .filter(Boolean) as DetectedFeature[];

    const modernFeatures = features.filter(feature => 
      feature.support.ie === 'No' || feature.support.ie.includes('*')
    ).length;

    const legacySupport = features.every(feature => 
      feature.support.ie !== 'No'
    );

    // Calculate minimum browser versions needed to support ALL features
    const calculateMinimumVersions = (features: FeatureSupport[]) => {
      const browsers = ['chrome', 'firefox', 'safari', 'edge', 'ie'] as const;
      const minimumVersions: Record<string, string> = {};

      browsers.forEach(browser => {
        const versions = features
          .map(feature => feature.support[browser])
          .filter(version => version !== 'No')
          .map(version => {
            // Extract numeric version, handling special cases
            if (version.includes('*')) {
              return parseFloat(version.replace(/[^0-9.]/g, ''));
            }
            return parseFloat(version.replace(/[^0-9.]/g, ''));
          })
          .filter(version => !isNaN(version));

        if (versions.length === 0) {
          minimumVersions[browser] = 'No';
        } else {
          // Find the highest version required by any feature
          // This is the minimum version needed to support ALL detected features
          const requiredVersion = Math.max(...versions);
          minimumVersions[browser] = requiredVersion.toString() + '+';
        }
      });

      return minimumVersions as {
        chrome: string;
        firefox: string;
        safari: string;
        edge: string;
        ie: string;
      };
    };

    const minimumVersions = calculateMinimumVersions(features);

    return {
      features,
      summary: {
        totalFeatures: features.length,
        modernFeatures,
        legacySupport
      },
      minimumVersions
    };

  } catch (error) {
    throw new Error(`Failed to parse JavaScript code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
