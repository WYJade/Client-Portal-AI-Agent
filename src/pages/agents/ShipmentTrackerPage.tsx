import { useState, useCallback } from 'react'
import { Package, Navigation, Clock, CheckCircle } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const deliveryTrend = [
  { date: 'Apr 11', onTime: 94, delayed: 6 },
  { date: 'Apr 12', onTime: 96, delayed: 4 },
  { date: 'Apr 13', onTime: 92, delayed: 8 },
  { date: 'Apr 14', onTime: 97, delayed: 3 },
  { date: 'Apr 15', onTime: 95, delayed: 5 },
  { date: 'Apr 16', onTime: 98, delayed: 2 },
  { date: 'Apr 17', onTime: 96, delayed: 4 },
]

const activeShipments = [
  { id: 'SHP-78451', origin: 'Los Angeles', destination: 'Phoenix', carrier: 'FastFreight', status: 'in-transit', eta: 'Apr 18, 2PM' },
  { id: 'SHP-78450', origin: 'Chicago', destination: 'Detroit', carrier: 'RapidShip', status: 'out-for-delivery', eta: 'Today, 4PM' },
  { id: 'SHP-78449', origin: 'New York', destination: 'Boston', carrier: 'ExpressLine', status: 'delivered', eta: 'Delivered' },
  { id: 'SHP-78448', origin: 'Seattle', destination: 'Portland', carrier: 'PacificTrans', status: 'delayed', eta: 'Apr 18, 6PM' },
  { id: 'SHP-78447', origin: 'Miami', destination: 'Atlanta', carrier: 'SouthernExp', status: 'in-transit', eta: 'Apr 19, 10AM' },
]

const quickActions = [
  { label: '📦 Track shipment by ID', action: 'Track shipment SHP-78451' },
  { label: '🔍 Show all delayed shipments', action: 'Show all delayed shipments' },
  { label: '📊 Delivery performance this week', action: 'Delivery performance this week' },
  { label: '🚚 Shipments arriving today', action: 'Shipments arriving today' },
  { label: '⚠️ Any shipments at risk?', action: 'Any shipments at risk of delay?' },
  { label: '📍 Where is my shipment?', action: 'Where is shipment SHP-78450?' },
]

const columns = [
  { key: 'id', label: 'Shipment ID' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { key: 'carrier', label: 'Carrier' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
        'delivered': 'success',
        'out-for-delivery': 'info',
        'in-transit': 'warning',
        'delayed': 'error',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value.replace('-', ' ')} />
    }
  },
]

