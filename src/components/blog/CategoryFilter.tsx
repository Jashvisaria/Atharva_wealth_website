interface CategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const options: string[] = ['All', ...categories]

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap">
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border ${
              isActive
                ? 'text-obsidian border-gold-500'
                : 'glass-card text-gray-300 border-gold-500/15 hover:border-gold-500/50 hover:text-white'
            }`}
            style={
              isActive
                ? { background: 'linear-gradient(135deg, #C5A059 0%, #D4A56B 50%, #C5A059 100%)' }
                : undefined
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
