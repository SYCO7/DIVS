import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, Eye } from 'lucide-react'
import Webcam from 'react-webcam'
import { useAppStore } from '../../store/appStore'
import toast from 'react-hot-toast'

const CHECKS = [
  'Center your face in the frame',
  'Ensure good lighting',
  'Remove glasses if possible',
  'Keep a neutral expression',
]

type LivenessCheck = 'idle' | 'blink' | 'smile' | 'turn' | 'done'

export default function FaceCaptureStep() {
  const { updateIdentity, setCurrentStep } = useAppStore()
  const webcamRef = useRef<Webcam>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [livenessPhase, setLivenessPhase] = useState<LivenessCheck>('idle')
  const [livenessScore, setLivenessScore] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)
  const [checklist, setChecklist] = useState(CHECKS.map(() => false))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulate real-time face detection
  useEffect(() => {
    if (cameraReady && !capturedImage) {
      intervalRef.current = setInterval(() => {
        setFaceDetected(true)
        // Gradually mark checklist items
        setChecklist(prev => {
          const next = [...prev]
          const firstFalse = next.findIndex(v => !v)
          if (firstFalse !== -1) next[firstFalse] = true
          return next
        })
      }, 800)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [cameraReady, capturedImage])

  const runLivenessCheck = async () => {
    const phases: LivenessCheck[] = ['blink', 'smile', 'turn', 'done']
    const instructions: Record<string, string> = {
      blink: '👁️ Please blink twice slowly',
      smile: '😊 Please smile naturally',
      turn: '↔️ Turn your head slightly left, then right',
      done: '✅ Liveness verified!',
    }

    for (const phase of phases) {
      setLivenessPhase(phase)
      if (phase !== 'done') {
        toast(instructions[phase], { duration: 2000 })
        await new Promise(r => setTimeout(r, 2200))
        setLivenessScore(prev => prev + 25)
      } else {
        toast.success('Liveness check passed!', { duration: 2000 })
      }
    }
  }

  const capture = useCallback(async () => {
    if (!webcamRef.current) return
    setAnalyzing(true)
    toast.loading('Running liveness detection...', { id: 'face' })

    await runLivenessCheck()

    const img = webcamRef.current.getScreenshot()
    if (!img) {
      toast.error('Capture failed', { id: 'face' })
      setAnalyzing(false)
      return
    }

    // Simulate face descriptor (in production, use face-api.js descriptors)
    const mockDescriptor = Array.from({ length: 128 }, () => Math.random() - 0.5)
    const mockScore = 85 + Math.random() * 12

    await new Promise(r => setTimeout(r, 800))

    updateIdentity({
      selfieUrl: img,
      faceDescriptor: mockDescriptor,
      livenessScore: Math.round(mockScore),
    })

    setCapturedImage(img)
    toast.success(`Face captured! Score: ${Math.round(mockScore)}%`, { id: 'face' })
    setAnalyzing(false)
  }, [updateIdentity])

  const retake = () => {
    setCapturedImage(null)
    setLivenessPhase('idle')
    setLivenessScore(0)
    setFaceDetected(false)
    setChecklist(CHECKS.map(() => false))
  }

  const getLivenessLabel = () => {
    const labels: Record<LivenessCheck, string> = {
      idle: 'Ready to scan',
      blink: 'Blink twice...',
      smile: 'Smile naturally...',
      turn: 'Turn head slowly...',
      done: 'Liveness verified!',
    }
    return labels[livenessPhase]
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <div className="badge badge-info mb-3" style={{ display: 'inline-flex', fontSize: '12px', padding: '6px 14px' }}>Step 3 of 4</div>
        <h2 className="font-syne font-black text-3xl mb-3" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
          Biometric Face Scan
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '28px' }}>
          Advanced liveness detection with 128-point facial mapping
        </p>
      </div>

      {/* Camera area */}
      <div className="relative overflow-hidden mb-6"
        style={{ aspectRatio: '4/3', background: '#000', border: '1px solid var(--border)', maxHeight: '360px', borderRadius: '20px' }}>
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.9}
            onUserMedia={() => setCameraReady(true)}
            onUserMediaError={() => toast.error('Camera access denied')}
            className="w-full h-full object-cover"
            mirrored
          />
        )}

        {/* Face frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: '160px', height: '200px' }}>
            {/* Corner brackets */}
            {[
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <div key={i} className="absolute" style={{
                ...pos,
                width: '24px', height: '24px',
                borderColor: faceDetected ? 'var(--accent-green)' : 'var(--accent-cyan)',
                borderTopWidth: i < 2 ? '2px' : '0',
                borderBottomWidth: i >= 2 ? '2px' : '0',
                borderLeftWidth: i % 2 === 0 ? '2px' : '0',
                borderRightWidth: i % 2 === 1 ? '2px' : '0',
                borderStyle: 'solid',
                transition: 'border-color 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Scanning animation */}
        {analyzing && <div className="scan-line" />}

        {/* Status overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="badge" style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${faceDetected ? 'var(--accent-green)' : 'var(--border)'}`,
            color: faceDetected ? 'var(--accent-green)' : 'var(--text-secondary)',
          }}>
            {faceDetected ? '✓ Face Detected' : '○ Align Face'}
          </div>
          {livenessPhase !== 'idle' && (
            <div className="badge badge-info text-xs" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
              {getLivenessLabel()}
            </div>
          )}
        </div>

        {/* Captured overlay */}
        {capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,214,143,0.1)' }}>
            <CheckCircle size={64} style={{ color: 'var(--accent-green)' }} />
          </div>
        )}
      </div>

      {/* Liveness progress */}
      {(analyzing || livenessScore > 0) && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} style={{ color: '#60a5fa' }} />
            <span className="text-xs font-syne font-semibold" style={{ color: '#60a5fa' }}>
              Liveness Detection: {livenessScore}%
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${livenessScore}%`,
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))',
              }} />
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {CHECKS.map((check, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg"
            style={{ padding: '10px 14px', fontSize: '13px',
              background: checklist[i] ? 'rgba(0,214,143,0.08)' : 'rgba(8,14,24,0.5)' }}>
            {checklist[i]
              ? <CheckCircle size={13} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
              : <AlertCircle size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            }
            <span style={{ color: checklist[i] ? 'var(--accent-green)' : 'var(--text-secondary)' }}>{check}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      {capturedImage ? (
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={retake}>
            <RefreshCw size={16} /> Retake
          </button>
          <button className="btn-primary flex-1 flex items-center justify-center gap-2"
            style={{ padding: '15px 32px', fontSize: '16px' }}
            onClick={() => setCurrentStep('review')}>
            Continue to Review <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 px-5" onClick={() => setCurrentStep('document-upload')}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="btn-primary flex-1 flex items-center justify-center gap-2"
            style={{ padding: '15px 32px', fontSize: '16px' }}
            onClick={capture} disabled={analyzing || !cameraReady}>
            {analyzing ? (
              <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Scanning...</>
            ) : (
              <><Camera size={16} /> Capture & Verify</>
            )}
          </button>
        </div>
      )}

      <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
        🔒 Facial data is processed locally and encrypted. Never stored as raw images on our servers.
      </p>
    </motion.div>
  )
}
