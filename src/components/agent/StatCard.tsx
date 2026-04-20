import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: ReactNode
  color?: 'purple' | 'green' | 'blue' | 'orange' | 'red' | 'gray'
  linkPath?: string
}

const colorClasses = {
  purple: 'bg-purple-500/20 text-purple-400',
  green: 'bg-green-500/20 text-green-400',
  blue: 'bg-blue-500/20 text-blue-400',
  orange: 'bg-orange-500/20 text-orange-400',
  red: 'bg-red-500/20 text-red-400',
  gray: 'bg-gray-500/20 text-gray-400',
}

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-500',
}

export default function StatCard({ title, value, subtitle, trend, trendValue, icon, color = 'purple', linkPath }: StatCardProps) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (linkPath) {
      navigate(linkPath)
    }
  }

  return (
    <div 
      className={`bg-gray-800 rounded-xl border border-gray-700 p-4 transition-all ${
        linkPath ? 'cursor-pointer hover:border-purple-500/50 hover:bg-gray-800/80 group' : 'hover:border-gray-600'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className={`text-xs font-medium uppercase tracking-wide ${linkPath ? 'text-purple-400' : 'text-gray-400'}`}>
              {title}
            </p>
            {linkPath && (
              <ExternalLink size={10} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <p className={`mt-1 text-2xl font-semibold ${linkPath ? 'text-purple-300 group-hover:text-purple-200' : 'text-gray-100'}`}>
            {value}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          {trend && trendValue && (
            <div className={`mt-2 flex items-center gap-1 text-xs ${trendColors[trend]}`}>
              {trend === 'up' && <TrendingUp size={12} />}
              {trend === 'down' && <TrendingDown size={12} />}
              {trend === 'neutral' && <Minus size={12} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
