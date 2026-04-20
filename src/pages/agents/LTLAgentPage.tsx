import { useState, useCallback } from 'react'
import { Truck, Package, Clock, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'
import SectionHeader from '../../components/agent/SectionHeader'

const freightData = [
  { week: 'W1', shipments: 45, onTime: 42 },
  { week: 'W2', shipments: 52, onTime: 48 },
  { week: 'W3', shipments: 48, onTime: 46 },
  { week: 'W4', shipments: 58, onTime: 55 },
]

const activeShipments = [
  { id: 'LTL-4521', origin: 'Los Angeles, CA', destination: 'Dallas, TX', status: 'in-transit', eta: 'Apr 22', weight: '2,450 lbs' },
  { id: 'LTL-4520', origin: 'Chicago, IL', destination: 'Atlanta, GA', status: 'delivered', eta: 'Apr 20', weight: '1,800 lbs' },
  { id: 'LTL-4519', origin: 'Seattle, WA', destination: 'Denver, CO', status: 'pickup-scheduled', eta: 'Apr 23', weight: '3,200 lbs' },
  { id: 'LTL-4518', origin: 'Miami, FL', destination: 'New York, NY', status: 'in-transit', eta: 'Apr 21', weight: '1,650 lbs' },
]

const quickActions = [
  { label: '🚛 Get LTL quote', action: 'Get LTL quote from LA to NYC' },
  { label: '📦 Track freight shipment', action: 'Track shipment LTL-4521' },
  { label: '📊 Freight performance report', action: 'Show freight performance this month' },
  { label: '📅 Schedule pickup', action: 'Schedule LTL pickup' },
  { label: '💰 Compare carrier rates', action: 'Compare LTL carrier rates' },
  { label: '⚠️ Delayed freight alerts', action: 'Show delayed freight shipments' },
]

const columns = [
  { key: 'id', label: 'PRO #' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
        'delivered': 'success',
        'in-transit': 'info',
        'pickup-scheduled': 'warning',
        'delayed': 'error',
      }
      const labelMap: Record<string, string> = {
        'pickup-scheduled': 'Pickup Scheduled',
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'delayed': 'Delayed',
      }
      return <StatusBadge status={statusMap[value] || 'warning'} label={labelMap[value] || value} />
    }
  },
  { key: 'weight', label: 'Weight' },
]

