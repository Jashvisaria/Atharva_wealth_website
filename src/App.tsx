import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BlogList from './pages/blog/BlogList'
import BlogPost from './pages/blog/BlogPost'
import AdminHome from './pages/admin/AdminHome'
import AdminLogin from './pages/admin/AdminLogin'
import AdminBlogsList from './pages/admin/AdminBlogsList'
import AdminBlogNew from './pages/admin/AdminBlogNew'
import AdminBlogEdit from './pages/admin/AdminBlogEdit'
import RequireAdmin from './components/admin/RequireAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminHome />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <RequireAdmin>
              <AdminBlogsList />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/blogs/new"
          element={
            <RequireAdmin>
              <AdminBlogNew />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/blogs/:id/edit"
          element={
            <RequireAdmin>
              <AdminBlogEdit />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
