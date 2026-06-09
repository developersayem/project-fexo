import { useState } from 'react'
import { User } from 'firebase/auth'
import { Zap, ShieldCheck, RefreshCw, Wifi } from 'lucide-react'
import { signInWithGoogle } from '../services/firebase'

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const user = await signInWithGoogle()
      if (user) {
        onLoginSuccess(user)
      }
    } catch (err: unknown) {
      console.error(err)
      setError('Failed to authenticate with Google. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center font-sans overflow-hidden relative select-none">
      {/* Visual background gradient blobs */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-[oklch(0.488_0.243_264.376)] rounded-full blur-[120px] opacity-15 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-[oklch(0.627_0.265_303.9)] rounded-full blur-[120px] opacity-10" />

      {/* Main glass card container */}
      <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-xl rounded-3xl p-10 flex flex-col items-center w-full max-w-[480px] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Glowing Logo */}
        <div className="size-16 bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] shadow-[0_0_40px_oklch(0.488_0.243_264.376/.4)] rounded-2xl flex justify-center items-center mb-6">
          <Zap className="size-8 text-neutral-900" />
        </div>

        <h1 className="font-bold text-3xl leading-9 text-neutral-50 tracking-tight text-center">
          DevTrack
        </h1>
        <p className="text-[#a1a1a1] text-xs leading-4 tracking-wider uppercase mt-1">
          Productivity OS
        </p>

        <p className="text-center text-sm text-[#a1a1a1] mt-6 leading-relaxed">
          Sign in to access your dashboard, tasks, focus sessions, and synchronize automatically in
          real-time across all your devices.
        </p>

        {/* Feature Highlights */}
        <div className="w-full flex flex-col gap-3.5 my-8">
          <div className="flex items-center gap-3 bg-neutral-900/60 border border-white/5 p-3.5 rounded-2xl">
            <div className="size-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
              <RefreshCw className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-neutral-200">Real-Time Sync</h3>
              <p className="text-[10px] text-[#a1a1a1] mt-0.5">
                Instant task and timer synchronization between desktop and phone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/60 border border-white/5 p-3.5 rounded-2xl">
            <div className="size-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Wifi className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-neutral-200">Offline Caching</h3>
              <p className="text-[10px] text-[#a1a1a1] mt-0.5">
                Work offline seamlessly. Changes are stored locally and synced when online.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/60 border border-white/5 p-3.5 rounded-2xl">
            <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-neutral-200">Protected Auth</h3>
              <p className="text-[10px] text-[#a1a1a1] mt-0.5">
                Protected and verified securely via Google Identity Services.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-xs mb-4 text-center leading-relaxed">{error}</div>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-neutral-100 hover:bg-white text-neutral-950 font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3.5 cursor-pointer disabled:opacity-50 text-sm"
        >
          {loading ? (
            <div className="size-4 border-2 border-t-neutral-950 border-neutral-300 animate-spin rounded-full" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
      </div>
    </div>
  )
}