export default function LTLAgentPage() {
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

      if (content.toLowerCase().includes('quote') || content.toLowerCase().includes('rate')) {
        const rateData = [
          { carrier: 'XPO', rate: 485, transit: 4 },
          { carrier: 'Estes', rate: 520, transit: 3 },
          { carrier: 'SAIA', rate: 498, transit: 4 },
          { carrier: 'Old Dominion', rate: 545, transit: 3 },
        ]
        response = `🚛 **LTL Quote: Los Angeles, CA → New York, NY**\n\n**Shipment Details:**\n• Weight: 1,500 lbs\n• Class: 85\n• Pallets: 2\n• Dimensions: 48" x 40" x 48" each\n\n**Available Rates:**\n\n📦 **XPO Logistics**\n   • Rate: $485.00\n   • Transit: 4-5 business days\n   • Service: Standard LTL\n   • ⭐ Best Value\n\n📦 **Estes Express**\n   • Rate: $520.00\n   • Transit: 3-4 business days\n   • Service: Guaranteed\n\n📦 **SAIA**\n   • Rate: $498.00\n   • Transit: 4-5 business days\n   • Service: Standard LTL\n\n📦 **Old Dominion**\n   • Rate: $545.00\n   • Transit: 3-4 business days\n   • Service: Premium\n   • ⭐ Fastest\n\n**Additional Services:**\n• Liftgate: +$75\n• Inside Delivery: +$95\n• Appointment: +$50\n\nWould you like to book one of these options?`
        setChartData(rateData)
        setChartTitle('LTL Carrier Rates')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Rate Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="carrier" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} formatter={(v) => `$${v}`} />
                <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('track') || content.toLowerCase().includes('ltl-')) {
        response = `📦 **Freight Tracking: LTL-4521**\n\n**Status:** In Transit 🚛\n**Carrier:** XPO Logistics\n**PRO #:** 4521-8847-2\n\n**Shipment Details:**\n• Weight: 2,450 lbs\n• Class: 85\n• Pallets: 4\n• PO #: PO-2847\n\n**Route Progress:**\n\n✅ **Apr 18 - 2:30 PM**\nPickup completed\nLos Angeles, CA\n\n✅ **Apr 19 - 6:15 AM**\nDeparted terminal\nPhoenix, AZ\n\n✅ **Apr 19 - 11:45 PM**\nArrived at terminal\nAlbuquerque, NM\n\n🚛 **Apr 20 - 5:30 AM**\nIn transit to next terminal\nEn route to Oklahoma City, OK\n\n⏳ **Estimated Delivery:**\nApr 22, 2026\nDallas, TX\n\n**Delivery Requirements:**\n• Liftgate required\n• Appointment scheduled: 10:00 AM - 2:00 PM\n\nWould you like delivery notifications?`
      } else if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('report')) {
        response = `📊 **LTL Freight Performance - April 2026**\n\n**Summary:**\n• Total Shipments: 203\n• Delivered: 185\n• In Transit: 18\n• On-Time Rate: 94.6% ✅\n\n**By Carrier:**\n\n🟢 **Old Dominion:** 97.2% on-time\n   • 54 shipments\n   • Avg transit: 3.2 days\n\n🟢 **XPO Logistics:** 95.1% on-time\n   • 62 shipments\n   • Avg transit: 4.1 days\n\n🟢 **Estes Express:** 93.8% on-time\n   • 48 shipments\n   • Avg transit: 3.8 days\n\n🟡 **SAIA:** 91.4% on-time\n   • 39 shipments\n   • Avg transit: 4.5 days\n\n**Cost Metrics:**\n• Total Spend: $98,450\n• Avg Cost/Shipment: $485\n• Cost per CWT: $18.50\n\n**Claims:**\n• Filed: 3\n• Resolved: 2\n• Pending: 1 ($1,250)`
        setChartData(freightData)
        setChartTitle('Weekly Freight Performance')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Weekly Performance</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={freightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="shipments" fill="#8b5cf6" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" fill="#22c55e" name="On-Time" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('schedule') || content.toLowerCase().includes('pickup')) {
        response = `📅 **Schedule LTL Pickup**\n\nI can help you schedule a freight pickup. Please provide:\n\n**Required Information:**\n\n1. **Pickup Location**\n   • Company name\n   • Address\n   • Contact name & phone\n\n2. **Shipment Details**\n   • Number of pallets/pieces\n   • Total weight\n   • Freight class\n   • Dimensions\n\n3. **Pickup Date & Time**\n   • Preferred date\n   • Ready time\n   • Close time\n\n4. **Destination**\n   • Delivery address\n   • Contact information\n\n**Special Requirements?**\n• Liftgate needed?\n• Inside pickup?\n• Hazmat?\n\n**Or select from saved locations:**\n• Warehouse A - Los Angeles, CA\n• Distribution Center - Chicago, IL\n• Factory - Seattle, WA\n\nWhich carrier would you prefer?`
      } else if (content.toLowerCase().includes('delayed') || content.toLowerCase().includes('alert')) {
        response = `⚠️ **Delayed Freight Shipments**\n\n**Currently Delayed:** 4 shipments\n\n**Critical (>2 days):**\n\n🔴 **LTL-4498** - 3 days delayed\n   • Carrier: SAIA\n   • Route: Seattle → Denver\n   • Reason: Weather (road closure)\n   • Original ETA: Apr 17\n   • New ETA: Apr 22\n   • Customer: Acme Corp\n   • Action: Customer notified, claim filed\n\n🔴 **LTL-4502** - 2 days delayed\n   • Carrier: Estes\n   • Route: Miami → Boston\n   • Reason: Mechanical issue\n   • Original ETA: Apr 18\n   • New ETA: Apr 21\n   • Customer: TechStart Inc\n   • Action: Rerouted to backup carrier\n\n**Minor Delays (1 day):**\n\n🟡 **LTL-4515** - Chicago → Phoenix\n   • Reason: Terminal congestion\n   • New ETA: Apr 21\n\n🟡 **LTL-4517** - Atlanta → Dallas\n   • Reason: Appointment rescheduled\n   • New ETA: Apr 22\n\nWould you like me to send status updates to affected customers?`
      } else if (content.toLowerCase().includes('compare') || content.toLowerCase().includes('carrier')) {
        const compareData = [
          { carrier: 'Old Dominion', onTime: 97.2, avgCost: 545 },
          { carrier: 'XPO', onTime: 95.1, avgCost: 485 },
          { carrier: 'Estes', onTime: 93.8, avgCost: 520 },
          { carrier: 'SAIA', onTime: 91.4, avgCost: 498 },
        ]
        response = `🚛 **LTL Carrier Comparison**\n\n**Based on your shipping history:**\n\n**Old Dominion Freight**\n⭐ Premium Service\n• On-Time: 97.2%\n• Avg Cost: $545/shipment\n• Avg Transit: 3.2 days\n• Claims Rate: 0.2%\n• Best for: Time-sensitive freight\n\n**XPO Logistics**\n⭐ Best Value\n• On-Time: 95.1%\n• Avg Cost: $485/shipment\n• Avg Transit: 4.1 days\n• Claims Rate: 0.4%\n• Best for: Cost-conscious shipping\n\n**Estes Express**\n• On-Time: 93.8%\n• Avg Cost: $520/shipment\n• Avg Transit: 3.8 days\n• Claims Rate: 0.3%\n• Best for: Regional shipments\n\n**SAIA**\n• On-Time: 91.4%\n• Avg Cost: $498/shipment\n• Avg Transit: 4.5 days\n• Claims Rate: 0.5%\n• Best for: Southeast routes\n\n**Recommendation:** Use Old Dominion for urgent shipments, XPO for standard freight.`
        setChartData(compareData)
        setChartTitle('Carrier Performance')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">On-Time Performance</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="carrier" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} formatter={(v) => `${v}%`} />
                <Bar dataKey="onTime" fill="#22c55e" name="On-Time %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else {
        response = `I help manage LTL (Less-Than-Truckload) freight shipments. I can assist with:\n\n• Getting freight quotes\n• Tracking shipments\n• Scheduling pickups\n• Carrier rate comparison\n• Performance reporting\n• Delay alerts and claims\n\nWhat would you like to do?`
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
        <h3 className="text-lg font-semibold text-gray-100">LTL Freight Overview</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Shipments"
          value="18"
          subtitle="Across 4 carriers"
          icon={<Truck size={20} />}
          color="purple"
        />
        <StatCard
          title="This Month"
          value="203"
          subtitle="Total shipments"
          trend="up"
          trendValue="+12% vs last month"
          icon={<Package size={20} />}
          color="blue"
        />
        <StatCard
          title="On-Time Rate"
          value="94.6%"
          subtitle="April 2026"
          trend="up"
          trendValue="+2.1% improvement"
          icon={<Clock size={20} />}
          color="green"
        />
        <StatCard
          title="Avg Cost"
          value="$485"
          subtitle="Per shipment"
          trend="down"
          trendValue="-5% vs Q1"
          icon={<DollarSign size={20} />}
          color="green"
        />
      </div>
      <div className="mt-4">
        <SectionHeader title="Active Shipments" linkText="Freight Management" linkPath="/home/logistics/freight" />
        <DataTable columns={columns} data={activeShipments} maxRows={4} rowLinkPath="/home/inbound/schedule-summary" />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="LTL Agent"
      welcomeMessage="I help you manage LTL freight shipments. I can get quotes, track shipments, schedule pickups, and analyze carrier performance for your less-than-truckload freight."
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
