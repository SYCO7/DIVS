import { Check } from 'lucide-react'

const STEPS = [
  { id: 'personal-info', label: 'Personal Info' },
  { id: 'document-upload', label: 'Document' },
  { id: 'face-capture', label: 'Face Scan' },
  { id: 'review', label: 'Review' },
  { id: 'complete', label: 'Complete' },
]

interface StepProgressProps {
  currentStep: string
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep)

  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      overflowY: 'visible',
      paddingBottom: '4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '0',
        minWidth: 'max-content',
        margin: '0 auto',
        padding: '0 4px',
      }}>
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex
          const isActive = i === currentIndex

          return (
            <div key={step.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0',
            }}>
              {/* Step item */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}>
                {/* Circle */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                  transition: 'all 0.4s ease',
                  background: isDone
                    ? '#10b981'
                    : isActive
                    ? 'linear-gradient(135deg, #00f5d4, #3b82f6)'
                    : 'rgba(13,21,38,0.8)',
                  color: isDone || isActive ? '#000' : '#475569',
                  border: isDone
                    ? 'none'
                    : isActive
                    ? 'none'
                    : '1px solid #2d4a6e',
                  boxShadow: isActive
                    ? '0 0 20px rgba(0,245,212,0.5), 0 0 40px rgba(0,245,212,0.15)'
                    : isDone
                    ? '0 0 12px rgba(16,185,129,0.3)'
                    : 'none',
                }}>
                  {isDone ? <Check size={16} /> : i + 1}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? '#00f5d4'
                    : isDone
                    ? '#10b981'
                    : '#475569',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  transition: 'color 0.3s',
                }}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '48px',
                  height: '2px',
                  marginTop: '18px',
                  flexShrink: 0,
                  borderRadius: '2px',
                  background: i < currentIndex
                    ? 'linear-gradient(90deg, #10b981, #00f5d4)'
                    : '#2d4a6e',
                  transition: 'background 0.5s ease',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
