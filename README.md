# 🚀 IDE Quota Checker

A lightweight command-line utility to monitor your AI model usage and quota for your IDE (currently only supports
Antigravity). This tool provides a beautiful, color-coded dashboard directly in your terminal, helping you keep track of
your remaining quotas and reset times.

## ✨ Features

- **Real-time Quota Visualization**: See progress bars for all available models.
- **Automatic Detection**: Automatically finds the running IDE process.
- **Cross-Platform**: Tailored scripts for both Windows and Linux environments.
- **Zero Configuration**: No API keys or manual setup required — simply run the script while your IDE is open.

## 🛠️ Prerequisites

- **Node.js**: (Version 24 or higher recommended)
- **Active IDE**: The IDE must be running.
  - _Tip: If you get an error, try typing a character in your IDE to wake up the language server._

## 💻 Usage

The script automatically detects your operating system and routes to the correct implementation.

```bash
npm start
```

### Options

| Flag      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `--debug` | Prints the full raw JSON response from the IDE instead of the dashboard UI. |

#### Debug Mode

Use `--debug` to dump the complete JSON payload, which is useful for troubleshooting or inspecting all available fields:

```bash
npm start -- --debug
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
│ Plan: Pro                                                Port: 12345 │
├──────────────────────────────────────────────────────────────────────┤
│ Model                         Quota                      Reset       │
├──────────────────────────────────────────────────────────────────────┤
│ Claude Opus 4.5 (Thinking)    ████████████████████ 100%  0d 01h 23m  │
│ Claude Opus 4.6 (Thinking)    ████████████████████ 100%  0d 01h 23m  │
│ Claude Sonnet 4.5             ████████████████████ 100%  0d 01h 23m  │
│ Claude Sonnet 4.5 (Thinking)  ████████████████████ 100%  0d 01h 23m  │
│ Gemini 3 Flash                ████████████████████ 100%  0d 01h 23m  │
│ Gemini 3 Pro (High)           ████████████████████ 100%  0d 01h 23m  │
│ Gemini 3 Pro (Low)            ████████████████████ 100%  0d 01h 23m  │
│ GPT-OSS 120B (Medium)         ████████████████████ 100%  0d 01h 23m  │
╰──────────────────────────────────────────────────────────────────────╯
```

## 💖 Credits

The logic for this tool was adapted from
[this Reddit post](https://www.reddit.com/r/google_antigravity/comments/1qxcrat/oc_never_fly_blind_in_antigravity_again_a_bash/).
