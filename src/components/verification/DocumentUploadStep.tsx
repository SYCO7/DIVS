import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileCheck, AlertCircle, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import Tesseract from 'tesseract.js'

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', pattern: /\d{4}\s\d{4}\s\d{4}/ },
  { value: 'pan', label: 'PAN Card', pattern: /[A-Z]{5}[0-9]{4}[A-Z]/ },
  { value: 'passport', label: 'Passport', pattern: /[A-Z][0-9]{7}/ },
  { value: 'driving', label: 'Driving Licence', pattern: /[A-Z]{2}\d{13}/ },
]

export default function DocumentUploadStep() {
  const { identity, updateIdentity, setCurrentStep, user } = useAppStore()
  const [docType, setDocType] = useState(identity.documentType || '')
  const [docNumber, setDocNumber] = useState(identity.documentNumber || '')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [ocrRunning, setOcrRunning] = useState(false)
  const [ocrResult, setOcrResult] = useState<string | null>(null)
  const [ocrConfidence, setOcrConfidence] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
      return toast.error('Only images and PDFs are supported')
    }
    if (f.size > 5 * 1024 * 1024) return toast.error('File must be under 5MB')

    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)

    // Run OCR
    if (f.type.startsWith('image/')) {
      setOcrRunning(true)
      toast.loading('Running OCR analysis...', { id: 'ocr' })
      try {
        const { data } = await Tesseract.recognize(f, 'eng', {
          logger: () => {},
        })
        const text = data.text
        setOcrResult(text)
        setOcrConfidence(Math.round(data.confidence))

        // Try to extract document number
        const selectedDoc = DOC_TYPES.find(d => d.value === docType)
        if (selectedDoc) {
          const match = text.match(selectedDoc.pattern)
          if (match) {
            setDocNumber(match[0].replace(/\s/g, ''))
            toast.success(`Detected: ${match[0]}`, { id: 'ocr' })
          } else {
            toast.success(`OCR complete (${Math.round(data.confidence)}% confidence)`, { id: 'ocr' })
          }
        } else {
          toast.success(`OCR complete (${Math.round(data.confidence)}% confidence)`, { id: 'ocr' })
        }
      } catch {
        toast.error('OCR failed, please enter details manually', { id: 'ocr' })
      } finally {
        setOcrRunning(false)
      }
    }
  }

  const handleNext = async () => {
    if (!docType || !docNumber || !file) return toast.error('Complete all fields and upload a document')

    setUploading(true)
    let documentUrl = ''
    try {
      // Upload to Supabase Storage (if configured) or use data URL fallback
      if (user?.id && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co') {
        const path = `documents/${user.id}/${Date.now()}_${file.name}`
        const { error } = await supabase.storage.from('identity-docs').upload(path, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('identity-docs').getPublicUrl(path)
          documentUrl = publicUrl
        }
      }
    } catch {
      // Continue even if upload fails in demo
    }

    updateIdentity({
      documentType: docType,
      documentNumber: docNumber,
      documentUrl: documentUrl || preview || '',
      ocrConfidence,
    })
    setUploading(false)
    setCurrentStep('face-capture')
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="badge badge-info mb-3" style={{ display: 'inline-flex', fontSize: '12px', padding: '6px 14px' }}>Step 2 of 4</div>
        <h2 className="font-syne font-black text-3xl mb-3" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
          Identity Document
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '28px' }}>
          Upload your government-issued ID. Our OCR will extract details automatically.
        </p>
      </div>

      {/* Doc type selector */}
      <div className="mb-6">
        <label className="font-syne font-bold block uppercase"
          style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px', letterSpacing: '0.14em' }}>Document Type</label>
        <div className="grid grid-cols-2 gap-3">
          {DOC_TYPES.map(dt => (
            <button key={dt.value} onClick={() => setDocType(dt.value)}
              className="font-syne font-semibold transition-all text-left"
              style={{
                background: docType === dt.value ? 'rgba(0,245,212,0.1)' : 'rgba(8,14,24,0.8)',
                border: docType === dt.value ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
                color: docType === dt.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '14px 16px',
                fontSize: '14px',
                borderRadius: '12px',
              }}>
              {dt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document number */}
      <div className="mb-5">
        <label className="font-syne font-bold block uppercase"
          style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px', letterSpacing: '0.14em' }}>Document Number</label>
        <input
          type="text" value={docNumber} onChange={e => setDocNumber(e.target.value.toUpperCase())}
          placeholder="Auto-detected or enter manually"
          className="cyber-input"
          style={{ padding: '15px 18px', fontSize: '15px' }}
        />
        {ocrConfidence > 0 && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--accent-green)' }}>
            <FileCheck size={12} /> OCR Confidence: {ocrConfidence}%
          </p>
        )}
      </div>

      {/* File upload area */}
      <div
        className="relative text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${preview ? 'var(--accent-green)' : 'var(--border)'}`,
          background: 'rgba(8,14,24,0.5)',
          padding: '40px 32px',
          borderRadius: '16px',
        }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f) {
            const evt = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>
            handleFileChange(evt)
          }
        }}>
        {ocrRunning && <div className="scan-line" />}
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Document" className="max-h-48 mx-auto rounded-lg object-contain" />
            <button
              className="absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent-red)' }}
              onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setOcrResult(null); setOcrConfidence(0) }}>
              <X size={14} color="#fff" />
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.2)' }}>
              <Upload size={28} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <p className="text-lg font-syne font-semibold" style={{ color: 'var(--text-primary)' }}>
              Drop document here or click to upload
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>JPG, PNG, PDF · Max 5MB</p>
          </div>
        )}
      </div>

      {ocrResult && (
        <div className="mt-4 p-3 rounded-xl overflow-auto max-h-24"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-mono-custom" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
            {ocrResult.slice(0, 200)}...
          </p>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl flex items-start gap-2"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <AlertCircle size={14} style={{ color: 'var(--accent-amber)', marginTop: 2 }} />
        <p className="text-xs" style={{ color: 'var(--accent-amber)' }}>
          Ensure the document is clearly visible, unobstructed, and all four corners are within the frame.
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="btn-secondary flex items-center gap-2 px-5" onClick={() => setCurrentStep('personal-info')}>
          <ArrowLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1 flex items-center justify-center gap-2"
          style={{ padding: '15px 32px', fontSize: '16px', whiteSpace: 'nowrap' }}
          onClick={handleNext} disabled={uploading || ocrRunning}>
          {uploading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>Continue to Face Scan <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </motion.div>
  )
}
