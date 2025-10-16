# Markdown Capture

A cross-platform Markdown Capture application with global hotkey support that enables frictionless note-taking.

## Features

- **Global Hotkey**: Press `Ctrl+Shift+Space` from any application to instantly open the overlay
- **Intelligent File Naming**: Automatic filename generation with customizable templates
- **Title Extraction**: Smart extraction of titles from markdown content
- **Background Operation**: Runs in system tray with minimal resource usage
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Settings Management**: User-friendly configuration interface
- **Template Support**: Customize filename patterns with placeholders

## Quick Start

1. **Install the application** for your platform
2. **Launch Markdown Capture** - it will appear in your system tray
3. **Press `Ctrl+Shift+Space`** anywhere to open the capture overlay
4. **Type your note** in markdown format
5. **Press `Enter`** to save, or `Escape` to cancel
6. **Find your notes** in the configured save folder (default: Documents/MarkdownCapture)

## Filename Templates

Customize how your files are named using these placeholders:

- `{yyyy}` - Year (4 digits)
- `{MM}` - Month (2 digits)
- `{dd}` - Day (2 digits)
- `{HH}` - Hour (2 digits)
- `{mm}` - Minute (2 digits)
- `{ss}` - Second (2 digits)
- `{title}` - First line of content (sanitized)

**Example Template**: `{yyyy}-{MM}-{dd} {HHmm} {title}.md`
**Result**: `2025-10-16 1430 Meeting Notes.md`

## Keyboard Shortcuts

- `Ctrl+Shift+Space` - Open capture overlay
- `Enter` - Save note and close overlay
- `Shift+Enter` - Add new line in textarea
- `Escape` - Cancel and close overlay

## Settings

Access settings through the system tray menu:

- **Save Folder**: Choose where your markdown files are stored
- **Filename Template**: Customize the naming pattern
- **Test Save**: Verify file saving works correctly

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/markdown-capture.git
cd markdown-capture

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run dist
```

### Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Build application
- `npm run typecheck` - Type checking
- `npm run lint` - Lint code
- `npm run dist` - Create distribution packages
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS app
- `npm run dist:linux` - Build Linux packages

## Tech Stack

- **Electron** - Cross-platform desktop application framework
- **TypeScript** - Type-safe JavaScript
- **React** - User interface
- **Vite** - Fast build tool
- **Electron Builder** - Application packaging

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/markdown-capture/issues) page.

---

Made with ❤️ for note-taking enthusiasts