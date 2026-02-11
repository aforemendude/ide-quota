# 🚀 IDE Quota Checker

A lightweight command-line utility to monitor your AI model usage and quota for the Antigravity/Codeium IDE extension. This tool provides a beautiful, color-coded dashboard directly in your terminal, helping you keep track of your remaining requests and reset times.

## ✨ Features

- **Real-time Quota Visualization**: See progress bars for all available models (e.g., Claude 3.5 Sonnet, GPT-4o).
- **Automatic Detection**: Automatically finds the running IDE process and extracts the necessary authentication tokens.
- **Cross-Platform**: Tailored scripts for both Windows and Linux environments.
- **Zero Configuration**: No API keys or manual setup required—simply run the script while your IDE is open.

## 🛠️ Prerequisites

- **Node.js**: (Version 18 or higher recommended)
- **Active IDE**: The Antigravity extension must be running in your IDE.
  - _Tip: If the script fails to find a port, try typing a character in your IDE to "wake up" the language server._

---

## 💻 Usage

### Windows

```bash
node ag-quota-windows.js
```

### Linux

```bash
node ag-quota-linux.js
```

---

## ⚠️ Windows Troubleshooting: Enabling WMIC

The Windows script relies on `wmic` (Windows Management Instrumentation Command-line) to identify the IDE process and its parameters. In newer versions of Windows (Windows 11 22H2 and later), `wmic` is deprecated and may be disabled by default.

### How to Enable WMIC

If you encounter an error stating that `'wmic' is not recognized as an internal or external command`, you can enable it using one of the following methods:

#### Method 1: Using PowerShell (Administrator)

Run the following command in an elevated PowerShell window:

```powershell
dism /online /add-capability /capabilityName:WMIC~~~~
```

#### Method 2: Using Windows Settings

1. Open **Settings**.
2. Go to **Apps** > **Optional features**.
3. Click **View features** next to "Add an optional feature".
4. Search for **WMIC**.
5. Select it and click **Next**, then **Install**.

---

## 🎨 Preview

The tool generates a clean, boxed output similar to this:

```text
╭──────────────────────────────────────────────────────────────╮
│ User Name                                                    │
│ user@example.com                                             │
│ Plan: Individual Pro                            Port: 12345  │
├──────────────────────────────────────────────────────────────┤
│ Model                    Quota                 Reset         │
├──────────────────────────────────────────────────────────────┤
│ Claude 3.5 Sonnet        ██████████████░░░░░░    70%  0d 04h 22m │
│ GPT-4o                   ████████████████████   100%  0d 00h 00m │
╰──────────────────────────────────────────────────────────────╯
```

## 📜 License

Private project.
