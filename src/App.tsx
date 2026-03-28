import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/appStore'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import VerifyPage from './pages/VerifyPage'
import AdminPage from './pages/AdminPage'
import AccessDeniedPage from './pages/AccessDeniedPage'

export default function App() {
  const { checkSession } = useAppStore()

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1621',
            color: '#e8f4fd',
            border: '1px solid #1a2e45',
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            borderRadius: '10px',
          },
        }}
      />
      <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
