# JavaScript Browser Support Analyzer

A powerful Next.js application that analyzes JavaScript code to determine browser compatibility and support. Simply paste your JavaScript code and get detailed insights about which browsers support the features you're using.

🌐 **[Live Demo on GitHub Pages](https://asos-joegandy.github.io/browser-support-tool/)**

## Features

- 🔍 **Comprehensive Analysis**: Detects 114+ JavaScript features using Babel parser
- 🌐 **Browser Support**: Shows compatibility across Chrome, Firefox, Safari, Edge, and Internet Explorer  
- 📊 **Categorized Results**: Features organized into 12 categories (Syntax, Methods, Web APIs, etc.)
- ⚡ **Real-time Analysis**: Instant feedback as you paste and analyze code
- 🌙 **Dark Mode**: Beautiful dark theme interface
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🚀 **Auto-deployment**: Automatically deploys to GitHub Pages on push

## Supported JavaScript Features (114+)

The analyzer detects and provides compatibility information across 12 categories:

### Core Language Features
- **Syntax** (15): Arrow Functions, Classes, Template Literals, Destructuring, Spread Operator, etc.
- **Methods** (32): Array/Object/String methods, including ES2024 features like `Array.fromAsync()`
- **Async** (6): Async/Await, Promises, Top-level Await, Async Iteration
- **Modules** (6): ES6 import/export, Dynamic Import, import.meta
- **Advanced** (7): Optional Chaining, Nullish Coalescing, BigInt, etc.

### Data & APIs
- **Data Structures** (13): Map, Set, WeakMap, Proxy, Reflect, SharedArrayBuffer, etc.
- **Web APIs** (12): fetch(), URLSearchParams, Storage APIs, Observers, Crypto APIs
- **RegExp** (6): Named groups, lookbehind, Unicode properties, v flag
- **Intl** (2): Internationalization APIs
- **Error** (2): Error.cause, AggregateError
- **Concurrency** (2): Atomics, SharedArrayBuffer
- **Experimental** (3): Temporal API, Decorators, Iterator Helpers

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd browser-support-tool
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or 
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev  
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Paste Code**: Enter your JavaScript code in the left panel
2. **Analyze**: Click "Analyze Browser Support" or press Ctrl+Enter
3. **Review Results**: View detailed browser compatibility information in the right panel
4. **Understand Support**: Check the color-coded support levels:
   - 🟢 Green: Full support
   - 🟡 Yellow: Partial support  
   - 🔴 Red: No support

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── CodeInput.tsx          # Code input component
│   │   └── BrowserSupportResult.tsx # Results display component
│   ├── lib/
│   │   └── analyzer.ts            # Code analysis logic
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
```

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Babel Parser**: JavaScript code parsing
- **Babel Traverse**: AST traversal for feature detection

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for automatic deployment to GitHub Pages:

- **Automatic Deployment**: Every push to the `main` branch triggers a GitHub Actions workflow
- **Static Export**: Next.js exports a static site to the `out` directory
- **GitHub Pages**: The site is automatically published to `https://asos-joegandy.github.io/browser-support-tool/`

### Manual Deployment Setup

To set up GitHub Pages for your own fork:

1. Go to your repository's Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to the `main` branch to trigger deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles:
- Installing dependencies
- Building the Next.js application
- Exporting static files
- Deploying to GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
