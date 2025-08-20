* Disclaimer, 100% vibes

# JavaScript Browser Support Analyzer

[![Deploy to GitHub Pages](https://github.com/ASOS-JoeGandy/browser-support-tool/actions/workflows/deploy.yml/badge.svg)](https://github.com/ASOS-JoeGandy/browser-support-tool/actions/workflows/deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A powerful, comprehensive JavaScript browser compatibility analyzer that detects **114+ modern JavaScript features** and provides detailed browser support information. Built with Next.js 15, TypeScript, and a beautiful dark mode interface.

🌐 **[Live Demo on GitHub Pages](https://asos-joegandy.github.io/browser-support-tool/)**

![Browser Support Analyzer Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=JavaScript+Browser+Support+Analyzer)

## ✨ Features

- 🔍 **Comprehensive Analysis**: Detects **114+ JavaScript features** using advanced Babel AST parsing
- 🌐 **Full Browser Coverage**: Chrome, Firefox, Safari, Edge, and Internet Explorer compatibility
- 📊 **Smart Categorization**: Features organized into **12 logical categories**
- ⚡ **Real-time Analysis**: Instant feedback with syntax highlighting and line numbers
- � **Minimum Version Calculation**: Automatically determines required browser versions
- 🌙 **Beautiful Dark UI**: Modern, responsive interface with code highlighting
- 📱 **Mobile Optimized**: Works flawlessly on all device sizes
- 🚀 **Auto-deployment**: CI/CD pipeline with GitHub Actions
- 💾 **Code Snippets**: Shows exact code locations for each detected feature
- 🎨 **Visual Browser Icons**: Clear browser support indicators

## 🚀 Supported JavaScript Features (114+)

Our analyzer provides the most comprehensive coverage available, detecting features across **12 categories**:

<details>
<summary><strong>📝 Syntax Features (15)</strong></summary>

- Arrow Functions (`() => {}`)
- ES6 Classes & Private Fields
- Template Literals (`` `Hello ${name}` ``)
- Destructuring Assignment
- Spread/Rest Operators
- Const/Let Declarations
- Default Parameters
- Generator Functions
- Static Class Fields
- Private Methods
- Decorators
- Hashbang Grammar

</details>

<details>
<summary><strong>🔧 Built-in Methods (32)</strong></summary>

**Array Methods:**
- `Array.from()`, `Array.fromAsync()` (ES2024)
- `Array.find()`, `Array.findLast()`
- `Array.includes()`, `Array.flat()`, `Array.at()`
- `Array.toReversed()`, `Array.toSorted()`, `Array.with()`

**Object Methods:**
- `Object.assign()`, `Object.entries()`
- `Object.hasOwn()`, `Object.groupBy()`
- `Object.fromEntries()`

**String Methods:**
- `String.includes()`, `String.startsWith()`
- `String.replaceAll()`, `String.at()`
- `String.isWellFormed()` (ES2024)
- `String.padStart()`, `String.trimStart()`

**Modern APIs:**
- `structuredClone()`, `queueMicrotask()`
- `reportError()`, `performance.now()`

</details>

<details>
<summary><strong>🌐 Web APIs (12)</strong></summary>

- `fetch()` API
- `URLSearchParams`, `URL` Constructor
- `AbortController` / `AbortSignal`
- `IntersectionObserver`, `MutationObserver`, `ResizeObserver`
- `localStorage`, `sessionStorage`, `IndexedDB`
- `crypto.getRandomValues()`, `crypto.randomUUID()`

</details>

<details>
<summary><strong>⚡ Async & Concurrency (8)</strong></summary>

- Async/Await Syntax
- Promises & `Promise.allSettled()`
- Top-level Await
- Async Iteration
- `SharedArrayBuffer`, `Atomics`

</details>

<details>
<summary><strong>📦 Modules & Advanced (13)</strong></summary>

- ES6 Import/Export
- Dynamic Import
- `import.meta`
- Optional Chaining (`?.`)
- Nullish Coalescing (`??`)
- BigInt, Logical Assignment
- `globalThis`, Iterator Helpers

</details>

<details>
<summary><strong>🗂️ Data Structures (13)</strong></summary>

- Map, Set, WeakMap, WeakSet
- Symbol, Proxy, Reflect
- WeakRef, FinalizationRegistry
- SharedArrayBuffer, TypedArrays
- Resizable ArrayBuffer

</details>

<details>
<summary><strong>🔍 RegExp & Other (21)</strong></summary>

- Named Capture Groups
- Lookbehind Assertions
- Unicode Property Escapes
- RegExp v Flag
- Intl APIs, Error.cause
- Temporal API (Experimental)
- And more...

</details>

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0+ 
- **Package Manager**: npm, yarn, pnpm, or bun
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ASOS-JoeGandy/browser-support-tool.git
   cd browser-support-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn install / pnpm install / bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build for production (static export)
npm run build

# Preview the build locally
npx serve out
```

## 💡 How to Use

1. **📝 Input Code**: Paste your JavaScript code in the left editor panel
2. **🔍 Analyze**: Click "Analyze Browser Support" or press `Ctrl+Enter`
3. **📊 Review Results**: View comprehensive compatibility data in the right panel
4. **🎯 Understand Support**: 
   - 🟢 **Green**: Full browser support
   - 🟡 **Yellow**: Partial support (with notes)
   - 🔴 **Red**: No support
5. **📍 Code Snippets**: Click on features to see exact code locations
6. **🏷️ Categories**: Browse features by type (Syntax, Web APIs, etc.)

### Example Analysis

```javascript
// Paste this code to see the analyzer in action
const fetchUserData = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();
  
  return {
    ...user,
    displayName: user.name ?? 'Anonymous',
    isActive: user.lastSeen?.getTime() > Date.now() - 86400000
  };
};

// Features detected: fetch(), async/await, template literals, 
// spread operator, nullish coalescing, optional chaining
```

## 🏗️ Project Architecture

```
browser-support-tool/
├── 📁 src/app/
│   ├── 📁 components/
│   │   ├── 📄 CodeInput.tsx           # Code editor with syntax highlighting
│   │   └── 📄 BrowserSupportResult.tsx # Results display & categorization
│   ├── 📁 lib/
│   │   └── 📄 analyzer.ts             # Core analysis engine (Babel AST)
│   ├── 📄 layout.tsx                  # Root layout with metadata
│   ├── 📄 page.tsx                    # Main application page
│   └── 📄 globals.css                 # Global styles & Tailwind
├── 📁 .github/workflows/
│   └── 📄 deploy.yml                  # GitHub Actions CI/CD
├── 📁 public/
│   └── 📄 .nojekyll                   # GitHub Pages configuration
├── 📄 next.config.ts                  # Next.js configuration
└── 📄 package.json                    # Dependencies & scripts
```

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Next.js 15](https://nextjs.org/) | React framework with App Router & static export |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type-safe development |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| **Parsing** | [Babel Parser](https://babeljs.io/docs/en/babel-parser) | JavaScript AST generation |
| **Analysis** | [Babel Traverse](https://babeljs.io/docs/en/babel-traverse) | AST traversal & feature detection |
| **Data** | [Can I Use](https://caniuse.com/) | Browser compatibility database |
| **Deployment** | [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| **Hosting** | [GitHub Pages](https://pages.github.com/) | Static site hosting |

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build production static export
npm run start        # Start production server (after build)
npm run lint         # Run ESLint (disabled in build)

# Deployment
git push origin main # Triggers automatic GitHub Pages deployment
```

### Adding New Features

1. **Define Feature**: Add to `featureMap` in `src/app/lib/analyzer.ts`
2. **Add Detection**: Implement detection logic in Babel traverse visitors
3. **Update Categories**: Add to appropriate category in `BrowserSupportResult.tsx`
4. **Test**: Verify detection with sample code
5. **Document**: Update README feature counts

### Browser Support Data

Feature compatibility data is manually curated based on:
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [ECMAScript Compatibility Table](https://compat-table.github.io/compat-table/es6/)
- Official browser documentation

## 🚢 Deployment

This project features **automatic deployment** to GitHub Pages with every push to the main branch.

### Automatic Deployment (Current Setup)

- **🔄 Trigger**: Every push to `main` branch
- **⚙️ Build**: GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **📦 Export**: Next.js static site generation
- **🌐 Deploy**: Automatic publication to GitHub Pages
- **🔗 URL**: https://asos-joegandy.github.io/browser-support-tool/

### Manual Deployment Setup (For Forks)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to `Settings` → `Pages`
   - Set source to **"GitHub Actions"**
3. **Push to main branch** to trigger deployment

### Deployment Workflow

The GitHub Actions workflow handles:
- ✅ Node.js 18 environment setup
- ✅ Dependency installation (`npm ci`)
- ✅ Production build (`npm run build`)
- ✅ Static export to `out/` directory
- ✅ GitHub Pages deployment
- ✅ Custom domain support (if configured)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Process

1. **🍴 Fork** the repository
2. **🌿 Branch** from main: `git checkout -b feature/amazing-feature`
3. **💻 Develop** your feature or fix
4. **🧪 Test** locally: `npm run dev` and `npm run build`
5. **📝 Commit** with descriptive messages
6. **🚀 Push** to your fork: `git push origin feature/amazing-feature`
7. **🔃 Open** a Pull Request

### Contribution Ideas

- 🆕 **Add new JavaScript features** (ES2025, browser APIs)
- 🎨 **Improve UI/UX** (better visualizations, animations)
- 🐛 **Fix bugs** or improve detection accuracy
- 📚 **Enhance documentation** 
- 🧪 **Add tests** for better reliability
- 🌐 **Internationalization** support

### Code Guidelines

- Use **TypeScript** for type safety
- Follow **ESLint** configuration
- Use **Tailwind CSS** for styling
- Keep components **small and focused**
- Add **JSDoc comments** for complex functions

## 📊 Project Stats

- **✨ Features Detected**: 114+ JavaScript features
- **🏗️ Framework**: Next.js 15 with App Router
- **🎨 Styling**: Tailwind CSS 4
- **📦 Bundle Size**: ~319kB (First Load JS)
- **⚡ Build Time**: ~3-5 seconds
- **🌐 Browser Support**: Chrome 90+, Firefox 88+, Safari 14+

## 🎯 Roadmap

- [ ] **Feature Expansion**: Add more ES2025+ features
- [ ] **Performance**: Implement code splitting and lazy loading
- [ ] **API Integration**: Real-time Can I Use data
- [ ] **Export Options**: PDF reports, JSON/CSV export
- [ ] **Code Suggestions**: Recommend polyfills or alternatives
- [ ] **VS Code Extension**: Direct IDE integration
- [ ] **CI Integration**: GitHub Action for PR analysis

## 📄 License

This project is open source and available under the **[MIT License](LICENSE)**.

```
MIT License - feel free to use, modify, and distribute
Commercial use ✅ | Private use ✅ | Modification ✅ | Distribution ✅
```

## 🙋‍♂️ Support & Questions

### Getting Help

- 🐛 **Bug Reports**: [Open an issue](https://github.com/ASOS-JoeGandy/browser-support-tool/issues/new)
- 💡 **Feature Requests**: [Create a feature request](https://github.com/ASOS-JoeGandy/browser-support-tool/issues/new)
- 💬 **Questions**: [Start a discussion](https://github.com/ASOS-JoeGandy/browser-support-tool/discussions)
- 📧 **Contact**: joe.gandy@asos.com

### Useful Links

- **🌐 Live Demo**: https://asos-joegandy.github.io/browser-support-tool/
- **📚 Documentation**: This README
- **🔄 CI/CD**: [GitHub Actions](https://github.com/ASOS-JoeGandy/browser-support-tool/actions)
- **📊 Compatibility Data**: [Can I Use](https://caniuse.com/)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

⭐ **Star this repository** if you find it useful!

</div>
