import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../lib/useAdminAuth'

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="text-gray-400 text-sm tracking-wide">Checking admin access...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default RequireAdmin
