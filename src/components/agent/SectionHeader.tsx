import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SectionHeaderProps {
  title: string
  linkText?: string
  linkPath?: string
}

export default function SectionHeader({ title, linkText = 'View All', linkPath }: SectionHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-medium text-gray-400">{title}</h4>
      {linkPath && (
        <button
          onClick={() => navigate(linkPath)}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>{linkText}</span>
          <ExternalLink size={12} />
        </button>
      )}
    </div>
  )
}
