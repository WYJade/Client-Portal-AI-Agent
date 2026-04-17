import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, LayoutDashboard, ShoppingCart, FileText, Clipboard, PackageCheck, Package, PanelLeftClose, Circle } from 'lucide-react'
import { MenuItem, AIAgentGroup } from '../../types/menu'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Clipboard,
  PackageCheck,
  Package,
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
            isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
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
      return (
        <div key={group.id}>
          <button
            onClick={() => toggleExpand(group.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Circle size={8} className="text-gray-400" fill="currentColor" />
            <span className="flex-1 text-left font-medium">{group.label}</span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isExpanded && (
            <div className="ml-4">
              {group.agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onAgentSelect?.(agent.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedAgentId === agent.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Circle size={6} className="text-gray-300" />
                  <span className="flex-1 text-left">{agent.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <span className="font-medium text-gray-900">{title}</span>
        <PanelLeftClose size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {menuItems && menuItems.map((item) => renderMenuItem(item))}
        {agentGroups && renderAgentGroups()}
      </div>
    </div>
  )
}
