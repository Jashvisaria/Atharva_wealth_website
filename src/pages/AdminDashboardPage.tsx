import { useSupacheck } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboardPage() {
  const { session } = useSupacheck()
  const navigate = useNavigate()

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.id) {
      const { data } = await supabase.from('admin_users').select('*').eq('user_id', session.user.id)
      if (!data?.length) {
        window.location.href = '/admin/login'
      }
    } else {
      window.location.href = '/admin/login'
    }
  }, [session])

  if (!session) {
    navigate('/admin/login')
    return null
  }

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-3xl font-bold text-amber-500 mb-6">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold" id="total-blogs">Loading...</h3>
                  <p className="text-sm text-base-content/60">Total Blogs</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold" id="published-blogs">Loading...</h3>
                  <p className="text-sm text-base-content/60">Published</p>
                </div>
              </div>
              
              <div>
                <a href="/admin/blogs" className="btn btn-primary w-full mb-4">
                  Manage Blogs
                </a>
                <a href="/admin/blogs/new" className="btn btn-outline w-full">
                  Create New Blog
                </a>
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}