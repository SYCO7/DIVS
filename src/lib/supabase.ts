import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      identities: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          date_of_birth: string
          document_type: string
          document_number: string
          face_descriptor: number[] | null
          status: 'pending' | 'verified' | 'rejected' | 'under_review'
          verification_score: number
          created_at: string
          updated_at: string
          verified_at: string | null
          document_url: string | null
          selfie_url: string | null
          audit_hash: string | null
          rejection_reason: string | null
          liveness_score: number | null
          ocr_confidence: number | null
        }
      }
      verification_logs: {
        Row: {
          id: string
          identity_id: string
          action: string
          metadata: Record<string, unknown>
          ip_address: string | null
          created_at: string
          hash: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'reviewer'
          created_at: string
        }
      }
    }
  }
}
