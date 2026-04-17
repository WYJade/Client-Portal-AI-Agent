import { useState, useCallback } from 'react'
import { Warehouse, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const zoneUtilization = [
  { zone: 'Zone A', utilization: 85, capacity: 100 },
  { zone: 'Zone B', utilization: 72, capacity: 100 },
  { zone: 'Zone C', utilization: 94, capacity: 100 },
  { zone: 'Zone D', utilization: 58, capacity: 100 },
]

const recentTasks = [
  { id: 'TSK-4521', type: 'Pick', location: 'A-12-3', item: 'SKU-78451', qty: 24, status: 'in-progress', assignee: 'John D.' },
  { id: 'TSK-4520', type: 'Put Away', location: 'B-08-2', item: 'SKU-65432', qty: 48, status: 'completed', assignee: 'Sarah M.' },
  { id: 'TSK-4519', type: 'Pick', location: 'C-15-1', item: 'SKU-98765', qty: 12, status: 'pending', assignee: 'Unassigned' },
  { id: 'TSK-4518', type: 'Cycle Count', location: 'D-03-4', item: 'Multiple', qty: 0, status: 'in-progress', assignee: 'Mike R.' },
  { id: 'TSK-4517', type: 'Replenish', location: 'A-05-2', item: 'SKU-45678', qty: 100, status: 'pending', assignee: 'Lisa T.' },
]

const quickActions = [
  { label: '📦 Show current warehouse status', action: 'Show current warehouse status' },
  { label: '📍 Find item location', action: 'Find location for SKU-78451' },
  { label: '📊 Zone utilization report', action: 'Zone utilization report' },
  { label: '📋 Pending pick tasks', action: 'Show pending pick tasks' },
  { label: '⚠️ Any low stock alerts?', action: 'Any low stock alerts?' },
  { label: '🔄 Optimize put-away location', action: 'Suggest optimal put-away location' },
]

const columns = [
  { key: 'id', label: 'Task ID' },
  { key: 'type', label: 'Type' },
  { key: 'location', label: 'Location' },
  { key: 'item', label: 'Item' },
  { key: 'qty', label: 'Qty', align: 'center' as const },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'pending'> = {
        'completed': 'success',
        'in-progress': 'warning',
        'pending': 'pending',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
]

export default function WarehouseOperatorPage() {
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

      if (content.toLowerCase().includes('status') || content.toLowerCase().includes('warehouse')) {
        response = `🏭 **Warehouse Status Overview**\n\n**Facility:** Distribution Center - East\n\n**Current Metrics:**\n• Total Locations: 4,500\n• Occupied: 3,487 (77.5%)\n• Available: 1,013 (22.5%)\n\n**Today's Activity:**\n📥 Inbound: 12 receipts (2,450 units)\n📤 Outbound: 18 orders (1,890 units)\n🔄 Internal Moves: 45 tasks\n\n**Zone Status:**\n• Zone A (High Velocity): 85% full\n• Zone B (Medium Velocity): 72% full\n• Zone C (Bulk Storage): 94% full ⚠️\n• Zone D (Reserve): 58% full\n\n**Alerts:**\n⚠️ Zone C approaching capacity\n⚠️ 3 items below safety stock\n\nWould you like details on any specific zone?`
      } else if (content.toLowerCase().includes('find') || content.toLowerCase().includes('location') || content.toLowerCase().includes('sku')) {
        response = `📍 **Item Location: SKU-78451**\n\n**Product:** Industrial Sensor Module\n\n**Primary Location:**\n🏷️ **A-12-3** (Pick Face)\n• Quantity: 24 units\n• Last Count: Apr 16, 2026\n• Status: Available\n\n**Reserve Locations:**\n📦 A-12-4: 48 units\n📦 D-08-2: 96 units (Bulk)\n\n**Total On-Hand:** 168 units\n\n**Movement History (Last 7 Days):**\n• Picked: 72 units\n• Received: 144 units\n• Adjusted: 0 units\n\n**Velocity:** High (A-class item)\n**Reorder Point:** 50 units\n**Status:** ✅ Adequate stock\n\nWould you like me to create a pick task for this item?`
      } else if (content.toLowerCase().includes('utilization') || content.toLowerCase().includes('zone')) {
        response = `📊 **Zone Utilization Report**\n\n**Overall Warehouse:** 77.5% utilized\n\n**By Zone:**\n\n🟣 **Zone A - High Velocity**\n   • Utilization: 85%\n   • Locations: 1,200\n   • Items: Fast-moving SKUs\n   • Status: Optimal\n\n🟢 **Zone B - Medium Velocity**\n   • Utilization: 72%\n   • Locations: 1,000\n   • Items: Regular SKUs\n   • Status: Good capacity\n\n🟠 **Zone C - Bulk Storage**\n   • Utilization: 94% ⚠️\n   • Locations: 1,500\n   • Items: Bulk/Pallet storage\n   • Status: Near capacity\n\n🔵 **Zone D - Reserve**\n   • Utilization: 58%\n   • Locations: 800\n   • Items: Overflow/Seasonal\n   • Status: Available space\n\nI've opened the utilization chart on the right.`
        setChartData(zoneUtilization)
        setChartTitle('Zone Utilization')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Zone Utilization</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={zoneUtilization} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="zone" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="utilization" fill="#8b5cf6" name="Utilization %" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Target utilization: 80-85%</div>
          </div>
        )
      } else if (content.toLowerCase().includes('pick') || content.toLowerCase().includes('pending')) {
        response = `📋 **Pending Pick Tasks**\n\n**Total Pending:** 28 tasks\n**Estimated Time:** 2.5 hours\n\n**Priority Breakdown:**\n🔴 Urgent (5): Due within 1 hour\n🟡 Standard (18): Due within 4 hours\n🟢 Low (5): Due by end of day\n\n**Urgent Tasks:**\n\n1. **TSK-4525** - Order #ORD-9851\n   • SKU-45678 × 12 @ B-04-2\n   • Due: 30 minutes\n   • Assignee: Unassigned ⚠️\n\n2. **TSK-4524** - Order #ORD-9850\n   • SKU-78901 × 6 @ A-08-1\n   • Due: 45 minutes\n   • Assignee: John D.\n\n**Recommendation:**\nAssign TSK-4525 immediately to meet deadline.\n\nWould you like me to assign this task?`
      } else if (content.toLowerCase().includes('low stock') || content.toLowerCase().includes('alert')) {
        response = `⚠️ **Low Stock Alerts**\n\n**Below Safety Stock (3 items):**\n\n🔴 **SKU-34521** - Power Adapter\n   • On-Hand: 12 units\n   • Safety Stock: 25 units\n   • Reorder Point: 50 units\n   • PO Status: PO-4518 in transit (ETA Apr 19)\n\n🔴 **SKU-67890** - USB Cable Type-C\n   • On-Hand: 8 units\n   • Safety Stock: 20 units\n   • Reorder Point: 40 units\n   • PO Status: No open PO ⚠️\n\n🟡 **SKU-11223** - Mounting Bracket\n   • On-Hand: 18 units\n   • Safety Stock: 15 units\n   • Reorder Point: 30 units\n   • PO Status: PO-4520 confirmed\n\n**Recommended Actions:**\n• Create PO for SKU-67890 immediately\n• Expedite PO-4518 if possible\n\nWould you like me to draft a purchase request?`
      } else if (content.toLowerCase().includes('put-away') || content.toLowerCase().includes('optimal')) {
        response = `🔄 **Put-Away Location Optimization**\n\n**Incoming Receipt:** RCV-2847\n**Items:** 5 SKUs, 480 total units\n\n**Suggested Locations:**\n\n1. **SKU-78451** (144 units) - High Velocity\n   • Suggested: A-12-4 (near pick face)\n   • Reason: Replenish primary location\n   • Distance to pick: 15 ft\n\n2. **SKU-65432** (96 units) - Medium Velocity\n   • Suggested: B-15-3\n   • Reason: Same product family nearby\n   • Distance to pick: 45 ft\n\n3. **SKU-98765** (120 units) - Bulk\n   • Suggested: C-22-1\n   • Reason: Pallet storage, FIFO\n   • Distance to pick: 120 ft\n\n**Optimization Score:** 94%\n**Estimated Put-Away Time:** 45 minutes\n\nWould you like me to create put-away tasks with these locations?`
      } else {
        response = `I help manage warehouse operations and optimize storage. I can assist with:\n\n• Real-time warehouse status\n• Item location lookup\n• Zone utilization analysis\n• Task management (pick, put-away, cycle count)\n• Stock level monitoring\n• Location optimization\n\nWhat would you like to do?`
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
        <h3 className="text-lg font-semibold text-gray-900">Warehouse Operations</h3>
        <span className="text-xs text-gray-500">Distribution Center - East</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Utilization"
          value="77.5%"
          subtitle="3,487 of 4,500 locations"
          icon={<Warehouse size={20} />}
          color="purple"
        />
        <StatCard
          title="Active SKUs"
          value="2,847"
          subtitle="Across all zones"
          trend="up"
          trendValue="+45 this week"
          icon={<Package size={20} />}
          color="blue"
        />
        <StatCard
          title="Inbound Today"
          value="2,450"
          subtitle="12 receipts"
          trend="up"
          trendValue="15% above avg"
          icon={<ArrowDownToLine size={20} />}
          color="green"
        />
        <StatCard
          title="Outbound Today"
          value="1,890"
          subtitle="18 orders"
          trend="neutral"
          trendValue="On target"
          icon={<ArrowUpFromLine size={20} />}
          color="orange"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Tasks</h4>
        <DataTable columns={columns} data={recentTasks} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Warehouse Operator Agent"
      welcomeMessage="I help you manage warehouse operations efficiently. Ask me about inventory locations, zone utilization, pick tasks, or let me help optimize your storage and workflows."
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
