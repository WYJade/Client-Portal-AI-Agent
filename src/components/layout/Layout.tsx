import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MainSidebar from './MainSidebar'
import SubSidebar from './SubSidebar'
import TopBar from './TopBar'
import { homeMenuItems, aiAgentGroups, aiAgents } from '../../data/menuConfig'

export default function Layout() {
  const [activeModule, setActiveModule] = useState<'home' | 'agents' | 'favorites'>('agents')
  const [selectedAgentId, setSelectedAgentId] = useState('customer-agent')

  const getSubSidebarConfig = () => {
    if (activeModule === 'agents') {
      return {
        title: 'AI Agents',
        agentGroups: aiAgentGroups,
        selectedAgentId,
        onAgentSelect: setSelectedAgentId,
      }
    }
    return { title: 'Home', menuItems: homeMenuItems }
  }

  return (
    <div className="h-screen flex bg-gray-950">
      <MainSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <SubSidebar {...getSubSidebarConfig()} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <Outlet context={{ selectedAgentId, agents: aiAgents }} />
        </main>
        <footer className="text-center text-xs text-gray-500 py-2 border-t border-gray-800">
          © 2025 item.com
        </footer>
      </div>
    </div>
  )
}
