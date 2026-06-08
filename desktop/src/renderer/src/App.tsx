import React, { useEffect, useState } from 'react'
import { useAppStore } from '@renderer/store/useAppStore'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const { theme, username, settingsLoaded, loadSettings, setTheme, setUsername, resetSettings } =
    useAppStore()

  const [inputVal, setInputVal] = useState('')
  const [storePath, setStorePath] = useState('')

  useEffect(() => {
    loadSettings()
    window.api.getStorePath().then((path) => {
      setStorePath(path)
    })
  }, [loadSettings])

  useEffect(() => {
    if (settingsLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputVal(username)
    }
  }, [username, settingsLoaded])

  useEffect(() => {
    // Apply theme to document element
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.style.setProperty('--bg-primary', '#12131a')
      root.style.setProperty('--bg-card', 'rgba(30, 32, 44, 0.7)')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#b0b3c6')
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)')
    } else {
      root.classList.remove('dark')
      root.style.setProperty('--bg-primary', '#f4f5f8')
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.8)')
      root.style.setProperty('--text-primary', '#1e202c')
      root.style.setProperty('--text-secondary', '#64687d')
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)')
    }
  }, [theme])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVal = e.target.value
    setInputVal(newVal)
    setUsername(newVal)
  }

  const handlePing = (): void => {
    window.electron.ipcRenderer.send('ping')
  }

  if (!settingsLoaded) {
    return (
      <div style={{ color: '#fff', fontSize: '18px', fontFamily: 'sans-serif' }}>
        Loading App Settings...
      </div>
    )
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.glassPanel}>
        <div style={styles.sidebar}>
          <div style={styles.brand}>
            <img alt="logo" className="logo" src={electronLogo} style={styles.logo} />
            <h1 style={styles.brandTitle}>Fexo Desktop</h1>
          </div>
          <div style={styles.menuList}>
            <div style={{ ...styles.menuItem, ...styles.activeMenuItem }}>Dashboard</div>
            <div style={styles.menuItem} onClick={handlePing}>
              Trigger Test IPC (Ping)
            </div>
            <div style={styles.menuItem} onClick={resetSettings}>
              Reset Settings File
            </div>
          </div>
          <div style={styles.footer}>
            <p style={styles.footerText}>Electron Forge + Vite</p>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Welcome Back, {username}!</h2>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={styles.themeToggle}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Local System Settings</h3>
              <p style={styles.cardDescription}>
                These settings are saved to a file on your disk and reloaded dynamically.
              </p>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Profile Username</label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleUsernameChange}
                  style={styles.input}
                  placeholder="Enter custom username"
                />
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Disk Location Path</h3>
              <p style={styles.cardDescription}>
                IPC communications retrieve the location of the local storage file:
              </p>
              <div style={styles.pathBox}>
                <code style={styles.codePath}>{storePath || 'Loading...'}</code>
              </div>
            </div>
          </div>

          <div style={styles.versionsContainer}>
            <Versions />
          </div>
        </div>
      </div>
    </div>
  )
}

// Premium inline dynamic styling definitions (TypeScript-compatible with CSS variables)
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-primary)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    transition: 'background-color 0.3s ease',
    overflow: 'hidden',
    padding: '24px',
    boxSizing: 'border-box'
  },
  glassPanel: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    height: '100%',
    maxHeight: '660px',
    borderRadius: '16px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden',
    transition: 'background-color 0.3s ease, border-color 0.3s ease'
  },
  sidebar: {
    width: '260px',
    borderRight: '1px solid var(--border-color)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  logo: {
    height: '36px',
    width: '36px',
    margin: 0
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1
  },
  menuItem: {
    padding: '12px 16px',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    userSelect: 'none'
  },
  activeMenuItem: {
    backgroundColor: '#3b82f6',
    color: '#ffffff'
  },
  footer: {
    marginTop: 'auto'
  },
  footerText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: 0,
    opacity: 0.6
  },
  mainContent: {
    flexGrow: 1,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0
  },
  themeToggle: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  cardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flexGrow: 1,
    marginBottom: '24px'
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0
  },
  cardDescription: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '8px'
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  pathBox: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginTop: '6px'
  },
  codePath: {
    fontSize: '12px',
    color: '#3b82f6',
    wordBreak: 'break-all',
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
  },
  versionsContainer: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '20px',
    marginTop: 'auto'
  }
}

export default App
