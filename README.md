# VS Code-Themed Portfolio with AI Integration 🚀

Live link https://ryvs-code.vercel.app/

An innovative portfolio website that replicates the Visual Studio Code interface while incorporating advanced AI features for interactive user engagement. Built with React, TypeScript, and Google's Gemini AI.

![screenshot (4)](https://github.com/user-attachments/assets/1569a642-e9f2-49c3-91fb-275912fbff9b)


## 🌟 Key Features

### 1. AI-Powered Interactive Chat
- 🤖 Integrated with Google's Gemini AI API for natural conversations
- 💡 Context-aware responses about experience, skills, and projects
- ⚡ Real-time streaming responses with typing indicators
- 📝 Markdown and code block support with syntax highlighting
- 🔄 Conversation memory and context maintenance
- 🎯 Custom prompts and quick-start suggestions

### 2. VS Code Interface Recreation
- 🎨 Pixel-perfect VS Code UI components
- 📁 Fully functional file explorer with dynamic routing
- 💻 Interactive terminal with custom commands:
  ```bash
  neofetch   # Display system info with ASCII art
  skills     # List technical skills with categories
  exp        # Show detailed work experience
  projects   # View projects with descriptions
  achievements # Display achievements and awards
  about      # Display personal information
  help       # Show available commands
  clear      # Clear terminal output
  ```
- 🔍 Working search functionality with real-time filtering
- 📊 Git-like status bar with live indicators

### 3. Advanced UI Features
- 🎭 Framer Motion animations for smooth transitions
- 🌓 Custom context menus and tooltips
- 📱 Responsive design with mobile-first approach
- ⌨️ Keyboard shortcuts support
- 🖼️ Dynamic breadcrumbs navigation
- 📍 Minimap with code preview
- 🎯 File tabs with drag-and-drop support

### 4. Portfolio Content
- 📈 Dynamic experience timeline with animations
- 🎯 Project cards with live GitHub stats integration
- 🎓 Interactive education section
- 🏆 Animated achievements showcase
- 📚 Research publications with external links

## 🛠️ Technical Architecture

### Frontend Stack
```typescript
const techStack = {
  core: ['React 18', 'TypeScript', 'Vite'],
  styling: ['TailwindCSS', 'Framer Motion'],
  state: ['React Hooks', 'Context API'],
  icons: ['Lucide React'],
  ai: ['Google Generative AI'],
  utils: ['React Markdown', 'Date-fns']
};
```

### Key Technical Features
- 🔥 Server-Side Events for real-time AI responses
- 🔄 Custom hooks for terminal and file system operations
- 🎨 Advanced TailwindCSS configurations with custom animations
- 🔍 Optimized rendering with React.memo and useMemo
- 📦 Module federation for dynamic imports
- 🌐 SEO optimizations with meta tags

## 🚀 Quick Start

1. Clone and install:
```bash
git clone https://github.com/yourusername/vscode-portfolio.git
cd vscode-portfolio
npm install
```

2. Configure environment:
```bash
# .env
VITE_GEMINI_API_KEY=your_api_key_here
```

3. Start development server:
```bash
npm run dev
```

## 💡 AI Chat Features

The integrated AI chat system offers:
- Natural language understanding of portfolio content
- Real-time code explanations and syntax highlighting
- Context-aware responses about projects and experience
- Multi-turn conversations with memory
- Custom prompt templates for common queries
- Voice input support (coming soon)

## 🎯 Development Features

- 📦 Modular component architecture
- 🔄 Custom hooks for common functionality
- 🎨 Themed components with TailwindCSS
- 🌐 API integration with TypeScript types
- 📱 Responsive breakpoint system
- 🧪 Unit test setup with Vitest

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
