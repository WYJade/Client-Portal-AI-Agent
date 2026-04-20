import { useState, useCallback } from 'react'
import { Package, Truck, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'
import SectionHeader from '../../components/agent/SectionHeader'

const deliveryData = [
  { day: 'Mon', delivered: 245, pending: 32 },
  { day: 'Tue', delivered: 268, pending: 28 },
  { day: 'Wed', delivered: 312, pending: 45 },
  { day: 'Thu', delivered: 289, pending: 38 },
  { day: 'Fri', delivered: 356, pending: 52 },
]

const recentShipments = [
  { id: 'SP-78421', carrier: 'UPS', destination: 'New York, NY', status: 'in-transit', eta: 'Apr 21' },
  { id: 'SP-78420', carrier: 'FedEx', destination: 'Los Angeles, CA', status: 'delivered', eta: 'Apr 20' },
  { id: 'SP-78419', carrier: 'USPS', destination: 'Chicago, IL', status: 'pending', eta: 'Apr 22' },
  { id: 'SP-78418', carrier: 'DHL', destination: 'Miami, FL', status: 'in-transit', eta: 'Apr 21' },
]

const quickActions = [
  { label: '📦 Track a package', action: 'Track package SP-78421' },
  { label: '🚚 Compare carrier rates', action: 'Compare carrier rates for 5lb package to NYC' },
  { label: '📊 Delivery performance report', action: 'Show delivery performance this week' },
  { label: '⏰ Delayed shipments', action: 'Show delayed shipments' },
  { label: '💰 Shipping cost analysis', action: 'Shipping cost analysis this month' },
  { label: '📋 Create shipping label', action: 'Create shipping label' },
]

const columns = [
  { key: 'id', label: 'Tracking #' },
  { key: 'carrier', label: 'Carrier' },
  { key: 'destination', label: 'Destination' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
        'delivered': 'success',
        'in-transit': 'info',
        'pending': 'warning',
        'delayed': 'error',
      }
      return <StatusBadge status={statusMap[value] || 'warning'} label={value.replace('-', ' ')} />
    }
  },
  { key: 'eta', label: 'ETA' },
]

