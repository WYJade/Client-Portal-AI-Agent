import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  Clipboard, 
  PackageCheck, 
  Package, 
  PanelLeftClose,
  Headphones,
  Users,
  Truck,
  ShoppingBag,
  Shield,
  Bot,
  LucideIcon 
} from 'lucide-react'
import { MenuItem, AIAgentGroup } from '../../types/menu'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Clipboard,
  PackageCheck,
  Package,
  Headphones,
  Handshake: Users,
  Truck,
  ShoppingBag,
  Shield,
}

interface SubSidebarProps {
  title: string
  menuItems?: MenuItem[]
  agentGroups?: AIAgentGroup[]
  selectedAgentId?: string
  onAgentSelect?: (id: string) => void
}

export default function SubSidebar({ title, menuItems, agentGroups, selectedAgentId, onAgentSelect }: SubSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['dashboards', 'inventory', 'customer-service', 'supplier-collaboration', 'logistics-operations', 'procurement-inventory', 'support-assurance']))
  const navigate = useNavigate()
  const location = useLocation()

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) newExpanded.delete(id)
    else newExpanded.add(id)
    setExpandedItems(newExpanded)
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isActive = item.path === location.pathname
    const Icon = item.icon ? iconMap[item.icon] : null

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) toggleExpand(item.id)
            else if (item.path) navigate(item.path)
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            isActive ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300 hover:bg-gray-800'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {Icon && <Icon size={16} />}
          {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          <span className="flex-1 text-left">{item.label}</span>
        </button>
        {hasChildren && isExpanded && (
          <div>{item.children!.map((child) => renderMenuItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const renderAgentGroups = () => {
    return agentGroups?.map((group) => {
      const isExpanded = expandedItems.has(group.id)
      const Icon = group.icon ? iconMap[group.icon] : null
      const hasSelectedAgent = group.agents.some(agent => agent.id === selectedAgentId)
      
      return (
        <div key={group.id} className="mb-1">
          {/* Group Header */}
          <button
            onClick={() => toggleExpand(group.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-all ${
              hasSelectedAgent && !isExpanded 
                ? 'bg-purple-600/10 text-purple-400' 
                : 'text-gray-200 hover:bg-gray-800'
            }`}
          >
            {Icon && (
              <div className={`p-1 rounded ${hasSelectedAgent ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                <Icon size={14} />
              </div>
            )}
            <span className="flex-1 text-left font-medium">{group.label}</span>
            <ChevronDown 
              size={14} 
              className={`text-gray-500 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
            />
          </button>
          
          {/* Agent List */}
          <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="ml-3 pl-3 border-l border-gray-800 mt-1 space-y-0.5">
              {group.agents.map((agent) => {
                const isSelected = selectedAgentId === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => onAgentSelect?.(agent.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <Bot size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />
                    <span className="flex-1 text-left">{agent.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <span className="font-medium text-gray-100">{title}</span>
        <PanelLeftClose size={18} className="text-gray-500 cursor-pointer hover:text-gray-300" />
      </div>
      <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {menuItems && menuItems.map((item) => renderMenuItem(item))}
        {agentGroups && renderAgentGroups()}
      </div>
    </div>
  )
}
