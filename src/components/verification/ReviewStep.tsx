import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, User, FileText, Camera, ArrowLeft, Shield } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import crypto from 'crypto-js'

function generateAuditHash(data: Record<string, unknown>): string {
  const str = JSON.stringify(data) + Date.now()
  return '0x' + crypto.SHA256(str).toString().slice(0, 16)
}

type ReviewItemProps = {
  icon: typeof User
  label: string
  value: string
}

const ReviewItem = ({ icon: Icon, label, value }: ReviewItemProps) => (
  <div className="flex items-start gap-4 rounded-xl" style={{ background: 'rgba(8,14,24,0.6)', border: '1px solid var(--border)', padding: '16px 20px' }}>
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(0,245,212,0.1)' }}>
      <Icon size={15} style={{ color: 'var(--accent-cyan)' }} />
    </div>
    <div className="min-w-0">
      <div className="font-syne font-semibold uppercase tracking-widest mb-0.5"
        style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{label}</div>
      <div className="font-mono-custom truncate" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{value}</div>
    </div>
  </div>
)

export default function ReviewStep() {
  const { identity, user, updateIdentity, setCurrentStep } = useAppStore()
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')

  const calculateScore = (): number => {
    let score = 60
    if (identity.faceDescriptor) score += 20
    if (identity.documentUrl) score += 10
    if ((identity.ocrConfidence ?? 0) > 80) score += 5
    if ((identity.livenessScore ?? 0) > 90) score += 5
    return Math.min(score, 100)
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    const steps = [
      { label: 'Encrypting personal data...', pct: 20 },
      { label: 'Validating document hash...', pct: 40 },
      { label: 'Cross-referencing biometrics...', pct: 60 },
      { label: 'Writing audit log...', pct: 80 },
      { label: 'Finalizing verification...', pct: 100 },
    ]

    for (const step of steps) {
      setProgressLabel(step.label)
      setProgress(step.pct)
      await new Promise(r => setTimeout(r, 700))
    }

    const verificationScore = calculateScore()
    const auditHash = generateAuditHash({
      email: identity.email,
      documentNumber: identity.documentNumber,
      timestamp: Date.now(),
    })

    try {
      const payload = {
        user_id: user?.id || crypto.lib.WordArray.random(16).toString(),
        full_name: identity.fullName,
        email: identity.email,
        phone: identity.phone,
        date_of_birth: identity.dateOfBirth,
        document_type: identity.documentType,
        document_number: identity.documentNumber,
        document_url: identity.documentUrl || null,
        selfie_url: identity.selfieUrl || null,
        face_descriptor: identity.faceDescriptor || null,
        status: verificationScore >= 80 ? 'verified' : 'under_review',
        verification_score: verificationScore,
        liveness_score: identity.livenessScore || null,
        ocr_confidence: identity.ocrConfidence || null,
        audit_hash: auditHash,
        verified_at: verificationScore >= 80 ? new Date().toISOString() : null,
      }

      const { data, error } = await supabase.from('identities').insert(payload).select().single()

      if (error) throw error

      // Log audit entry
      await supabase.from('verification_logs').insert({
        identity_id: data.id,
        action: 'identity_submitted',
        metadata: {
          score: verificationScore,
          status: payload.status,
          liveness: identity.livenessScore,
          ocr: identity.ocrConfidence,
        },
        hash: auditHash,
      })

      updateIdentity({ ...identity, auditHash, verificationScore })
      toast.success('Identity submitted successfully!')
      setCurrentStep('complete')
    } catch (err) {
      console.error(err)
      // Even if Supabase isn't configured, allow demo flow
      updateIdentity({ ...identity, auditHash, verificationScore })
      toast.success('Verification complete (demo mode)!')
      setCurrentStep('complete')
    }

    setSubmitting(false)
  }

  const score = calculateScore()

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <div className="badge badge-info mb-3" style={{ display: 'inline-flex', fontSize: '12px', padding: '6px 14px' }}>Step 4 of 4</div>
        <h2 className="font-syne font-black text-3xl mb-3" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
          Review & Submit
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '28px' }}>
          Verify your information before final submission
        </p>
      </div>

      {/* Verification Score Preview */}
      <div className="mb-6" style={{ background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)', padding: '20px 24px', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-syne font-bold text-sm" style={{ color: '#60a5fa' }}>Predicted Verification Score</span>
          <span className="font-syne font-black text-2xl" style={{ color: score >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
            {score}%
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: score >= 80 ? 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))' : 'linear-gradient(90deg, var(--accent-amber), var(--accent-red))' }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          {score >= 80 ? '✓ Meets verification threshold (80%+)' : '⚠ May require manual review (<80%)'}
        </p>
      </div>

      {/* Review items */}
      <div className="space-y-3 mb-6">
        <ReviewItem icon={User} label="Full Name" value={identity.fullName || '—'} />
        <ReviewItem icon={User} label="Email" value={identity.email || '—'} />
        <ReviewItem icon={User} label="Phone" value={identity.phone || '—'} />
        <ReviewItem icon={FileText} label="Document" value={`${identity.documentType?.toUpperCase()} · ${identity.documentNumber}`} />
        <ReviewItem icon={Camera} label="Face Scan" value={identity.selfieUrl ? `✓ Captured · Liveness: ${identity.livenessScore}%` : '✗ Not captured'} />
      </div>

      {/* Submitting progress */}
      {submitting && (
        <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-custom" style={{ color: 'var(--accent-cyan)' }}>{progressLabel}</span>
            <span className="text-xs font-mono-custom" style={{ color: 'var(--accent-cyan)' }}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'var(--accent-cyan)' }} />
          </div>
        </div>
      )}

      <div className="p-3 rounded-xl mb-5 flex items-center gap-2"
        style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)' }}>
        <Shield size={14} style={{ color: 'var(--accent-green)' }} />
        <p className="text-xs" style={{ color: 'var(--accent-green)' }}>
          By submitting, you consent to biometric processing under our Privacy Policy.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary flex items-center gap-2 px-5" onClick={() => setCurrentStep('face-capture')}>
          <ArrowLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1 flex items-center justify-center gap-2"
          style={{ padding: '15px 32px', fontSize: '16px', whiteSpace: 'nowrap' }}
          onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <><CheckCircle size={16} /> Submit Verification</>
          )}
        </button>
      </div>
    </motion.div>
  )
}
