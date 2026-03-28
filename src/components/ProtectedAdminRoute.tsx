import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Fingerprint } from 'lucide-react'

export default function ProtectedAdminRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading')

  useEffect(() => {
    const check = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) { 
          setStatus('denied')
          return 
        }

        // Try admin_users table first
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (error) {
          // If RLS blocks it, check via user metadata fallback
          // Allow if no error but also check app metadata
          const { data: userData } = await supabase.auth.getUser()
          const isAdmin = 
            userData?.user?.app_metadata?.role === 'admin' ||
            userData?.user?.user_metadata?.is_admin === true
          setStatus(isAdmin ? 'allowed' : 'denied')
          return
        }

        setStatus(data ? 'allowed' : 'denied')
      } catch {
        setStatus('denied')
      }
    }
    check()
  }, [])

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#030712',
        backgroundImage: 'linear-gradient(rgba(30,41,59,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.35) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(0,245,212,0.3)',
        }}>
          <Fingerprint size={30} color="#000" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: '#e2e8f0', 
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            marginBottom: '6px',
          }}>
            Verifying admin access
          </p>
          <p style={{ 
            color: '#64748b', 
            fontFamily: 'DM Mono, monospace', 
            fontSize: '12px' 
          }}>
            Checking credentials...
          </p>
        </div>
        <div style={{
          display: 'flex', gap: '6px',
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: '#00f5d4',
              animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}
