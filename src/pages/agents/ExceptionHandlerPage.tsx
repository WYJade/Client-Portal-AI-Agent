import { useState, useCallback } from 'react'
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const exceptionTrend = [
  { day: 'Mon', raised: 12, resolved: 10 },
  { day: 'Tue', raised: 8, resolved: 11 },
  { day: 'Wed', raised: 15, resolved: 12 },
  { day: 'Thu', raised: 10, resolved: 14 },
  { day: 'Fri', raised: 6, resolved: 8 },
]

const activeExceptions = [
  { id: 'EXC-4521', type: 'Shipment Delay', source: 'Logistics', priority: 'High', status: 'investigating', age: '2h' },
  { id: 'EXC-4520', type: 'Invoice Mismatch', source: 'Finance', priority: 'Medium', status: 'pending', age: '4h' },
  { id: 'EXC-4519', type: 'Quality Issue', source: 'Warehouse', priority: 'High', status: 'escalated', age: '6h' },
  { id: 'EXC-4518', type: 'Stock Discrepancy', source: 'Inventory', priority: 'Low', status: 'resolved', age: '1d' },
  { id: 'EXC-4517', type: 'Order Cancellation', source: 'Sales', priority: 'Medium', status: 'investigating', age: '3h' },
]

const quickActions = [
  { label: '⚠️ Show active exceptions', action: 'Show active exceptions' },
  { label: '🔴 High priority issues', action: 'Show high priority exceptions' },
  { label: '📊 Exception trends this week', action: 'Exception trends this week' },
  { label: '🔍 Investigate exception EXC-4521', action: 'Investigate exception EXC-4521' },
  { label: '📋 Root cause analysis', action: 'Root cause analysis for recent exceptions' },
  { label: '✅ Resolve exception', action: 'Help me resolve an exception' },
]

const columns = [
  { key: 'id', label: 'Exception ID' },
  { key: 'type', label: 'Type' },
  { key: 'source', label: 'Source' },
  { 
    key: 'priority', 
    label: 'Priority',
    render: (value: string) => {
      const colorMap: Record<string, 'error' | 'warning' | 'info'> = {
        'High': 'error',
        'Medium': 'warning',
        'Low': 'info',
      }
      return <StatusBadge status={colorMap[value] || 'info'} label={value} />
    }
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
        'resolved': 'success',
        'investigating': 'warning',
        'escalated': 'error',
        'pending': 'info',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'age', label: 'Age', align: 'right' as const },
]

