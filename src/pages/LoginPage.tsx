import { useState } from 'react'
import { motion } from 'framer-motion'
import { Fingerprint, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return toast.error('Fill in all fields')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined,
            data: { email_confirmed: true },
          },
        })
        if (error) throw error
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          toast.success('Account created! Please sign in.')
          setMode('login')
        } else {
          toast.success('Account created and signed in!')
          navigate('/verify')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
        navigate('/verify')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: '#030712',
        backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.08), transparent), linear-gradient(rgba(30,41,59,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.35) 1px, transparent 1px)',
        backgroundSize: 'auto, 60px 60px, 60px 60px',
      }}>
      {/* Background orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-cyan)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-blue)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', boxShadow: '0 0 30px rgba(0,245,212,0.3)' }}>
            <Fingerprint size={32} color="#000" />
          </div>
          <h1 className="font-syne font-black text-3xl" style={{ color: 'var(--text-primary)' }}>
            DIVS<span style={{ color: 'var(--accent-cyan)' }}>.</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Digital Identity Verification System</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(160deg, rgba(13,21,38,0.99) 0%, rgba(10,15,30,0.99) 100%)',
          border: '1px solid #2d4a6e',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.06)',
          width: '100%',
        }}>
          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'rgba(8,14,24,0.8)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg font-syne font-semibold text-sm transition-all capitalize"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'transparent',
                  color: mode === m ? '#000' : 'var(--text-secondary)',
                }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-syne font-semibold mb-2 block uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="cyber-input" style={{ paddingLeft: '44px' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-syne font-semibold mb-2 block uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }} />
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="cyber-input" style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
            )}
          </button>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
            By continuing you agree to our{' '}
            <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}>Terms of Service</span>
          </p>
        </div>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/')}
            className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            ← Back to home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
