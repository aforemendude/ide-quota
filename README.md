# 🚀 IDE Quota Checker

A lightweight command-line utility to monitor your AI model usage and quota for the Antigravity/Codeium IDE extension.
This tool provides a beautiful, color-coded dashboard directly in your terminal, helping you keep track of your
remaining requests and reset times.

## ✨ Features

- **Real-time Quota Visualization**: See progress bars for all available models (e.g., Claude 3.5 Sonnet, GPT-4o).
- **Automatic Detection**: Automatically finds the running IDE process and extracts the necessary authentication tokens.
- **Cross-Platform**: Tailored scripts for both Windows and Linux environments.
- **Zero Configuration**: No API keys or manual setup required—simply run the script while your IDE is open.

## 🛠️ Prerequisites

- **Node.js**: (Version 18 or higher recommended)
- **Active IDE**: The Antigravity extension must be running in your IDE.
  - _Tip: If the script fails to find a port, try typing a character in your IDE to wake up the language server._

## 💻 Usage

The utility automatically detects your operating system and routes to the correct implementation.

```bash
# Run using the router
node bin/quota.js
```

## 🛠️ Installation (Optional)

You can link the package locally to run it from anywhere:

```bash
npm link
ide-quota
```

## 🎨 Preview

The tool generates a clean, boxed output similar to this:

```text
╭──────────────────────────────────────────────────────────────────────╮
│ User                                                                 │
│ user@example.com                                                     │
│ Plan: Pro                                                Port: 60411 │
├──────────────────────────────────────────────────────────────────────┤
│ Model                         Quota                      Reset       │
├──────────────────────────────────────────────────────────────────────┤
│ Claude Opus 4.5 (Thinking)    ████████████████████ 100%  0d 03h 38m  │
│ Claude Opus 4.6 (Thinking)    ████████████████████ 100%  0d 03h 38m  │
│ Claude Sonnet 4.5             ████████████████████ 100%  0d 03h 38m  │
│ Claude Sonnet 4.5 (Thinking)  ████████████████████ 100%  0d 03h 38m  │
│ Gemini 3 Flash                ████████████████████ 100%  0d 03h 40m  │
│ Gemini 3 Pro (High)           ████████████████████ 100%  0d 04h 57m  │
│ Gemini 3 Pro (Low)            ████████████████████ 100%  0d 04h 57m  │
│ GPT-OSS 120B (Medium)         ████████████████████ 100%  0d 03h 38m  │
╰──────────────────────────────────────────────────────────────────────╯
```

## 📜 License

Private project.
