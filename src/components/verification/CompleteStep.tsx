import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Shield, Hash, Clock, Star, RefreshCw } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import QRCode from 'qrcode'

export default function CompleteStep() {
  const { identity, resetFlow } = useAppStore()
  const qrRef = useRef<HTMLCanvasElement>(null)
  const score = identity.verificationScore || 0

  useEffect(() => {
    if (qrRef.current) {
      const qrData = JSON.stringify({
        id: identity.auditHash,
        name: identity.fullName,
        doc: identity.documentNumber,
        score,
        ts: new Date().toISOString(),
        status: score >= 80 ? 'VERIFIED' : 'UNDER_REVIEW',
      })
      QRCode.toCanvas(qrRef.current, qrData, {
        width: 120,
        color: { dark: '#00f5d4', light: '#0d1621' },
        margin: 2,
      })
    }
  }, [])

  const downloadCard = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 340
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#0d1621'
    ctx.fillRect(0, 0, 600, 340)

    // Gradient strip
    const grd = ctx.createLinearGradient(0, 0, 600, 0)
    grd.addColorStop(0, '#00f5d4')
    grd.addColorStop(1, '#0070f3')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 600, 8)

    // Title
    ctx.fillStyle = '#00f5d4'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('DIVS — Digital Identity Verification', 24, 50)

    ctx.fillStyle = '#7a9bb5'
    ctx.font = '13px monospace'
    ctx.fillText('VERIFIED IDENTITY CARD', 24, 72)

    // Divider
    ctx.fillStyle = '#1a2e45'
    ctx.fillRect(24, 85, 552, 1)

    // Info
    ctx.fillStyle = '#e8f4fd'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText(identity.fullName || '', 24, 115)

    ctx.fillStyle = '#7a9bb5'
    ctx.font = '13px monospace'
    ctx.fillText(`Email: ${identity.email}`, 24, 140)
    ctx.fillText(`Document: ${identity.documentType?.toUpperCase()} · ${identity.documentNumber}`, 24, 160)
    ctx.fillText(`Issued: ${new Date().toLocaleDateString('en-IN')}`, 24, 180)
    ctx.fillText(`Audit Hash: ${identity.auditHash}`, 24, 200)
    ctx.fillText(`Verification Score: ${score}%`, 24, 220)

    // Status badge
    ctx.fillStyle = score >= 80 ? '#00d68f' : '#f59e0b'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(score >= 80 ? '✓ VERIFIED' : '⚠ UNDER REVIEW', 24, 260)

    // QR
    if (qrRef.current) {
      ctx.drawImage(qrRef.current, 450, 90, 120, 120)
    }

    // Footer
    ctx.fillStyle = '#1a2e45'
    ctx.fillRect(0, 300, 600, 40)
    ctx.fillStyle = '#7a9bb5'
    ctx.font = '11px monospace'
    ctx.fillText('DIVS · Secured by AES-256 · Blockchain Audit Trail', 24, 325)

    const a = document.createElement('a')
    a.download = `DIVS_ID_${identity.fullName?.replace(/\s/g, '_')}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <div style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(16,185,129,0.08), transparent)',
        borderRadius: '20px',
        padding: '4px',
      }}>
        <div style={{
          background: 'linear-gradient(160deg, rgba(13,21,38,0.99), rgba(10,15,30,0.99))',
          borderRadius: '18px',
          padding: '32px',
        }}>
      {/* Success header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 glow-green"
            style={{ background: 'rgba(0,214,143,0.15)', border: '2px solid var(--accent-green)' }}>
            <CheckCircle size={48} style={{ color: 'var(--accent-green)' }} />
          </div>
        </motion.div>
        <h2 className="font-syne font-black text-4xl mb-3"
          style={{ color: score >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
          {score >= 80 ? 'Identity Verified!' : 'Under Review'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
          {score >= 80
            ? 'Your identity has been successfully verified on the DIVS platform.'
            : 'Your submission is under manual review. You\'ll be notified within 24 hours.'}
        </p>
      </div>

      {/* Score ring */}
      <div className="flex justify-center mb-6">
        <div style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(16,185,129,0.1), transparent)',
          borderRadius: '50%',
          padding: '12px',
        }}>
          <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke={score >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-syne font-black text-3xl" style={{ color: score >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
              {score}%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Score</span>
          </div>
        </div>
        </div>
      </div>

      {/* ID Card Preview */}
      <div className="mb-6" style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #2d4a6e',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,245,212,0.05)',
      }}>
        {/* Card header */}
        <div className="p-1" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }} />
        <div className="p-7" style={{ background: 'var(--bg-card)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="badge badge-verified mb-3">
                <Shield size={10} /> Verified Identity
              </div>
              <div className="font-syne font-black text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                {identity.fullName}
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: '📧', val: identity.email },
                  { icon: '📄', val: `${identity.documentType?.toUpperCase()} · ${identity.documentNumber}` },
                  { icon: '📅', val: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 font-mono-custom"
                    style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span>{item.icon}</span> {item.val}
                  </div>
                ))}
              </div>
            </div>
            <canvas ref={qrRef} className="rounded-lg flex-shrink-0" style={{ width: 100, height: 100 }} />
          </div>

          {/* Audit hash */}
          <div className="mt-4 p-3 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.1)' }}>
            <Hash size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <span className="text-xs font-mono-custom truncate" style={{ color: 'var(--accent-cyan)' }}>
              {identity.auditHash}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Star, label: 'Score', value: `${score}%`, color: 'var(--accent-green)' },
          { icon: Shield, label: 'Liveness', value: `${identity.livenessScore}%`, color: 'var(--accent-cyan)' },
          { icon: Clock, label: 'Time', value: '~8s', color: 'var(--accent-blue)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid #2d4a6e',
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
          }}>
            <stat.icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
            <div className="font-syne font-black text-2xl" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-secondary flex items-center gap-2 flex-1 justify-center" style={{ padding: '15px 24px', fontSize: '15px' }} onClick={downloadCard}>
          <Download size={16} /> Download ID Card
        </button>
        <button className="btn-primary flex-1 flex items-center justify-center gap-2" style={{ padding: '15px 24px', fontSize: '15px' }} onClick={resetFlow}>
          <RefreshCw size={16} /> New Verification
        </button>
      </div>
        </div>
      </div>
    </motion.div>
  )
}
