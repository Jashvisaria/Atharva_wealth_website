import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/blogs" element={<AdminBlogListPage />} />
        <Route path="/admin/blogs/new" element={<AdminBlogFormPage />} />
        <Route path="/admin/blogs/:id/edit" element={<AdminBlogEditPage />} />
      </Routes>
    </Router>
  )
}

export default App