import { useState, useCallback } from 'react'
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'
import SectionHeader from '../../components/agent/SectionHeader'

const quoteData = [
  { month: 'Jan', quotes: 45, converted: 32 },
  { month: 'Feb', quotes: 52, converted: 38 },
  { month: 'Mar', quotes: 48, converted: 35 },
  { month: 'Apr', quotes: 61, converted: 44 },
]

const recentQuotes = [
  { id: 'QT-2847', customer: 'Acme Corp', amount: '$24,500', status: 'pending', expires: 'Apr 25' },
  { id: 'QT-2846', customer: 'TechStart Inc', amount: '$18,200', status: 'sent', expires: 'Apr 22' },
  { id: 'QT-2845', customer: 'Global Trade', amount: '$45,800', status: 'accepted', expires: 'Apr 20' },
  { id: 'QT-2844', customer: 'FastShip LLC', amount: '$12,400', status: 'expired', expires: 'Apr 15' },
]

const quickActions = [
  { label: '📝 Create new quote', action: 'Create new quote' },
  { label: '📊 Quote conversion analysis', action: 'Show quote conversion analysis' },
  { label: '⏰ Expiring quotes this week', action: 'Show quotes expiring this week' },
  { label: '💰 High-value pending quotes', action: 'Show high-value pending quotes' },
  { label: '📈 Quote trends this month', action: 'Quote trends this month' },
  { label: '🔍 Find quote by customer', action: 'Find quote for Acme Corp' },
]

const columns = [
  { key: 'id', label: 'Quote ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
        'accepted': 'success',
        'pending': 'warning',
        'expired': 'error',
        'sent': 'info',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'expires', label: 'Expires' },
]

export default function QuoteAgentPage() {
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

      if (content.toLowerCase().includes('create') || content.toLowerCase().includes('new quote')) {
        response = `📝 **Create New Quote**\n\nI can help you create a new quote. Please provide:\n\n1. **Customer Name**\n2. **Products/Services** (with quantities)\n3. **Validity Period** (default: 30 days)\n\nOr select from recent customers:\n• Acme Corp\n• TechStart Inc\n• Global Trade\n\nWould you like me to pull pricing from the latest catalog?`
      } else if (content.toLowerCase().includes('conversion') || content.toLowerCase().includes('analysis')) {
        response = `📊 **Quote Conversion Analysis**\n\n**Overall Conversion Rate:** 72.1%\n\n**By Month:**\n• January: 71.1% (32/45)\n• February: 73.1% (38/52)\n• March: 72.9% (35/48)\n• April: 72.1% (44/61)\n\n**By Value Tier:**\n• Under $10K: 85% conversion\n• $10K-$50K: 68% conversion\n• Over $50K: 52% conversion\n\n**Top Reasons for Lost Quotes:**\n1. Price too high (35%)\n2. Competitor won (28%)\n3. Project cancelled (22%)\n4. No response (15%)`
        setChartData(quoteData)
        setChartTitle('Quote Conversion Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-100">Quote Conversion</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quoteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="quotes" fill="#8b5cf6" name="Total Quotes" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" fill="#22c55e" name="Converted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('expiring')) {
        response = `⏰ **Quotes Expiring This Week**\n\n**5 quotes expiring soon:**\n\n🔴 **QT-2847** - Acme Corp\n   • Amount: $24,500\n   • Expires: Apr 25 (3 days)\n   • Status: Pending review\n   • Action: Follow up recommended\n\n🟡 **QT-2846** - TechStart Inc\n   • Amount: $18,200\n   • Expires: Apr 22 (Today!)\n   • Status: Sent, awaiting response\n   • Action: Urgent follow-up needed\n\n🟡 **QT-2843** - Metro Systems\n   • Amount: $32,100\n   • Expires: Apr 24 (2 days)\n   • Status: Under negotiation\n\nWould you like me to draft follow-up emails?`
      } else {
        response = `I help manage quotes and pricing. I can assist with:\n\n• Creating new quotes\n• Quote conversion analysis\n• Tracking expiring quotes\n• Price optimization\n• Customer quote history\n\nWhat would you like to do?`
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
        <h3 className="text-lg font-semibold text-gray-100">Quote Management</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Quotes"
          value="28"
          subtitle="$485K total value"
          icon={<FileText size={20} />}
          color="purple"
        />
        <StatCard
          title="Pending Review"
          value="12"
          subtitle="Awaiting approval"
          trend="down"
          trendValue="3 less than yesterday"
          icon={<Clock size={20} />}
          color="orange"
        />
        <StatCard
          title="Conversion Rate"
          value="72.1%"
          subtitle="This month"
          trend="up"
          trendValue="+2.3% vs last month"
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="Avg Quote Value"
          value="$17.3K"
          subtitle="Per quote"
          trend="up"
          trendValue="+8% increase"
          icon={<DollarSign size={20} />}
          color="blue"
        />
      </div>
      <div className="mt-4">
        <SectionHeader title="Recent Quotes" linkText="Sales Orders" linkPath="/home/sales/wholesale" />
        <DataTable columns={columns} data={recentQuotes} maxRows={4} rowLinkPath="/home/sales/wholesale" />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Quote Agent"
      welcomeMessage="I help you create, manage, and track customer quotes. I can generate quotes, analyze conversion rates, and help you follow up on pending proposals."
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
