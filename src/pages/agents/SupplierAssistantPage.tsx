import { useState, useCallback } from 'react'
import { Building2, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'
import SectionHeader from '../../components/agent/SectionHeader'

const supplierPerformance = [
  { name: 'Supplier A', onTime: 95, quality: 98 },
  { name: 'Supplier B', onTime: 88, quality: 94 },
  { name: 'Supplier C', onTime: 92, quality: 96 },
  { name: 'Supplier D', onTime: 78, quality: 91 },
]

const pendingPOs = [
  { id: 'PO-4521', supplier: 'TechParts Inc', amount: '$45,200', items: 12, status: 'pending', dueDate: 'Apr 20' },
  { id: 'PO-4520', supplier: 'Global Components', amount: '$28,400', items: 8, status: 'confirmed', dueDate: 'Apr 22' },
  { id: 'PO-4519', supplier: 'Prime Materials', amount: '$62,800', items: 24, status: 'shipped', dueDate: 'Apr 18' },
  { id: 'PO-4518', supplier: 'FastSupply Co', amount: '$18,600', items: 6, status: 'delivered', dueDate: 'Apr 15' },
]

const quickActions = [
  { label: '📋 Show pending purchase orders', action: 'Show pending purchase orders' },
  { label: '⚠️ Any supplier delivery issues?', action: 'Any supplier delivery issues?' },
  { label: '📊 Compare supplier performance', action: 'Compare supplier performance' },
  { label: '📝 Draft a follow-up email to supplier', action: 'Draft a follow-up email to supplier' },
  { label: '🔍 Check contract renewal dates', action: 'Check contract renewal dates' },
  { label: '💰 Analyze supplier pricing trends', action: 'Analyze supplier pricing trends' },
]

const columns = [
  { key: 'id', label: 'PO Number' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'dueDate', label: 'Due Date' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'info' | 'pending'> = {
        'delivered': 'success',
        'shipped': 'info',
        'confirmed': 'warning',
        'pending': 'pending',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
]

export default function SupplierAssistantPage() {
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

      if (content.toLowerCase().includes('pending') || content.toLowerCase().includes('purchase order')) {
        response = `📋 **Pending Purchase Orders Summary**\n\n**Total Pending:** 8 orders worth $245,600\n\n**By Status:**\n• Awaiting Confirmation: 3 ($89,400)\n• Confirmed, Not Shipped: 2 ($73,600)\n• In Transit: 3 ($82,600)\n\n**Urgent Attention:**\n⚠️ PO-4521 from TechParts Inc - Due in 3 days, still pending confirmation\n⚠️ PO-4517 from Metro Supply - Delayed by 2 days\n\nWould you like me to draft follow-up communications?`
      } else if (content.toLowerCase().includes('issue') || content.toLowerCase().includes('delivery')) {
        response = `⚠️ **Supplier Delivery Issues**\n\n**Active Issues (3):**\n\n1. **Metro Supply** - PO-4517\n   └ 2 days delayed, ETA updated to Apr 19\n   └ Reason: Production backlog\n\n2. **FastSupply Co** - PO-4515\n   └ Partial delivery (80% received)\n   └ Remaining items expected Apr 21\n\n3. **Global Components** - Quality Alert\n   └ 5% rejection rate on last shipment\n   └ RMA in progress\n\n**Recommended Actions:**\n• Contact Metro Supply for expedited shipping\n• Schedule quality review with Global Components`
      } else if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('compare')) {
        response = `📊 **Supplier Performance Comparison**\n\n**Top Performers:**\n🥇 TechParts Inc - 96.5% overall score\n🥈 Prime Materials - 94.2% overall score\n🥉 Global Components - 91.8% overall score\n\n**Metrics Breakdown:**\n• On-Time Delivery: TechParts leads (98%)\n• Quality Score: Prime Materials leads (99%)\n• Price Competitiveness: FastSupply leads\n• Communication: TechParts leads\n\nI've opened a detailed comparison chart on the right.`
        setChartData(supplierPerformance)
        setChartTitle('Supplier Performance Metrics')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Supplier Performance Metrics</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={supplierPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="onTime" fill="#8b5cf6" name="On-Time %" radius={[0, 4, 4, 0]} />
                <Bar dataKey="quality" fill="#22c55e" name="Quality %" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Purple: On-Time Delivery | Green: Quality Score</div>
          </div>
        )
      } else if (content.toLowerCase().includes('email') || content.toLowerCase().includes('draft')) {
        response = `📝 **Draft Follow-up Email**\n\nHere's a professional follow-up template:\n\n---\n**Subject:** Follow-up: PO-4521 Confirmation Required\n\nDear TechParts Inc Team,\n\nI hope this message finds you well. I'm writing to follow up on Purchase Order #4521 submitted on April 10, 2026.\n\nWe haven't received confirmation yet, and the expected delivery date is approaching (April 20). Could you please:\n\n1. Confirm the order status\n2. Provide an updated delivery timeline\n3. Flag any potential issues\n\nYour prompt response would be greatly appreciated.\n\nBest regards,\n[Your Name]\n\n---\n\nWould you like me to customize this for a specific supplier?`
      } else if (content.toLowerCase().includes('contract') || content.toLowerCase().includes('renewal')) {
        response = `📅 **Contract Renewal Schedule**\n\n**Upcoming Renewals (Next 90 Days):**\n\n🔴 **TechParts Inc** - Expires May 15\n   └ Current Value: $1.2M/year\n   └ Status: Negotiation in progress\n   └ Action: Schedule review meeting\n\n🟡 **Global Components** - Expires June 30\n   └ Current Value: $850K/year\n   └ Status: Auto-renewal eligible\n   └ Action: Review terms by June 1\n\n🟢 **Prime Materials** - Expires July 20\n   └ Current Value: $620K/year\n   └ Status: No action needed yet\n\nWould you like me to prepare a renewal analysis for any of these?`
      } else {
        response = `I can help you manage supplier relationships and procurement activities. Here's what I can assist with:\n\n• Track purchase orders and deliveries\n• Monitor supplier performance metrics\n• Draft professional communications\n• Manage contract renewals\n• Analyze pricing and cost trends\n\nWhat would you like to explore?`
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
        <h3 className="text-lg font-semibold text-gray-100">Supplier Collaboration Hub</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Suppliers"
          value="24"
          subtitle="8 preferred vendors"
          icon={<Building2 size={20} />}
          color="purple"
        />
        <StatCard
          title="Open POs"
          value="18"
          subtitle="$425K total value"
          trend="neutral"
          trendValue="3 due this week"
          icon={<FileText size={20} />}
          color="blue"
        />
        <StatCard
          title="Issues"
          value="3"
          subtitle="Requiring attention"
          trend="down"
          trendValue="2 less than last week"
          icon={<AlertTriangle size={20} />}
          color="orange"
        />
        <StatCard
          title="On-Time Rate"
          value="92%"
          subtitle="Last 30 days"
          trend="up"
          trendValue="+4% improvement"
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
      </div>
      <div className="mt-4">
        <SectionHeader title="Recent Purchase Orders" linkText="Purchase Orders" linkPath="/home/purchase/order" />
        <DataTable columns={columns} data={pendingPOs} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Supplier Assistant"
      welcomeMessage="I help you manage supplier relationships, track purchase orders, and ensure smooth procurement operations. Ask me about order status, supplier performance, or let me help draft communications."
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
