# ClipForge 📋

**The Modern, Lightweight Clipboard Manager for Power Users.**

ClipForge is a next-generation clipboard manager built for speed and efficiency. It runs silently in the background, capturing everything you copy, and gives you instant access to your history with a simple shortcut. Built with **Tauri v2** and **Angular 20**, it combines the performance of Rust with a modern, reactive UI.

---

## 🚀 Why ClipForge?

Most clipboard managers are bloated or ugly. ClipForge is designed to feel like a native extension of your OS—fast, minimal, and keyboard-centric.

### Key Features

*   **🔄 Infinite Memory (Locally):** Never lose a copied link or snippet again. ClipForge automatically saves your clipboard history.
*   **⚡ Paste-on-Click:** Simply click any item in your history to instantly paste it into your active application. No more `Ctrl+C`, `Alt+Tab`, `Ctrl+V` gymnastics.
*   **📌 Pin Favorites:** Keep frequently used snippets (emails, API keys, templates) at the top of your list.
*   **⌨️ Global Shortcut:** Summon ClipForge from anywhere using `Alt + Shift + V`.
*   **🐧 Linux Optimized:** Special care has been taken to ensure smooth operation on Linux (including Wayland support), solving common focus and window management headaches.
*   **🔒 Privacy First:** All data is stored locally on your machine. Nothing ever leaves your device.

---

## 🛠️ How It Works

ClipForge uses a hybrid architecture to deliver high performance and low resource usage:

### 1. The Brain (Rust 🦀)
The backend is written in Rust using **Tauri**. It handles the heavy lifting:
*   **Clipboard Polling:** A lightweight background thread monitors the system clipboard for changes without blocking the UI.
*   **Input Simulation:** Uses the `enigo` crate to simulate native keystrokes (`Ctrl+V` or `Cmd+V`) for the "Click-to-Paste" feature.
*   **Global Shortcuts:** Registers system-wide hotkeys to toggle the window visibility instantly.

### 2. The Face (Angular 🅰️)
The frontend is built with **Angular 20**, utilizing the latest **Signals** architecture for granular reactivity:
*   **Real-time Updates:** The UI updates instantly when the Rust backend detects a new clipboard item.
*   **Modern Design:** Styled with TailwindCSS and PrimeNG for a clean, Windows 11-inspired aesthetic.

---

## 💻 Development

Want to contribute or build it yourself?

### Prerequisites
- **Node.js** (v18+)
- **Rust** (latest stable)
- **System Dependencies:**
  - Linux: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

### Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/niyonkuruelisa/clipforge.git
    cd clipforge
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run in Development Mode**
    This will start the Angular dev server and the Tauri window.
    ```bash
    npm run tauri dev
    ```

4.  **Build for Production**
    ```bash
    npm run tauri build
    ```

---

## 🎮 Usage Guide

1.  **Copy Text:** Use your system's copy command (`Ctrl+C`) as normal. ClipForge saves it.
2.  **Open ClipForge:** Press `Alt + Shift + V` (or launch from your app menu).
3.  **Paste:** Click on any item in the list. The window will vanish, and the text will be pasted into your previously active window.
4.  **Pin:** Click the "Pin" icon on an item to keep it safe from deletion when the history fills up.
5.  **Delete:** Click the trash icon to remove sensitive items.

---

*Built with ❤️ using Tauri & Angular.*
