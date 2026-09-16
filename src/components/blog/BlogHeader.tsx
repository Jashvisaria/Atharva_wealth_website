import { Link } from 'react-router-dom'

function BlogHeader() {
  return (
    <header className="relative grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-obsidian to-obsidian pointer-events-none" />

      <div
        className="relative z-10 border-b"
        style={{ borderColor: 'rgba(197, 160, 89, 0.1)' }}
      >
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <span className="text-obsidian text-sm font-bold">AW</span>
            </div>
            <span className="text-lg font-bold tracking-wider text-white">
              ATHARVA <span className="text-gold-500">WEALTH</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gold-500 transition-colors uppercase tracking-wider"
          >
            &larr; Back to Site
          </Link>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-20">
        <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          Atharva Wealth Insights
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 max-w-3xl">
          The <span className="text-gold-500">Blog</span>
        </h1>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
          Institutional-grade perspectives on markets, mutual funds, PMS &amp; AIF strategy,
          tax planning, and building lasting wealth.
        </p>
      </div>

      <div className="gold-line" />
    </header>
  )
}

export default BlogHeader
