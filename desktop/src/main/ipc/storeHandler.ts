import { ipcMain, app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const settingsFilePath = path.join(app.getPath('userData'), 'settings.json')

// Helper to read settings file safely
const readSettings = (): Record<string, unknown> => {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return {}
    }
    const data = fs.readFileSync(settingsFilePath, 'utf8')
    return JSON.parse(data) as Record<string, unknown>
  } catch (error) {
    console.error('Error reading settings file:', error)
    return {}
  }
}

// Helper to write settings file safely
const writeSettings = (settings: Record<string, unknown>): void => {
  try {
    const dir = path.dirname(settingsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing settings file:', error)
  }
}

export function registerStoreHandlers(): void {
  // Get a specific setting value
  ipcMain.handle('get-setting', (_event, key: string, defaultValue: unknown = null) => {
    const settings = readSettings()
    return settings[key] !== undefined ? settings[key] : defaultValue
  })

  // Set a specific setting value
  ipcMain.handle('set-setting', (_event, key: string, value: unknown) => {
    const settings = readSettings()
    settings[key] = value
    writeSettings(settings)
    return true
  })

  // Clear all settings
  ipcMain.handle('clear-settings', () => {
    writeSettings({})
    return true
  })

  // Get the store file path (useful for debugging/diagnostics)
  ipcMain.handle('get-store-path', () => {
    return settingsFilePath
  })
}
