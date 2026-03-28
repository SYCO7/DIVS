import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/appStore'
import StepProgress from '../components/verification/StepProgress'
import PersonalInfoStep from '../components/verification/PersonalInfoStep'
import DocumentUploadStep from '../components/verification/DocumentUploadStep'
import FaceCaptureStep from '../components/verification/FaceCaptureStep'
import ReviewStep from '../components/verification/ReviewStep'
import CompleteStep from '../components/verification/CompleteStep'

export default function VerifyPage() {
  const navigate = useNavigate()
  const { currentStep, setCurrentStep, user, setUser } = useAppStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'personal-info': return <PersonalInfoStep />
      case 'document-upload': return <DocumentUploadStep />
      case 'face-capture': return <FaceCaptureStep />
      case 'review': return <ReviewStep />
      case 'complete': return <CompleteStep />
      default: return <WelcomeStep onStart={() => setCurrentStep('personal-info')} />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #030712 100%)',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent), linear-gradient(rgba(30,41,59,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.35) 1px, transparent 1px)',
      backgroundSize: 'auto, 60px 60px, 60px 60px',
    }}>
      {/* Background orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-cyan)' }} />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-blue)' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(2,4,8,0.9)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }}>
              <Fingerprint size={16} color="#000" />
            </div>
            <span className="font-syne font-black text-lg" style={{ color: 'var(--text-primary)' }}>
              DIVS<span style={{ color: 'var(--accent-cyan)' }}>.</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs font-mono-custom hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </span>
            )}
            <button onClick={handleLogout} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        maxWidth: '620px',
        margin: '0 auto',
        padding: '2rem 1.25rem 4rem',
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        {/* Step Progress */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex justify-center overflow-x-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
              border: '1px solid #2d4a6e',
              borderRadius: '16px',
              padding: '20px 16px',
              marginBottom: '20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              overflow: 'visible',
              width: '100%',
            }}>
            <StepProgress currentStep={currentStep} />
          </motion.div>
        )}

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              background: 'linear-gradient(160deg, rgba(13,21,38,0.99) 0%, rgba(10,15,30,0.99) 100%)',
              border: '1px solid #2d4a6e',
              borderRadius: '20px',
              padding: '44px 40px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.02) inset, 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.04)',
              flex: 1,
            }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 float"
        style={{
          background: 'linear-gradient(135deg, rgba(0,245,212,0.2), rgba(0,112,243,0.2))',
          border: '1px solid rgba(0,245,212,0.3)',
          boxShadow: '0 0 40px rgba(0,245,212,0.2)',
        }}>
        <Fingerprint size={40} style={{ color: 'var(--accent-cyan)' }} />
      </div>

      <h2 className="font-syne font-black text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
        Welcome to DIVS
      </h2>
      <p className="text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Complete your identity verification in 4 simple steps. The process takes less than 2 minutes.
      </p>

      <div className="space-y-3 mb-8 text-left">
        {[
          { step: '01', label: 'Personal Information', desc: 'Name, email, phone & date of birth' },
          { step: '02', label: 'Document Upload', desc: 'Aadhaar, PAN, Passport or Driving Licence' },
          { step: '03', label: 'Biometric Face Scan', desc: 'Live facial recognition with liveness detection' },
          { step: '04', label: 'Review & Submit', desc: 'Confirm and receive your verified digital ID' },
        ].map(item => (
          <div key={item.step} className="flex items-center gap-4 p-3 rounded-xl"
            style={{ background: 'rgba(8,14,24,0.6)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-mono-custom font-bold text-sm"
              style={{ background: 'rgba(0,245,212,0.1)', color: 'var(--accent-cyan)' }}>
              {item.step}
            </div>
            <div>
              <div className="font-syne font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2" onClick={onStart}>
        <Fingerprint size={18} /> Begin Verification
      </button>
      <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
        🔒 256-bit encrypted · GDPR compliant · Data never sold
      </p>
    </motion.div>
  )
}
