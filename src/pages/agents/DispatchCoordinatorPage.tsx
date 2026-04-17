import { useState, useCallback } from 'react'
import { Truck, MapPin, Clock, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const dispatchVolume = [
  { hour: '6AM', dispatched: 12, delivered: 8 },
  { hour: '8AM', dispatched: 28, delivered: 15 },
  { hour: '10AM', dispatched: 35, delivered: 24 },
  { hour: '12PM', dispatched: 22, delivered: 32 },
  { hour: '2PM', dispatched: 18, delivered: 28 },
  { hour: '4PM', dispatched: 8, delivered: 22 },
]

const activeDispatches = [
  { id: 'DSP-1847', driver: 'John M.', route: 'Route A - Downtown', stops: '8/12', status: 'in-transit', eta: '2:30 PM' },
  { id: 'DSP-1846', driver: 'Sarah K.', route: 'Route B - Industrial', stops: '5/8', status: 'in-transit', eta: '3:15 PM' },
  { id: 'DSP-1845', driver: 'Mike R.', route: 'Route C - Suburbs', stops: '10/10', status: 'completed', eta: 'Done' },
  { id: 'DSP-1844', driver: 'Lisa T.', route: 'Route D - Airport', stops: '0/6', status: 'pending', eta: '4:00 PM' },
  { id: 'DSP-1843', driver: 'Tom B.', route: 'Route E - Harbor', stops: '3/5', status: 'delayed', eta: '5:30 PM' },
]

const quickActions = [
  { label: '🚚 Show active dispatches status', action: 'Show active dispatches status' },
  { label: '⚠️ Any delivery delays today?', action: 'Any delivery delays today?' },
  { label: '📊 Today\'s dispatch performance', action: "Today's dispatch performance" },
  { label: '🗺️ Optimize route for pending deliveries', action: 'Optimize route for pending deliveries' },
  { label: '👤 Check driver availability', action: 'Check driver availability' },
  { label: '📦 Assign new shipment to driver', action: 'Assign new shipment to driver' },
]

const columns = [
  { key: 'id', label: 'Dispatch ID' },
  { key: 'driver', label: 'Driver' },
  { key: 'route', label: 'Route' },
  { key: 'stops', label: 'Stops', align: 'center' as const },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'pending'> = {
        'completed': 'success',
        'in-transit': 'info',
        'delayed': 'error',
        'pending': 'pending',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'eta', label: 'ETA', align: 'right' as const },
]

export default function DispatchCoordinatorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chartPanel, setChartPanel] = useState<React.ReactNode | null>(null)
  const [chartData, setChartData] = useState<any[] | null>(null)
  const [chartTitle, setChartTitle] = useState('')
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      let response = ''

      if (content.toLowerCase().includes('active') || content.toLowerCase().includes('status')) {
        response = `🚚 **Active Dispatches Overview**\n\n**Current Status:**\n• In Transit: 8 vehicles\n• Completed Today: 12 routes\n• Pending Departure: 3 vehicles\n• Delayed: 1 vehicle\n\n**Live Updates:**\n\n🟢 **DSP-1847** (John M.) - Route A\n   └ 8 of 12 stops completed, on schedule\n\n🟢 **DSP-1846** (Sarah K.) - Route B\n   └ 5 of 8 stops completed, ahead by 10 min\n\n🔴 **DSP-1843** (Tom B.) - Route E\n   └ Traffic delay on Harbor Blvd\n   └ New ETA: 5:30 PM (+45 min)\n\nWould you like me to contact any driver or reassign stops?`
      } else if (content.toLowerCase().includes('delay')) {
        response = `⚠️ **Delivery Delays Report**\n\n**Current Delays (2):**\n\n1. **DSP-1843** - Route E (Harbor)\n   • Driver: Tom B.\n   • Cause: Traffic congestion on Harbor Blvd\n   • Impact: 3 deliveries delayed by ~45 min\n   • Action: Customer notifications sent\n\n2. **DSP-1840** - Route F (Completed with delay)\n   • Driver: Amy L.\n   • Cause: Vehicle maintenance issue\n   • Impact: 2 deliveries delayed by 1 hour\n   • Status: Resolved, all delivered\n\n**Delay Rate Today:** 4.2% (below 5% target ✅)\n\nShould I prepare alternative routing for affected deliveries?`
      } else if (content.toLowerCase().includes('performance')) {
        response = `📊 **Today's Dispatch Performance**\n\n**Summary:**\n• Total Dispatches: 24\n• Completed: 12 (50%)\n• In Progress: 9 (37.5%)\n• Pending: 3 (12.5%)\n\n**Key Metrics:**\n✅ On-Time Rate: 95.8%\n✅ Avg Delivery Time: 18 min/stop\n✅ Customer Satisfaction: 4.8/5\n⚠️ Fuel Efficiency: 92% (target: 95%)\n\n**Peak Hours:** 8AM-12PM (highest volume)\n\nI've opened the hourly dispatch chart on the right.`
        setChartData(dispatchVolume)
        setChartTitle('Hourly Dispatch Volume')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Hourly Dispatch Volume</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dispatchVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="dispatched" fill="#8b5cf6" name="Dispatched" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill="#22c55e" name="Delivered" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Purple: Dispatched | Green: Delivered</div>
          </div>
        )
      } else if (content.toLowerCase().includes('optimize') || content.toLowerCase().includes('route')) {
        response = `🗺️ **Route Optimization Analysis**\n\n**Pending Deliveries:** 18 stops across 3 routes\n\n**Optimization Recommendations:**\n\n📍 **Route D (Lisa T.)** - 6 stops\n   • Current: 42 miles, ~2.5 hours\n   • Optimized: 36 miles, ~2 hours\n   • Savings: 14% distance, 20% time\n\n📍 **Route G (Pending)** - 8 stops\n   • Suggested merge with Route H\n   • Combined efficiency gain: 25%\n\n**Actions Available:**\n• Apply optimized routes\n• Reassign stops between drivers\n• Schedule for next available driver\n\nWould you like me to apply these optimizations?`
      } else if (content.toLowerCase().includes('driver') || content.toLowerCase().includes('availability')) {
        response = `👤 **Driver Availability**\n\n**Currently Available (3):**\n🟢 Lisa T. - Ready for dispatch\n🟢 David W. - Returns in 30 min\n🟢 Chris P. - On standby\n\n**In Transit (5):**\n🔵 John M. - ETA 2:30 PM\n🔵 Sarah K. - ETA 3:15 PM\n🔵 Tom B. - ETA 5:30 PM (delayed)\n🔵 Mike R. - Completing route\n🔵 Amy L. - ETA 4:00 PM\n\n**Off Duty (2):**\n⚫ Robert H. - Scheduled off\n⚫ Emma S. - Scheduled off\n\nWould you like to assign a shipment to an available driver?`
      } else if (content.toLowerCase().includes('assign')) {
        response = `📦 **Shipment Assignment**\n\nI can help assign new shipments. Please provide:\n\n1. **Shipment ID** or details\n2. **Priority level** (Standard/Express/Urgent)\n3. **Preferred driver** (optional)\n\n**Available for immediate dispatch:**\n• Lisa T. - Can handle up to 8 stops\n• David W. - Available in 30 min\n• Chris P. - On standby, ready now\n\n**Pending Shipments (3):**\n• SHP-2841 - 4 packages, Downtown\n• SHP-2842 - 2 packages, Airport\n• SHP-2843 - 6 packages, Industrial\n\nWhich shipment would you like to assign?`
      } else {
        response = `I coordinate dispatch operations and optimize delivery routes. I can help you with:\n\n• Monitor active dispatches in real-time\n• Track and resolve delivery delays\n• Optimize routes for efficiency\n• Manage driver assignments\n• Analyze dispatch performance\n\nWhat would you like to do?`
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMessage])
    }, 800)
  }, [])

  const handleCloseChart = () => {
    setChartPanel(null)
    setChartData(null)
    setChartTitle('')
  }

  const statsPanel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Dispatch Control Center</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Vehicles"
          value="8"
          subtitle="On the road"
          icon={<Truck size={20} />}
          color="purple"
        />
        <StatCard
          title="Deliveries Today"
          value="156"
          subtitle="89 completed"
          trend="up"
          trendValue="12% ahead of schedule"
          icon={<MapPin size={20} />}
          color="green"
        />
        <StatCard
          title="Avg Delivery Time"
          value="18 min"
          subtitle="Per stop"
          trend="up"
          trendValue="2 min faster"
          icon={<Clock size={20} />}
          color="blue"
        />
        <StatCard
          title="Delays"
          value="1"
          subtitle="Active issue"
          trend="down"
          trendValue="3 less than yesterday"
          icon={<AlertCircle size={20} />}
          color="orange"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Dispatches</h4>
        <DataTable columns={columns} data={activeDispatches} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Dispatch Coordinator"
      welcomeMessage="I help coordinate dispatch operations, optimize delivery routes, and ensure timely deliveries. Ask me about active dispatches, driver availability, or let me help optimize your routes."
      statsPanel={statsPanel}
      quickActions={quickActions}
      messages={messages}
      onSendMessage={handleSendMessage}
      chartPanel={chartPanel}
      chartData={chartData || undefined}
      chartTitle={chartTitle}
      onCloseChart={handleCloseChart}
      isChartExpanded={isChartExpanded}
      onToggleChartExpand={() => setIsChartExpanded(!isChartExpanded)}
    />
  )
}
