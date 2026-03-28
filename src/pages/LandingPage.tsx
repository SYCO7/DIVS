import { motion } from 'framer-motion'
import { Shield, Fingerprint, Eye, FileCheck, Zap, Lock, ArrowRight, CheckCircle, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: Eye, label: 'Face Recognition', desc: 'AI-powered biometric verification with liveness detection to prevent spoofing' },
  { icon: FileCheck, label: 'Document OCR', desc: 'Auto-extract data from Aadhaar, PAN, Passport & Driving Licence instantly' },
  { icon: Fingerprint, label: 'Multi-Factor Auth', desc: 'Triple-layer: email OTP + biometrics + document verification' },
  { icon: Lock, label: 'Tamper-proof Logs', desc: 'SHA-256 blockchain-style audit trail stored immutably in Supabase' },
  { icon: Zap, label: 'Real-time Processing', desc: 'Identity verified in under 3 seconds with live status updates' },
  { icon: Shield, label: 'ISO 27001 Ready', desc: 'Enterprise-grade AES-256 encryption and GDPR compliant architecture' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      backgroundImage: `
        radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,245,212,0.07) 0%, rgba(59,130,246,0.05) 40%, transparent 70%),
        linear-gradient(rgba(30,41,59,0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30,41,59,0.3) 1px, transparent 1px)
      `,
      backgroundSize: 'auto, 60px 60px, 60px 60px',
      color: '#f1f5f9',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* -- NAVBAR -- */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,41,59,0.8)',
        height: '64px',
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,245,212,0.3)',
          }}>
            <Fingerprint size={18} color="#000" />
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: '20px', color: '#f1f5f9', letterSpacing: '-0.02em',
          }}>
            DIVS<span style={{ color: '#00f5d4' }}>.</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent',
            border: '1px solid #2d4a6e',
            color: '#94a3b8',
            fontFamily: 'Syne, sans-serif', fontWeight: 600,
            fontSize: '14px', padding: '9px 22px',
            borderRadius: '9px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#00f5d4'
            ;(e.currentTarget as HTMLElement).style.color = '#00f5d4'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#2d4a6e'
            ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
          }}>
            Sign In
          </button>
          <button onClick={() => navigate('/verify')} style={{
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            color: '#030712',
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '14px', padding: '9px 22px',
            borderRadius: '9px', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,245,212,0.25)',
            transition: 'all 0.2s', border: 'none',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
            Start Verification
          </button>
        </div>
      </nav>

      {/* -- HERO -- */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 40px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '60px', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(0,245,212,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '24px', padding: '6px 16px',
            marginBottom: '36px',
            fontSize: '12px', fontFamily: 'DM Mono, monospace',
            color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981', display: 'inline-block',
              boxShadow: '0 0 8px #10b981',
            }} />
            Next-Gen Identity Platform · v2.0
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: '28px',
          }}>
          <span style={{ color: '#f1f5f9', display: 'block' }}>Digital Identity</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Verification</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '18px', color: '#64748b', lineHeight: 1.8,
            maxWidth: '560px', margin: '0 auto 44px',
          }}>
          Enterprise-grade identity verification powered by AI face recognition,
          document OCR, and cryptographic audit trails. Verify in seconds, trust forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/verify')} style={{
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            color: '#030712', border: 'none',
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '16px', padding: '15px 36px',
            borderRadius: '12px', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,245,212,0.3)',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,245,212,0.4)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,245,212,0.3)'
          }}>
            Begin Verification <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* -- STATS BAR -- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            marginTop: '64px',
            background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
            border: '1px solid #2d4a6e',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {[
              { value: '99.8%', label: 'Accuracy Rate' },
              { value: '<3s', label: 'Avg Verification' },
              { value: '256-bit', label: 'AES Encryption' },
              { value: 'GDPR', label: 'Compliant' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i < 3 ? '1px solid #1e293b' : 'none',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900,
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  color: '#00f5d4',
                  marginBottom: '6px',
                  textShadow: '0 0 20px rgba(0,245,212,0.4)',
                  whiteSpace: 'nowrap',
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '13px', color: '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
          {/* Verified banner */}
          <div style={{
            padding: '14px 28px',
            borderTop: '1px solid #1e293b',
            background: 'rgba(16,185,129,0.05)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <CheckCircle size={16} color="#10b981" />
            <span style={{
              fontSize: '13px', color: '#10b981',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
            }}>Identity Verified Successfully</span>
            <span style={{
              fontSize: '12px', color: '#475569',
              fontFamily: 'DM Mono, monospace', marginLeft: '4px',
            }}>Score: 97.4% · Hash: 0x8f3a...d92b · 2.1s</span>
          </div>
        </motion.div>
      </section>

      {/* -- FEATURES -- */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '80px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#f1f5f9', marginBottom: '14px',
              letterSpacing: '-0.03em',
            }}>
            Next-Gen Features
          </motion.h2>
          <p style={{ fontSize: '17px', color: '#64748b', lineHeight: 1.7 }}>
            Built for the future of digital trust
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {features.map((feat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
                border: '1px solid #2d4a6e',
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'default',
                transition: 'border-color 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,212,0.4)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2d4a6e'}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'rgba(0,245,212,0.08)',
                border: '1px solid rgba(0,245,212,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <feat.icon size={24} color="#00f5d4" />
              </div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '18px', color: '#f1f5f9',
                marginBottom: '10px', letterSpacing: '-0.01em',
              }}>{feat.label}</h3>
              <p style={{
                fontSize: '14px', color: '#64748b',
                lineHeight: 1.75,
              }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -- CTA -- */}
      <section style={{
        maxWidth: '700px', margin: '0 auto',
        padding: '40px 40px 100px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
            border: '1px solid #2d4a6e',
            borderRadius: '28px',
            padding: '60px 48px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(0,245,212,0.04)',
            position: 'relative', overflow: 'hidden',
          }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00f5d4, transparent)',
          }} />
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(0,245,212,0.1)',
            border: '1px solid rgba(0,245,212,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <Shield size={36} color="#00f5d4" />
          </div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: '2rem', color: '#f1f5f9',
            letterSpacing: '-0.03em', marginBottom: '14px',
          }}>Ready to get verified?</h2>
          <p style={{
            fontSize: '16px', color: '#64748b',
            lineHeight: 1.75, marginBottom: '36px',
            maxWidth: '420px', margin: '0 auto 36px',
          }}>
            Join thousands already secured by the most advanced
            identity verification platform.
          </p>
          <div style={{
            display: 'flex', gap: '10px',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <button onClick={() => navigate('/verify')} style={{
              background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
              color: '#030712', border: 'none',
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '15px', padding: '14px 32px',
              borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(0,245,212,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
              Start Now <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent',
              border: '1px solid #2d4a6e',
              color: '#94a3b8',
              fontFamily: 'Syne, sans-serif', fontWeight: 600,
              fontSize: '15px', padding: '14px 32px',
              borderRadius: '10px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#00f5d4'
              ;(e.currentTarget as HTMLElement).style.color = '#00f5d4'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2d4a6e'
              ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
            }}>
              Sign In
            </button>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '24px', marginTop: '36px', flexWrap: 'wrap',
          }}>
            {['AES-256 Encrypted', 'GDPR Compliant', 'Zero Data Sold'].map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#475569',
                fontFamily: 'DM Mono, monospace',
              }}>
                <Star size={11} color="#00f5d4" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* -- FOOTER -- */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '24px 40px',
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: '12px', color: '#334155',
          fontFamily: 'DM Mono, monospace',
        }}>
          DIVS © 2025 · Digital Identity Verification System · Built with ❤ for security
        </span>
      </footer>
    </div>
  )
}
