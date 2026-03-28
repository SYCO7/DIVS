import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, CheckCircle, Clock, XCircle, Search,
  Eye, TrendingUp, Hash, RefreshCw, Fingerprint, LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

type Identity = {
  id: string
  full_name: string
  email: string
  phone: string
  document_type: string
  document_number: string
  status: string
  verification_score: number
  liveness_score: number
  ocr_confidence: number
  created_at: string
  verified_at: string | null
  audit_hash: string
  rejection_reason: string | null
}

const DEMO_DATA: Identity[] = [
  { id: '1', full_name: 'Arjun Sharma', email: 'arjun@example.com', phone: '9876543210', document_type: 'aadhaar', document_number: '123456789012', status: 'verified', verification_score: 97, liveness_score: 98, ocr_confidence: 94, created_at: new Date(Date.now() - 86400000).toISOString(), verified_at: new Date(Date.now() - 86400000).toISOString(), audit_hash: '0x8f3ad92b', rejection_reason: null },
  { id: '2', full_name: 'Priya Singh', email: 'priya@example.com', phone: '9123456780', document_type: 'pan', document_number: 'ABCDE1234F', status: 'verified', verification_score: 92, liveness_score: 95, ocr_confidence: 88, created_at: new Date(Date.now() - 172800000).toISOString(), verified_at: new Date(Date.now() - 172800000).toISOString(), audit_hash: '0x3c9f1a2d', rejection_reason: null },
  { id: '3', full_name: 'Rahul Kumar', email: 'rahul@example.com', phone: '9988776655', document_type: 'passport', document_number: 'P1234567', status: 'under_review', verification_score: 74, liveness_score: 82, ocr_confidence: 71, created_at: new Date(Date.now() - 3600000).toISOString(), verified_at: null, audit_hash: '0xb7e2f4c8', rejection_reason: null },
  { id: '4', full_name: 'Kavya Reddy', email: 'kavya@example.com', phone: '8765432109', document_type: 'driving', document_number: 'KA0119980123456', status: 'pending', verification_score: 0, liveness_score: 0, ocr_confidence: 0, created_at: new Date().toISOString(), verified_at: null, audit_hash: '0xd1c8a93f', rejection_reason: null },
  { id: '5', full_name: 'Vikram Patel', email: 'vikram@example.com', phone: '9111222333', document_type: 'aadhaar', document_number: '987654321098', status: 'rejected', verification_score: 41, liveness_score: 35, ocr_confidence: 60, created_at: new Date(Date.now() - 259200000).toISOString(), verified_at: null, audit_hash: '0xa4b2e7d9', rejection_reason: 'Low liveness score — suspected photo attack' },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const [identities, setIdentities] = useState<Identity[]>(DEMO_DATA)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Identity | null>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('identities').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) setIdentities(data)
    } catch { /* use demo data */ }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string, reason?: string) => {
    try {
      await supabase.from('identities').update({
        status,
        rejection_reason: reason || null,
        verified_at: status === 'verified' ? new Date().toISOString() : null,
      }).eq('id', id)
      setIdentities(prev => prev.map(i => i.id === id ? { ...i, status, rejection_reason: reason || null } : i))
      toast.success(`Status updated to ${status}`)
      setSelected(null)
    } catch {
      setIdentities(prev => prev.map(i => i.id === id ? { ...i, status, rejection_reason: reason || null } : i))
      toast.success(`Status updated to ${status} (demo)`)
      setSelected(null)
    }
  }

  const filtered = identities.filter(i => {
    const matchSearch = i.full_name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.document_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: identities.length,
    verified: identities.filter(i => i.status === 'verified').length,
    pending: identities.filter(i => i.status === 'pending' || i.status === 'under_review').length,
    rejected: identities.filter(i => i.status === 'rejected').length,
    avgScore: Math.round(identities.filter(i => i.verification_score > 0).reduce((s, i) => s + i.verification_score, 0) / Math.max(identities.filter(i => i.verification_score > 0).length, 1)),
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      verified: 'badge-verified', pending: 'badge-pending',
      under_review: 'badge-pending', rejected: 'badge-failed',
    }
    return map[status] || 'badge-info'
  }

  const getStatusLabel = (status: string) => {
    return { verified: 'Verified', pending: 'Pending', under_review: 'Under Review', rejected: 'Rejected' }[status] || status
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      backgroundImage: 'radial-gradient(ellipse 60% 40% at 70% 0%, rgba(139,92,246,0.07), transparent), linear-gradient(rgba(30,41,59,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.3) 1px, transparent 1px)',
      backgroundSize: 'auto, 60px 60px, 60px 60px',
      backgroundAttachment: 'fixed',
    }}>

      {/* -- NAV -- */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(3,7,18,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1e293b',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f5d4, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Fingerprint size={18} color="#000" />
          </div>
          <div>
            <span style={{ 
              fontFamily: 'Syne, sans-serif', fontWeight: 900,
              fontSize: '18px', color: '#f1f5f9', letterSpacing: '-0.02em',
            }}>DIVS</span>
            <span style={{
              marginLeft: '8px', fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              color: '#64748b',
              background: 'rgba(100,116,139,0.15)',
              border: '1px solid #1e293b',
              padding: '2px 8px', borderRadius: '6px',
            }}>ADMIN</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadData} style={{
            background: 'rgba(13,21,38,0.8)',
            border: '1px solid #2d4a6e',
            color: '#94a3b8',
            fontFamily: 'Syne, sans-serif', fontWeight: 600,
            fontSize: '13px', padding: '8px 16px',
            borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => navigate('/')} style={{
            background: 'rgba(13,21,38,0.8)',
            border: '1px solid #2d4a6e',
            color: '#94a3b8',
            fontFamily: 'Syne, sans-serif', fontWeight: 600,
            fontSize: '13px', padding: '8px 16px',
            borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <LogOut size={13} /> Exit
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

        {/* -- PAGE HEADER -- */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: '32px', color: '#f1f5f9',
            letterSpacing: '-0.03em', marginBottom: '8px',
          }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Manage and review all identity verification submissions
          </p>
        </div>

        {/* -- STATS GRID -- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '40px',
        }}>
          {[
            { icon: Users, label: 'Total Users', value: stats.total, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
            { icon: CheckCircle, label: 'Verified', value: stats.verified, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
            { icon: Clock, label: 'Pending', value: stats.pending, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
            { icon: XCircle, label: 'Rejected', value: stats.rejected, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
            { icon: TrendingUp, label: 'Avg Score', value: `${stats.avgScore}%`, color: '#00f5d4', bg: 'rgba(0,245,212,0.1)', border: 'rgba(0,245,212,0.2)' },
          ].map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              style={{
                background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
                border: `1px solid ${stat.border}`,
                borderRadius: '16px',
                padding: '24px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: stat.bg, border: `1px solid ${stat.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 900,
                fontSize: '36px', color: stat.color,
                lineHeight: 1, marginBottom: '8px',
              }}>{stat.value}</div>
              <div style={{
                fontSize: '13px', color: '#64748b',
                fontFamily: 'Inter, sans-serif',
              }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* -- FILTERS BAR -- */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,21,38,0.98), rgba(17,24,39,0.98))',
          border: '1px solid #2d4a6e',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '14px',
              top: '50%', transform: 'translateY(-50%)',
              color: '#64748b',
            }} />
            <input
              type="text"
              placeholder="Search by name, email or document number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(3,7,18,0.7)',
                border: '1px solid #2d4a6e',
                borderRadius: '10px',
                color: '#f1f5f9',
                padding: '11px 16px 11px 40px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'verified', 'under_review', 'pending', 'rejected'].map(s => (
              <button key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: statusFilter === s
                    ? 'linear-gradient(135deg, #00f5d4, #3b82f6)'
                    : 'rgba(13,21,38,0.8)',
                  color: statusFilter === s ? '#030712' : '#94a3b8',
                  border: statusFilter === s
                    ? 'none'
                    : '1px solid #2d4a6e',
                }}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* -- TABLE -- */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,21,38,0.99), rgba(10,15,30,0.99))',
          border: '1px solid #2d4a6e',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderBottom: '1px solid #2d4a6e',
                }}>
                  {['Name & Email', 'Document', 'Status', 'Score', 'Audit Hash', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '16px 20px',
                      fontSize: '11px',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#475569',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px' }}>
                        Loading records...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>
                      No records found
                    </td>
                  </tr>
                ) : filtered.map(id => (
                  <tr key={id.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                    {/* Name */}
                    <td style={{ padding: '20px' }}>
                      <div style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        fontSize: '15px', color: '#f1f5f9', marginBottom: '4px',
                      }}>{id.full_name}</div>
                      <div style={{
                        fontSize: '12px', color: '#64748b',
                        fontFamily: 'DM Mono, monospace',
                      }}>{id.email}</div>
                    </td>

                    {/* Document */}
                    <td style={{ padding: '20px' }}>
                      <div style={{
                        fontSize: '12px', fontFamily: 'DM Mono, monospace',
                        color: '#94a3b8', fontWeight: 600,
                        textTransform: 'uppercase', marginBottom: '4px',
                      }}>{id.document_type}</div>
                      <div style={{
                        fontSize: '12px', color: '#64748b',
                        fontFamily: 'DM Mono, monospace',
                      }}>{id.document_number}</div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '20px' }}>
                      <span className={`badge ${getStatusBadge(id.status)}`}
                        style={{ fontSize: '11px', padding: '5px 12px' }}>
                        {getStatusLabel(id.status)}
                      </span>
                    </td>

                    {/* Score */}
                    <td style={{ padding: '20px', minWidth: '120px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <div style={{
                          flex: 1, height: '6px', borderRadius: '3px',
                          background: '#1e293b', overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: '3px',
                            width: `${id.verification_score}%`,
                            background: id.verification_score >= 80
                              ? 'linear-gradient(90deg, #10b981, #00f5d4)'
                              : id.verification_score >= 60
                              ? '#f59e0b'
                              : '#ef4444',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: '13px', color: '#94a3b8',
                          fontFamily: 'DM Mono, monospace',
                          fontWeight: 500, minWidth: '36px',
                        }}>{id.verification_score}%</span>
                      </div>
                    </td>

                    {/* Hash */}
                    <td style={{ padding: '20px' }}>
                      <div style={{
                        fontSize: '11px', color: '#00f5d4',
                        fontFamily: 'DM Mono, monospace',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        <Hash size={10} />
                        {id.audit_hash || '—'}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '20px' }}>
                      <div style={{
                        fontSize: '13px', color: '#64748b',
                        fontFamily: 'DM Mono, monospace',
                      }}>
                        {new Date(id.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '20px' }}>
                      <button onClick={() => setSelected(id)}
                        style={{
                          background: 'rgba(13,21,38,0.8)',
                          border: '1px solid #2d4a6e',
                          color: '#94a3b8',
                          fontFamily: 'Syne, sans-serif', fontWeight: 600,
                          fontSize: '12px', padding: '8px 16px',
                          borderRadius: '8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#00f5d4'
                          ;(e.currentTarget as HTMLElement).style.color = '#00f5d4'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#2d4a6e'
                          ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
                        }}>
                        <Eye size={13} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid #1e293b',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '12px', color: '#475569',
              fontFamily: 'DM Mono, monospace',
            }}>
              Showing {filtered.length} of {identities.length} records
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }} />
              <span style={{
                fontSize: '11px', color: '#64748b',
                fontFamily: 'DM Mono, monospace',
              }}>Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* -- DETAIL MODAL (keep existing modal code, just update its styles) -- */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
        }}
        onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              background: 'linear-gradient(160deg, rgba(13,21,38,0.99), rgba(10,15,30,0.99))',
              border: '1px solid #2d4a6e',
              borderRadius: '24px',
              padding: '36px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}>

            {/* Modal header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '28px',
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900,
                  fontSize: '22px', color: '#f1f5f9', marginBottom: '6px',
                }}>{selected.full_name}</h3>
                <p style={{
                  fontSize: '13px', color: '#64748b',
                  fontFamily: 'DM Mono, monospace',
                }}>{selected.email}</p>
              </div>
              <span className={`badge ${getStatusBadge(selected.status)}`}>
                {getStatusLabel(selected.status)}
              </span>
            </div>

            {/* Detail rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Phone', value: selected.phone },
                { label: 'Document', value: `${selected.document_type?.toUpperCase()} · ${selected.document_number}` },
                { label: 'Verification Score', value: `${selected.verification_score}%` },
                { label: 'Liveness Score', value: selected.liveness_score ? `${selected.liveness_score}%` : '—' },
                { label: 'OCR Confidence', value: selected.ocr_confidence ? `${selected.ocr_confidence}%` : '—' },
                { label: 'Submitted', value: new Date(selected.created_at).toLocaleString('en-IN') },
                { label: 'Audit Hash', value: selected.audit_hash || '—' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'rgba(8,14,24,0.6)',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  gap: '16px',
                }}>
                  <span style={{
                    fontSize: '11px', fontFamily: 'Syne, sans-serif',
                    fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#475569',
                    flexShrink: 0,
                  }}>{item.label}</span>
                  <span style={{
                    fontSize: '13px', fontFamily: 'DM Mono, monospace',
                    color: '#94a3b8', textAlign: 'right',
                    wordBreak: 'break-all',
                  }}>{item.value}</span>
                </div>
              ))}
            </div>

            {selected.rejection_reason && (
              <div style={{
                padding: '14px 18px', borderRadius: '10px', marginBottom: '20px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <p style={{ fontSize: '13px', color: '#ef4444' }}>
                  ⚠ {selected.rejection_reason}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {selected.status !== 'verified' && (
                <button
                  onClick={() => updateStatus(selected.id, 'verified')}
                  style={{
                    flex: 1, padding: '12px 20px',
                    background: 'linear-gradient(135deg, #10b981, #00f5d4)',
                    color: '#030712', border: 'none',
                    borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: '13px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {selected.status !== 'rejected' && (
                <button
                  onClick={() => {
                    const reason = prompt('Rejection reason:')
                    if (reason) updateStatus(selected.id, 'rejected', reason)
                  }}
                  style={{
                    flex: 1, padding: '12px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#ef4444', borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: '13px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                  <XCircle size={14} /> Reject
                </button>
              )}
              <button onClick={() => setSelected(null)}
                style={{
                  padding: '12px 20px',
                  background: 'rgba(13,21,38,0.8)',
                  border: '1px solid #2d4a6e',
                  color: '#94a3b8', borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600,
                  fontSize: '13px',
                }}>
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
