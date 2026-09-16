import {
  TrendingUp,
  PieChart,
  Landmark,
  Receipt,
  Umbrella,
  Target,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'

interface CategoryStyle {
  icon: LucideIcon
  gradient: string
}

const KNOWN_CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Markets: {
    icon: TrendingUp,
    gradient: 'from-blue-500/20 via-obsidian to-obsidian',
  },
  'Mutual Funds': {
    icon: PieChart,
    gradient: 'from-emerald-500/20 via-obsidian to-obsidian',
  },
  'PMS & AIF': {
    icon: Landmark,
    gradient: 'from-purple-500/20 via-obsidian to-obsidian',
  },
  'Tax Planning': {
    icon: Receipt,
    gradient: 'from-red-500/20 via-obsidian to-obsidian',
  },
  Retirement: {
    icon: Umbrella,
    gradient: 'from-amber-500/20 via-obsidian to-obsidian',
  },
  'Financial Planning': {
    icon: Target,
    gradient: 'from-cyan-500/20 via-obsidian to-obsidian',
  },
}

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: Newspaper,
  gradient: 'from-gold-500/20 via-obsidian to-obsidian',
}

// Category is free text in Supabase (admin-authored), so any value not in
// the known set above falls back to a generic look rather than breaking.
export function getCategoryStyle(category: string | null | undefined): CategoryStyle {
  if (category && KNOWN_CATEGORY_STYLES[category]) return KNOWN_CATEGORY_STYLES[category]
  return DEFAULT_CATEGORY_STYLE
}
