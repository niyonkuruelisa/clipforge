# ClipForge

**A Modern, Lightweight Clipboard Manager.**

ClipForge is a clipboard manager built for speed and efficiency. It runs in the background, capturing everything you copy, and gives you instant access to your history with a simple shortcut. Built with **Tauri v2** and **Angular 20**.

> **Note:** This project is still in active development. You might encounter errors or bugs. It is currently being developed and tested on **Ubuntu 25.04**, so that is the primary target platform for now.

---

## Why ClipForge?

ClipForge is designed to be fast, minimal, and keyboard-centric.

### Key Features

*   **Infinite Memory (Locally):** Automatically saves your clipboard history.
*   **Paste-on-Click:** Click any item in your history to paste it into your active application.
*   **Pin Favorites:** Keep frequently used snippets at the top of your list.
*   **Global Shortcut:** Open ClipForge from anywhere using `Alt + Shift + V`.
*   **Linux Optimized:** Works smoothly on Linux (including Wayland).
*   **Privacy First:** All data is stored locally on your machine.

---

## How It Works

### 1. The Brain (Rust)
The backend is written in Rust using **Tauri**. It handles:
*   **Clipboard Polling:** Monitors the system clipboard for changes.
*   **Input Simulation:** Simulates native keystrokes for the "Click-to-Paste" feature.
*   **Global Shortcuts:** Registers system-wide hotkeys.

### 2. The Face (Angular)
The frontend is built with **Angular 20**:
*   **Real-time Updates:** Updates instantly when new items are copied.
*   **Modern Design:** Styled with TailwindCSS and PrimeNG.

---

## Development

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
    ```bash
    npm run tauri dev
    ```

4.  **Build for Production**
    ```bash
    npm run tauri build
    ```

### Release Process

To create a new release (e.g., `v0.1.0`):

1.  **Update Version:**
    Update the version number in `package.json` and `src-tauri/tauri.conf.json`.

2.  **Commit Changes:**
    ```bash
    git add .
    git commit -m "chore: bump version to 0.1.0"
    git push
    ```

3.  **Create & Push Tag:**
    The release workflow is triggered by git tags starting with `v`.
    ```bash
    git tag v0.1.0
    git push origin v0.1.0
    ```

4.  **Monitor Build:**
    Go to the **Actions** tab in GitHub to watch the build progress.

5.  **Publish:**
    Once the build completes, a draft release will be created in the **Releases** section with the `.deb` and `.AppImage` artifacts. Edit the release notes and publish it.

---

## Usage Guide

1.  **Copy Text:** Use your system's copy command (`Ctrl+C`) as normal.
2.  **Open ClipForge:** Press `Alt + Shift + V`.
3.  **Paste:** Click on any item in the list to paste it.
4.  **Pin:** Click the "Pin" button to save items.
5.  **Delete:** Click the trash button to remove items.
