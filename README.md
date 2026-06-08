# Fexo Workspace Monorepo

Welcome to **Fexo**, a unified codebase for both mobile and desktop client implementations.

## Directory Structure

This monorepo is organized as follows:

- **[`mobile/`](./mobile)**: A React Native Expo application (TypeScript, Expo Router, Zustand, React Query, Axios).
- **[`desktop/`](./desktop)**: A sandboxed Electron application scaffolded with Electron Vite + React + TypeScript (secure IPC storage APIs, Zustand settings integration).

---

## 📱 Mobile App (React Native Expo)

### Prerequisites
- Node.js v20+
- `pnpm` package manager

### Getting Started
Navigate to the mobile directory and start the Expo Go metro server:

```bash
cd mobile
pnpm install
pnpm run start
```

Press `i` for iOS, `a` for Android, or `w` for Web.

---

## 💻 Desktop App (ElectronJS)

### Prerequisites
- Node.js v20+
- `pnpm` package manager
- Developed and tested for Apple Silicon (M-series processors) on macOS.

### Getting Started
Navigate to the desktop directory and start the Electron application in hot-reload mode:

```bash
cd desktop
pnpm install
pnpm run dev
```

To build distribution installers for macOS:

```bash
pnpm run build
```
*(Packages target `mac` architecture `arm64` by default.)*
