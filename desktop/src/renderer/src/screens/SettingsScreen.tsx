import React from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Versions from '../components/Versions'

interface SettingsContentProps {
  username: string
  setUsername: (username: string) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  resetSettings: () => void
  storePath: string
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  username,
  setUsername,
  theme,
  setTheme,
  resetSettings,
  storePath
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl p-8">
      <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
        <CardHeader className="p-0 mb-4">
          <h2 className="font-semibold text-neutral-50 text-base leading-6">
            Local System Configurations
          </h2>
          <p className="text-[oklch(0.708_0_0)] text-xs leading-4">
            Configure Fexo settings saved securely to disk via Electron IPC.
          </p>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[oklch(0.708_0_0)]">
              Profile Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[oklch(0.708_0_0)]">Theme Mode</label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex-1 rounded-lg"
              >
                🌙 Dark Theme
              </Button>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex-1 rounded-lg"
              >
                ☀️ Light Theme
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="secondary" onClick={resetSettings} className="rounded-lg">
              Reset Settings File to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
        <CardHeader className="p-0 mb-2">
          <h2 className="font-semibold text-neutral-50 text-base leading-6">
            Storage Path Details
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <code className="text-xs text-blue-400 break-all font-mono">
              {storePath || 'Resolving path...'}
            </code>
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-neutral-800 pt-6">
        <Versions />
      </div>
    </div>
  )
}
