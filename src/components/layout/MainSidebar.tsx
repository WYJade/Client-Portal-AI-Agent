import { Home, Bot, Heart, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface MainSidebarProps {
  activeModule: 'home' | 'agents' | 'favorites'
  onModuleChange: (module: 'home' | 'agents' | 'favorites') => void
}

export default function MainSidebar({ activeModule, onModuleChange }: MainSidebarProps) {
  const navigate = useNavigate()

  const handleClick = (module: 'home' | 'agents' | 'favorites') => {
    onModuleChange(module)
    if (module === 'home') navigate('/home')
    else if (module === 'agents') navigate('/agents')
    else navigate('/favorites')
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-8">
        <span className="text-white font-bold text-sm">P</span>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-2">
        <button
          onClick={() => handleClick('home')}
          className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeModule === 'home' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => handleClick('agents')}
          className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeModule === 'agents' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Bot size={20} />
          <span className="text-[10px]">Agents</span>
        </button>

        <button
          onClick={() => handleClick('favorites')}
          className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeModule === 'favorites' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Heart size={20} />
          <span className="text-[10px]">Favorites</span>
        </button>
      </nav>

      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
        <User size={20} />
      </button>
    </div>
  )
}