export default function SmallParcelAgentPage() {
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

      if (content.toLowerCase().includes('track') || content.toLowerCase().includes('sp-')) {
        response = `📦 **Package Tracking: SP-78421**\n\n**Status:** In Transit 🚚\n**Carrier:** UPS Ground\n**Service:** 3-Day Select\n\n**Tracking History:**\n\n📍 **Apr 20, 2026 - 8:45 AM**\nOut for delivery\nNew York, NY\n\n📍 **Apr 20, 2026 - 4:30 AM**\nArrived at local facility\nNew York, NY\n\n📍 **Apr 19, 2026 - 11:20 PM**\nDeparted facility\nNewark, NJ\n\n📍 **Apr 18, 2026 - 2:15 PM**\nShipment picked up\nLos Angeles, CA\n\n**Estimated Delivery:** Apr 21, 2026 by 7:00 PM\n**Weight:** 4.2 lbs\n**Dimensions:** 12" x 8" x 6"\n\nWould you like me to set up delivery notifications?`
      } else if (content.toLowerCase().includes('compare') || content.toLowerCase().includes('rate')) {
        const rateData = [
          { carrier: 'USPS', rate: 12.45, days: 5 },
          { carrier: 'UPS', rate: 18.90, days: 3 },
          { carrier: 'FedEx', rate: 19.50, days: 3 },
          { carrier: 'DHL', rate: 22.80, days: 2 },
        ]
        response = `🚚 **Carrier Rate Comparison**\n\n**Package:** 5 lbs to New York, NY\n**Dimensions:** 12" x 8" x 6"\n\n**Available Options:**\n\n📦 **USPS Priority Mail**\n   • Rate: $12.45\n   • Delivery: 5 business days\n   • Best for: Budget shipping\n\n📦 **UPS Ground**\n   • Rate: $18.90\n   • Delivery: 3 business days\n   • Best for: Reliable tracking\n\n📦 **FedEx Ground**\n   • Rate: $19.50\n   • Delivery: 3 business days\n   • Best for: Business addresses\n\n📦 **DHL Express**\n   • Rate: $22.80\n   • Delivery: 2 business days\n   • Best for: Fastest delivery\n\n**Recommendation:** UPS Ground offers the best balance of speed and cost.\n\nWould you like me to create a label?`
        setChartData(rateData)
        setChartTitle('Carrier Rate Comparison')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Rate Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="carrier" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} formatter={(v) => `$${v}`} />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('delivery')) {
        response = `📊 **Delivery Performance - This Week**\n\n**Summary:**\n• Total Shipments: 1,470\n• Delivered: 1,275 (86.7%)\n• In Transit: 142 (9.7%)\n• Pending: 53 (3.6%)\n\n**On-Time Delivery Rate:** 94.2% ✅\n\n**By Carrier:**\n\n🟢 **UPS:** 96.1% on-time (485 shipments)\n🟢 **FedEx:** 95.3% on-time (412 shipments)\n🟡 **USPS:** 91.8% on-time (398 shipments)\n🟢 **DHL:** 94.7% on-time (175 shipments)\n\n**Average Transit Time:**\n• Ground: 3.2 days\n• Express: 1.8 days\n• Economy: 5.4 days\n\n**Issues This Week:**\n• 12 delayed due to weather\n• 5 address corrections needed\n• 3 returned to sender`
        setChartData(deliveryData)
        setChartTitle('Daily Delivery Performance')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Daily Deliveries</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="delivered" fill="#22c55e" name="Delivered" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('delayed')) {
        response = `⏰ **Delayed Shipments**\n\n**Currently Delayed:** 12 packages\n\n**High Priority:**\n\n🔴 **SP-78392** - 3 days delayed\n   • Customer: Acme Corp\n   • Carrier: USPS\n   • Reason: Weather delay (snowstorm)\n   • New ETA: Apr 22\n   • Action: Customer notified\n\n🔴 **SP-78385** - 2 days delayed\n   • Customer: TechStart Inc\n   • Carrier: UPS\n   • Reason: Address correction needed\n   • New ETA: Apr 21\n   • Action: Awaiting customer response\n\n🟡 **SP-78401** - 1 day delayed\n   • Customer: Global Trade\n   • Carrier: FedEx\n   • Reason: Customs clearance\n   • New ETA: Apr 21\n   • Action: In progress\n\n**Delay Reasons Summary:**\n• Weather: 5 packages\n• Address issues: 4 packages\n• Customs: 2 packages\n• Carrier delay: 1 package\n\nWould you like me to send delay notifications to affected customers?`
      } else if (content.toLowerCase().includes('cost') || content.toLowerCase().includes('analysis')) {
        const costData = [
          { week: 'W1', cost: 4250 },
          { week: 'W2', cost: 4680 },
          { week: 'W3', cost: 4120 },
          { week: 'W4', cost: 4890 },
        ]
        response = `💰 **Shipping Cost Analysis - April 2026**\n\n**Total Spend:** $17,940\n**Shipments:** 1,470\n**Avg Cost/Shipment:** $12.20\n\n**By Carrier:**\n\n📦 **UPS:** $6,850 (38.2%)\n   • 485 shipments\n   • Avg: $14.12/shipment\n\n📦 **FedEx:** $5,920 (33.0%)\n   • 412 shipments\n   • Avg: $14.37/shipment\n\n📦 **USPS:** $3,580 (20.0%)\n   • 398 shipments\n   • Avg: $8.99/shipment\n\n📦 **DHL:** $1,590 (8.8%)\n   • 175 shipments\n   • Avg: $9.09/shipment\n\n**Cost Optimization Tips:**\n✅ Use USPS for packages under 2 lbs\n✅ Consolidate shipments when possible\n✅ Negotiate volume discounts with UPS\n\n**Potential Savings:** $1,200/month`
        setChartData(costData)
        setChartTitle('Weekly Shipping Costs')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Weekly Costs</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} formatter={(v) => `$${v}`} />
                <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('label') || content.toLowerCase().includes('create')) {
        response = `📋 **Create Shipping Label**\n\nI can help you create a shipping label. Please provide:\n\n**Required Information:**\n1. **Recipient Name**\n2. **Street Address**\n3. **City, State, ZIP**\n4. **Package Weight** (lbs)\n5. **Package Dimensions** (L x W x H)\n\n**Optional:**\n• Signature required?\n• Insurance amount?\n• Delivery instructions?\n\n**Or select from recent recipients:**\n• Acme Corp - New York, NY\n• TechStart Inc - Los Angeles, CA\n• Global Trade - Chicago, IL\n\nWhich carrier would you prefer?\n• UPS\n• FedEx\n• USPS\n• DHL`
      } else {
        response = `I help manage small parcel shipments. I can assist with:\n\n• Package tracking\n• Carrier rate comparison\n• Creating shipping labels\n• Delivery performance reports\n• Cost analysis\n• Delayed shipment alerts\n\nWhat would you like to do?`
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
        <h3 className="text-lg font-semibold text-gray-100">Small Parcel Overview</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Today's Shipments"
          value="356"
          subtitle="52 pending pickup"
          icon={<Package size={20} />}
          color="purple"
        />
        <StatCard
          title="In Transit"
          value="142"
          subtitle="Across all carriers"
          icon={<Truck size={20} />}
          color="blue"
        />
        <StatCard
          title="On-Time Rate"
          value="94.2%"
          subtitle="This week"
          trend="up"
          trendValue="+1.8% vs last week"
          icon={<Clock size={20} />}
          color="green"
        />
        <StatCard
          title="Delivered Today"
          value="289"
          subtitle="98.6% success rate"
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>
      <div className="mt-4">
        <SectionHeader title="Recent Shipments" linkText="Shipment Tracking" linkPath="/home/logistics/tracking" />
        <DataTable columns={columns} data={recentShipments} maxRows={4} rowLinkPath="/home/inbound/schedule-summary" />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Small Parcel Agent"
      welcomeMessage="I help you manage small parcel shipments across all carriers. I can track packages, compare rates, create labels, and analyze shipping performance."
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