export default function ExceptionHandlerPage() {
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

      if (content.toLowerCase().includes('active') && !content.toLowerCase().includes('high')) {
        response = `⚠️ **Active Exceptions Overview**\n\n**Total Active:** 18 exceptions\n**Avg Resolution Time:** 4.2 hours\n\n**By Status:**\n🔴 Escalated: 3\n🟡 Investigating: 8\n🔵 Pending: 7\n\n**By Category:**\n\n📦 **Logistics (6)**\n• Shipment delays: 4\n• Routing issues: 2\n\n💰 **Finance (4)**\n• Invoice mismatches: 2\n• Payment disputes: 2\n\n🏭 **Warehouse (4)**\n• Quality issues: 2\n• Stock discrepancies: 2\n\n📋 **Orders (4)**\n• Cancellations: 2\n• Modifications: 2\n\n**Oldest Unresolved:**\nEXC-4515 - 18 hours (Quality Issue)\n\nWould you like details on any specific category?`
      } else if (content.toLowerCase().includes('high priority')) {
        response = `🔴 **High Priority Exceptions**\n\n**Active High Priority:** 5 exceptions\n\n**Immediate Attention Required:**\n\n1. **EXC-4521** - Shipment Delay\n   • Source: Logistics\n   • Age: 2 hours\n   • Impact: Customer delivery at risk\n   • Status: Investigating\n   • Assigned: Tom B.\n   • Action: Contact carrier for update\n\n2. **EXC-4519** - Quality Issue\n   • Source: Warehouse\n   • Age: 6 hours\n   • Impact: 50 units quarantined\n   • Status: Escalated to QA Manager\n   • Assigned: Sarah M.\n   • Action: Inspection scheduled\n\n3. **EXC-4516** - Payment Failure\n   • Source: Finance\n   • Age: 8 hours\n   • Impact: $45,000 order on hold\n   • Status: Investigating\n   • Assigned: Mike R.\n   • Action: Contact customer bank\n\n**SLA Status:**\n⚠️ 2 exceptions approaching SLA breach (4h limit)\n\nWould you like me to help resolve any of these?`
      } else if (content.toLowerCase().includes('trend')) {
        response = `📊 **Exception Trends - This Week**\n\n**Summary:**\n• Total Raised: 51\n• Total Resolved: 55\n• Net Reduction: -4 ✅\n\n**Daily Breakdown:**\n• Monday: 12 raised, 10 resolved\n• Tuesday: 8 raised, 11 resolved\n• Wednesday: 15 raised, 12 resolved (peak)\n• Thursday: 10 raised, 14 resolved\n• Friday: 6 raised, 8 resolved\n\n**By Category Trend:**\n📈 Increasing: Logistics (+25%)\n📉 Decreasing: Finance (-15%)\n➡️ Stable: Warehouse, Orders\n\n**Resolution Metrics:**\n• Avg Resolution Time: 4.2 hours\n• First Contact Resolution: 68%\n• Escalation Rate: 12%\n\n**Insights:**\n⚠️ Wednesday spike due to system update\n✅ Overall trend improving\n💡 Logistics needs process review\n\nI've opened the trend chart on the right.`
        const trendChartData = exceptionTrend.map(d => ({ ...d }))
        setChartData(trendChartData)
        setChartTitle('Daily Exception Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Daily Exception Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={exceptionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="raised" fill="#ef4444" name="Raised" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Red: Raised | Green: Resolved</div>
          </div>
        )
      } else if (content.toLowerCase().includes('exc-4521') || content.toLowerCase().includes('investigate')) {
        response = `🔍 **Exception Investigation: EXC-4521**\n\n**Type:** Shipment Delay\n**Priority:** High 🔴\n**Status:** Investigating\n**Age:** 2 hours\n\n**Details:**\n• Order: ORD-9847\n• Customer: Acme Corp\n• Shipment: SHP-78451\n• Original ETA: Apr 17, 2PM\n• Current Status: Delayed\n\n**Root Cause Analysis:**\n\n📍 **Timeline:**\n• 10:00 AM - Shipment departed warehouse\n• 11:30 AM - Carrier reported traffic delay\n• 12:00 PM - Exception auto-generated\n• 12:15 PM - Assigned to Tom B.\n\n🔎 **Investigation Findings:**\n• Cause: Major accident on I-95\n• Carrier: FastFreight\n• New ETA: Apr 17, 5PM (+3 hours)\n\n**Recommended Actions:**\n1. ✅ Notify customer of delay\n2. ✅ Update order status\n3. ⏳ Monitor carrier updates\n4. ⏳ Consider expedited delivery credit\n\n**Resolution Options:**\n• Accept delay with customer notification\n• Reroute to alternative carrier (+$150)\n• Offer discount on next order\n\nWhich action would you like to take?`
      } else if (content.toLowerCase().includes('root cause')) {
        response = `📋 **Root Cause Analysis - Recent Exceptions**\n\n**Analysis Period:** Last 7 days\n**Exceptions Analyzed:** 55\n\n**Top Root Causes:**\n\n1. **System/Process Issues (35%)**\n   • Inventory sync delays: 8 cases\n   • Order processing errors: 6 cases\n   • Integration failures: 5 cases\n   → Recommendation: System audit needed\n\n2. **External Factors (28%)**\n   • Carrier delays: 7 cases\n   • Weather impacts: 5 cases\n   • Supplier issues: 3 cases\n   → Recommendation: Improve contingency plans\n\n3. **Human Error (22%)**\n   • Data entry mistakes: 6 cases\n   • Picking errors: 4 cases\n   • Communication gaps: 2 cases\n   → Recommendation: Additional training\n\n4. **Customer-Related (15%)**\n   • Order changes: 4 cases\n   • Address issues: 3 cases\n   • Payment problems: 1 case\n   → Recommendation: Improve validation\n\n**Action Plan:**\n1. Schedule system audit (IT team)\n2. Review carrier SLAs (Logistics)\n3. Implement additional training (Operations)\n\nWould you like a detailed report for any category?`
        const rootCauseData = [
          { cause: 'System', count: 19 },
          { cause: 'External', count: 15 },
          { cause: 'Human', count: 12 },
          { cause: 'Customer', count: 9 },
        ]
        setChartData(rootCauseData)
        setChartTitle('Root Cause Distribution')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Root Cause Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { cause: 'System', count: 19 },
                { cause: 'External', count: 15 },
                { cause: 'Human', count: 12 },
                { cause: 'Customer', count: 9 },
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="cause" type="category" tick={{ fontSize: 12 }} width={70} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Exceptions" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('resolve')) {
        response = `✅ **Exception Resolution Assistant**\n\nI can help you resolve exceptions. Please provide:\n\n1. **Exception ID** (e.g., EXC-4521)\n2. **Resolution Type:**\n   • Resolved - Issue fixed\n   • Closed - No action needed\n   • Escalated - Needs higher authority\n   • Deferred - Postponed action\n\n**Quick Resolution Templates:**\n\n📦 **Shipment Delay:**\n• Customer notified\n• New ETA confirmed\n• Compensation offered (if applicable)\n\n💰 **Invoice Mismatch:**\n• Discrepancy identified\n• Correction applied\n• Credit/debit memo issued\n\n🏭 **Quality Issue:**\n• Inspection completed\n• RMA processed\n• Replacement shipped\n\n**Current Resolvable:**\n• EXC-4518 - Stock Discrepancy (Ready)\n• EXC-4514 - Minor delay (Ready)\n\nWhich exception would you like to resolve?`
      } else {
        response = `I help manage and resolve operational exceptions across your business. I can assist with:\n\n• Exception monitoring and tracking\n• Priority-based triage\n• Root cause analysis\n• Resolution workflows\n• Trend analysis and reporting\n• Escalation management\n\nWhat would you like to address?`
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
        <h3 className="text-lg font-semibold text-gray-900">Exception Management</h3>
        <span className="text-xs text-gray-500">Real-time monitoring</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Exceptions"
          value="18"
          subtitle="Across all categories"
          icon={<AlertTriangle size={20} />}
          color="orange"
        />
        <StatCard
          title="High Priority"
          value="5"
          subtitle="Immediate attention"
          trend="down"
          trendValue="2 less than yesterday"
          icon={<XCircle size={20} />}
          color="red"
        />
        <StatCard
          title="Avg Resolution"
          value="4.2h"
          subtitle="This week"
          trend="up"
          trendValue="0.8h faster"
          icon={<Clock size={20} />}
          color="blue"
        />
        <StatCard
          title="Resolved Today"
          value="12"
          subtitle="8 raised"
          trend="up"
          trendValue="Net reduction"
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Exceptions</h4>
        <DataTable columns={columns} data={activeExceptions} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Exception Handler"
      welcomeMessage="I help you manage and resolve operational exceptions efficiently. Ask me about active issues, investigate specific exceptions, or let me help with root cause analysis and resolution."
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
