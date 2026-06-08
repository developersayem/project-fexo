import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  getSetting: (key: string, defaultValue?: unknown) => Promise<unknown>
  setSetting: (key: string, value: unknown) => Promise<boolean>
  clearSettings: () => Promise<boolean>
  getStorePath: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
