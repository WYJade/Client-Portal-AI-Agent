import { useState, useCallback } from 'react'
import { Users, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const ticketTrendData = [
  { day: 'Mon', tickets: 45, resolved: 42 },
  { day: 'Tue', tickets: 52, resolved: 48 },
  { day: 'Wed', tickets: 38, resolved: 35 },
  { day: 'Thu', tickets: 65, resolved: 58 },
  { day: 'Fri', tickets: 48, resolved: 45 },
  { day: 'Sat', tickets: 25, resolved: 24 },
  { day: 'Sun', tickets: 18, resolved: 18 },
]

const satisfactionData = [
  { week: 'W1', score: 4.2 },
  { week: 'W2', score: 4.4 },
  { week: 'W3', score: 4.3 },
  { week: 'W4', score: 4.6 },
]

const recentTickets = [
  { id: 'TKT-2847', customer: 'Acme Corp', subject: 'Order delivery delay', status: 'pending', priority: 'High', time: '10 min ago' },
  { id: 'TKT-2846', customer: 'TechStart Inc', subject: 'Invoice discrepancy', status: 'in-progress', priority: 'Medium', time: '25 min ago' },
  { id: 'TKT-2845', customer: 'Global Trade', subject: 'Product return request', status: 'resolved', priority: 'Low', time: '1 hour ago' },
  { id: 'TKT-2844', customer: 'FastShip LLC', subject: 'Account access issue', status: 'resolved', priority: 'High', time: '2 hours ago' },
  { id: 'TKT-2843', customer: 'Prime Logistics', subject: 'Bulk order inquiry', status: 'pending', priority: 'Medium', time: '3 hours ago' },
]

const quickActions = [
  { label: '📊 Show ticket analytics for this week', action: 'Show ticket analytics for this week' },
  { label: '🔍 Find unresolved high-priority tickets', action: 'Find unresolved high-priority tickets' },
  { label: '👥 List top customers by ticket volume', action: 'List top customers by ticket volume' },
  { label: '⏱️ What is the average resolution time?', action: 'What is the average resolution time?' },
  { label: '📈 Compare this week vs last week performance', action: 'Compare this week vs last week performance' },
  { label: '🎯 Show customer satisfaction trends', action: 'Show customer satisfaction trends' },
]

const columns = [
  { key: 'id', label: 'Ticket ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'subject', label: 'Subject' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'pending'> = {
        'resolved': 'success',
        'in-progress': 'warning',
        'pending': 'pending',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'time', label: 'Time', align: 'right' as const },
]

export default function CustomerAgentPage() {
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

      if (content.toLowerCase().includes('analytics') || content.toLowerCase().includes('trend')) {
        response = `Here's your ticket analytics for this week:\n\n📊 **Weekly Summary**\n• Total Tickets: 291\n• Resolved: 270 (92.8% resolution rate)\n• Average Response Time: 12 minutes\n• Peak Day: Thursday (65 tickets)\n\nI've opened a detailed chart view on the right panel. The trend shows a healthy resolution rate with Thursday being your busiest day.`
        setChartData(ticketTrendData)
        setChartTitle('Weekly Ticket Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Weekly Ticket Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="tickets" fill="#8b5cf6" name="Total Tickets" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2">
              Purple: Total Tickets | Green: Resolved
            </div>
          </div>
        )
      } else if (content.toLowerCase().includes('high-priority') || content.toLowerCase().includes('unresolved')) {
        response = `Found 3 unresolved high-priority tickets:\n\n🔴 **TKT-2847** - Acme Corp\nOrder delivery delay (10 min ago)\n\n🔴 **TKT-2841** - Metro Systems\nPayment processing failed (4 hours ago)\n\n🔴 **TKT-2839** - DataFlow Inc\nUrgent shipment tracking issue (6 hours ago)\n\nWould you like me to help draft responses for any of these?`
      } else if (content.toLowerCase().includes('resolution time')) {
        response = `📊 **Resolution Time Analysis**\n\n• Average Resolution Time: 2.4 hours\n• Median Resolution Time: 1.8 hours\n• Fastest Resolution: 8 minutes\n• Slowest Resolution: 18 hours\n\n**By Priority:**\n• High Priority: 1.2 hours avg\n• Medium Priority: 2.8 hours avg\n• Low Priority: 4.1 hours avg\n\nYour team is performing 15% better than last month! 🎉`
      } else if (content.toLowerCase().includes('satisfaction')) {
        response = `Here's the customer satisfaction trend:\n\n⭐ **Current CSAT Score: 4.6/5.0**\n\n**Weekly Breakdown:**\n• Very Satisfied: 68%\n• Satisfied: 24%\n• Neutral: 5%\n• Dissatisfied: 3%\n\nTop feedback themes:\n✅ Quick response times\n✅ Helpful solutions\n⚠️ Some requests for 24/7 support`
        setChartData(satisfactionData)
        setChartTitle('Customer Satisfaction Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Satisfaction Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[3.5, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      } else {
        response = `I understand you're asking about "${content}". Let me help you with that.\n\nBased on your current customer service data, I can provide insights on:\n• Ticket trends and analytics\n• Customer satisfaction metrics\n• Response time analysis\n• Priority-based filtering\n\nWhat specific aspect would you like to explore?`
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
        <h3 className="text-lg font-semibold text-gray-900">Customer Service Overview</h3>
        <span className="text-xs text-gray-500">Last updated: Just now</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value="24"
          subtitle="8 high priority"
          trend="down"
          trendValue="12% from yesterday"
          icon={<MessageSquare size={20} />}
          color="purple"
        />
        <StatCard
          title="Avg Response Time"
          value="12 min"
          subtitle="Target: 15 min"
          trend="up"
          trendValue="Improved by 3 min"
          icon={<Clock size={20} />}
          color="green"
        />
        <StatCard
          title="Resolution Rate"
          value="94.2%"
          subtitle="This week"
          trend="up"
          trendValue="+2.1% vs last week"
          icon={<CheckCircle size={20} />}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value="156"
          subtitle="With open cases"
          trend="neutral"
          trendValue="Stable"
          icon={<Users size={20} />}
          color="orange"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Tickets</h4>
        <DataTable columns={columns} data={recentTickets} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Customer Agent"
      welcomeMessage="I help you manage customer inquiries, track support tickets, and analyze customer satisfaction. I can quickly find ticket information, identify trends, and help you respond to customers more efficiently."
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
