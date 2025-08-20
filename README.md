# JavaScript Browser Support Analyzer

A powerful Next.js application that analyzes JavaScript code to determine browser compatibility and support. Simply paste your JavaScript code and get detailed insights about which browsers support the features you're using.

## Features

- 🔍 **Code Analysis**: Automatically detects JavaScript features in your code using Babel parser
- 🌐 **Browser Support**: Shows compatibility across Chrome, Firefox, Safari, Edge, and Internet Explorer  
- 📊 **Visual Results**: Clean, intuitive interface with browser support metrics
- ⚡ **Real-time Analysis**: Instant feedback as you paste and analyze code
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Supported JavaScript Features

The analyzer detects and provides compatibility information for:

- Arrow Functions
- Const/Let Declarations  
- Template Literals
- Destructuring Assignment
- Spread Operator
- Async/Await
- Promises
- ES6 Classes
- For...of Loops
- Optional Chaining
- Nullish Coalescing
- Map and Set Objects
- Symbols
- And more...

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
