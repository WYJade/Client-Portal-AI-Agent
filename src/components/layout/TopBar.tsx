import { Bell, HelpCircle, Settings, User } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded" />
          <div className="w-6 h-6 bg-purple-500 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Settings size={18} />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <HelpCircle size={18} />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
          <User size={16} />
          <span>Assistant</span>
        </button>
      </div>
    </div>
  )
}
