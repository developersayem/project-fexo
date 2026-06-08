import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Secure custom APIs for the renderer process
const api = {
  getSetting: (key: string, defaultValue?: unknown): Promise<unknown> =>
    ipcRenderer.invoke('get-setting', key, defaultValue),
  setSetting: (key: string, value: unknown): Promise<boolean> =>
    ipcRenderer.invoke('set-setting', key, value),
  clearSettings: (): Promise<boolean> => ipcRenderer.invoke('clear-settings'),
  getStorePath: (): Promise<string> => ipcRenderer.invoke('get-store-path')
}

// Expose APIs via contextBridge to protect runtime execution environments
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Error exposing contextBridge APIs:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
