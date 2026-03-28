import { ShieldOff, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AccessDeniedPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      backgroundImage: 'linear-gradient(rgba(30,41,59,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.35) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, rgba(13,21,38,0.99), rgba(10,15,30,0.99))',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '24px',
        padding: '56px 48px',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 0 60px rgba(239,68,68,0.1)',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <ShieldOff size={36} color="#ef4444" />
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: '28px', color: '#ef4444',
          marginBottom: '12px',
        }}>Access Denied</h1>
        <p style={{
          color: '#64748b', fontSize: '15px',
          lineHeight: 1.7, marginBottom: '32px',
        }}>
          You don't have permission to access the admin dashboard.
          This area is restricted to authorized administrators only.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            color: '#030712', fontFamily: 'Syne, sans-serif',
            fontWeight: 800, fontSize: '14px',
            padding: '14px 32px', borderRadius: '10px',
            border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    </div>
  )
}
