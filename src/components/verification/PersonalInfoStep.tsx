import { memo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, ArrowRight } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import toast from 'react-hot-toast'

type PersonalForm = {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
}

type FieldProps = {
  icon: typeof User
  label: string
  type: string
  name: keyof PersonalForm
  value: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Field = ({ icon: Icon, label, type, name, value, placeholder = '', onChange }: FieldProps) => (
  <div>
    <label className="font-syne font-bold block uppercase"
      style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '10px', letterSpacing: '0.14em' }}>{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--text-secondary)' }} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="cyber-input"
        style={{ paddingLeft: '44px', paddingTop: '15px', paddingBottom: '15px', paddingRight: '18px', fontSize: '15px' }}
      />
    </div>
  </div>
)

function PersonalInfoStep() {
  const { identity, updateIdentity, setCurrentStep } = useAppStore()
  const [form, setForm] = useState({
    fullName: identity.fullName || '',
    email: identity.email || '',
    phone: identity.phone || '',
    dateOfBirth: identity.dateOfBirth || '',
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleNext = () => {
    if (!form.fullName || !form.email || !form.phone || !form.dateOfBirth) {
      return toast.error('Please fill in all fields')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('Invalid email address')
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      return toast.error('Invalid phone number')
    }
    updateIdentity(form)
    setCurrentStep('document-upload')
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="badge badge-info mb-3" style={{ display: 'inline-flex', fontSize: '12px', padding: '6px 14px' }}>Step 1 of 4</div>
        <h2 className="font-syne font-black text-3xl mb-3" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
          Personal Information
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '28px' }}>
          Provide your basic information to begin the verification process
        </p>
      </div>

      <div className="space-y-6" style={{ paddingBottom: '8px' }}>
        <Field
          icon={User}
          label="Full Name"
          type="text"
          name="fullName"
          value={form.fullName}
          placeholder="John Doe"
          onChange={handleChange}
        />
        <Field
          icon={Mail}
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          placeholder="john@example.com"
          onChange={handleChange}
        />
        <Field
          icon={Phone}
          label="Phone Number"
          type="tel"
          name="phone"
          value={form.phone}
          placeholder="9876543210"
          onChange={handleChange}
        />
        <Field
          icon={Calendar}
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
      </div>

      <div className="rounded-xl" style={{ marginTop: '8px', padding: '14px 18px', background: 'rgba(0,112,243,0.08)', border: '1px solid rgba(0,112,243,0.2)' }}>
        <p style={{ color: '#60a5fa', fontSize: '13px', lineHeight: 1.7 }}>
          🔒 Your data is encrypted end-to-end. We use AES-256 encryption and never share your personal information.
        </p>
      </div>

      <button
        className="btn-primary"
        style={{
          width: '100%',
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '15px 24px',
          fontSize: '15px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
        onClick={handleNext}>
        Continue to Document Upload <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

export default memo(PersonalInfoStep)