export default function ShipmentTrackerPage() {
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

      if (content.toLowerCase().includes('track') || content.toLowerCase().includes('shp-78451')) {
        response = `📦 **Shipment Tracking: SHP-78451**\n\n**Status:** In Transit 🚚\n**Carrier:** FastFreight\n\n**Route:**\n📍 Los Angeles, CA → Phoenix, AZ\n\n**Timeline:**\n✅ Apr 16, 8:00 AM - Picked up\n✅ Apr 16, 2:30 PM - Departed LA facility\n✅ Apr 17, 6:00 AM - In transit (Blythe, CA)\n🔄 Apr 17, 11:00 AM - Current: Quartzsite, AZ\n⏳ Apr 18, 2:00 PM - Expected delivery\n\n**Package Details:**\n• Weight: 45 lbs\n• Dimensions: 24" x 18" x 12"\n• Contents: Electronic Components\n\nWould you like me to set up delivery notifications?`
      } else if (content.toLowerCase().includes('delayed')) {
        response = `⚠️ **Delayed Shipments Report**\n\n**Currently Delayed (3):**\n\n1. **SHP-78448** - Seattle → Portland\n   • Carrier: PacificTrans\n   • Delay: 4 hours\n   • Reason: Weather conditions\n   • New ETA: Apr 18, 6:00 PM\n\n2. **SHP-78442** - Dallas → Houston\n   • Carrier: TexasFreight\n   • Delay: 1 day\n   • Reason: Customs clearance\n   • New ETA: Apr 19, 10:00 AM\n\n3. **SHP-78439** - Denver → Salt Lake\n   • Carrier: MountainExp\n   • Delay: 6 hours\n   • Reason: Vehicle breakdown\n   • New ETA: Apr 18, 8:00 PM\n\n**Actions Taken:**\n• Customer notifications sent\n• Alternative routing evaluated\n\nWould you like me to escalate any of these?`
      } else if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('week')) {
        response = `📊 **Weekly Delivery Performance**\n\n**Apr 11 - Apr 17, 2026**\n\n**Summary:**\n• Total Shipments: 847\n• Delivered On-Time: 812 (95.9%)\n• Delayed: 35 (4.1%)\n\n**By Carrier Performance:**\n🥇 ExpressLine - 98.2% on-time\n🥈 FastFreight - 96.5% on-time\n🥉 RapidShip - 95.1% on-time\n⚠️ PacificTrans - 91.2% on-time\n\n**Trend:** Improving ↗️\nOn-time rate up 1.2% vs last week\n\nI've opened the performance trend chart on the right.`
        setChartData(deliveryTrend)
        setChartTitle('On-Time Delivery Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">On-Time Delivery Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={deliveryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="onTime" stroke="#22c55e" fill="#dcfce7" name="On-Time %" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Green area shows on-time delivery percentage</div>
          </div>
        )
      } else if (content.toLowerCase().includes('today') || content.toLowerCase().includes('arriving')) {
        response = `🚚 **Shipments Arriving Today**\n\n**Expected Deliveries: 24**\n\n**By Time Window:**\n\n🌅 **Morning (8AM-12PM):** 8 shipments\n• 6 delivered ✅\n• 2 in progress 🔄\n\n☀️ **Afternoon (12PM-5PM):** 12 shipments\n• SHP-78450 - Detroit (4:00 PM)\n• SHP-78446 - Nashville (2:30 PM)\n• SHP-78444 - Memphis (3:15 PM)\n• +9 more on schedule\n\n🌙 **Evening (5PM-8PM):** 4 shipments\n• All on schedule\n\n**Status Summary:**\n✅ Delivered: 6\n🔄 Out for Delivery: 8\n🚚 In Transit: 10\n\nWould you like details on any specific shipment?`
      } else if (content.toLowerCase().includes('risk') || content.toLowerCase().includes('at risk')) {
        response = `⚠️ **Shipments At Risk Analysis**\n\n**High Risk (2):**\n\n🔴 **SHP-78455** - International\n   • Route: Shanghai → Los Angeles\n   • Issue: Customs documentation incomplete\n   • Risk: 2-3 day delay possible\n   • Action: Contact customs broker\n\n🔴 **SHP-78452** - Domestic\n   • Route: Minneapolis → Chicago\n   • Issue: Severe weather forecast\n   • Risk: 12-24 hour delay\n   • Action: Monitor weather updates\n\n**Medium Risk (4):**\n🟡 SHP-78448 - Already delayed (weather)\n🟡 SHP-78443 - Carrier capacity issue\n🟡 SHP-78441 - Peak season congestion\n🟡 SHP-78438 - Driver hours limit approaching\n\n**Recommendations:**\n• Proactively notify customers for high-risk shipments\n• Prepare alternative carriers for medium-risk items`
      } else if (content.toLowerCase().includes('where') || content.toLowerCase().includes('shp-78450')) {
        response = `📍 **Live Location: SHP-78450**\n\n**Status:** Out for Delivery 🚚\n\n**Current Location:**\nDetroit Metro Area\n42.3314° N, 83.0458° W\n\n**Last Update:** 5 minutes ago\n\n**Delivery Progress:**\n✅ Departed Chicago hub - 6:00 AM\n✅ Crossed state line - 9:30 AM\n✅ Arrived Detroit facility - 11:45 AM\n✅ Out for delivery - 1:30 PM\n🔄 Currently: 3 stops away\n⏳ Expected: 4:00 PM\n\n**Driver:** Mike Johnson\n**Vehicle:** Truck #DT-445\n\n**Recipient:** TechStart Industries\n**Address:** 1250 Industrial Blvd, Detroit, MI\n\nWould you like me to send a delivery notification to the recipient?`
      } else {
        response = `I help you track shipments and monitor delivery performance. I can assist with:\n\n• Real-time shipment tracking\n• Delay alerts and notifications\n• Carrier performance analysis\n• Delivery predictions\n• Risk assessment\n\nProvide a shipment ID or ask about delivery status to get started!`
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
        <h3 className="text-lg font-semibold text-gray-900">Shipment Tracking Center</h3>
        <span className="text-xs text-gray-500">Real-time updates</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Shipments"
          value="142"
          subtitle="Across all carriers"
          icon={<Package size={20} />}
          color="purple"
        />
        <StatCard
          title="In Transit"
          value="98"
          subtitle="On the way"
          trend="neutral"
          trendValue="Normal volume"
          icon={<Navigation size={20} />}
          color="blue"
        />
        <StatCard
          title="On-Time Rate"
          value="95.9%"
          subtitle="This week"
          trend="up"
          trendValue="+1.2% vs last week"
          icon={<Clock size={20} />}
          color="green"
        />
        <StatCard
          title="Delivered Today"
          value="24"
          subtitle="6 more expected"
          trend="up"
          trendValue="Ahead of schedule"
          icon={<CheckCircle size={20} />}
          color="orange"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Shipments</h4>
        <DataTable columns={columns} data={activeShipments} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Shipment Tracker"
      welcomeMessage="I provide real-time shipment tracking and delivery status updates. Ask me to track a specific shipment, check for delays, or analyze delivery performance across your supply chain."
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
