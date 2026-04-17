import { useState, useCallback } from 'react'
import { ShoppingCart, TrendingDown, FileCheck, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const spendTrend = [
  { month: 'Jan', spend: 245000, budget: 250000 },
  { month: 'Feb', spend: 238000, budget: 250000 },
  { month: 'Mar', spend: 262000, budget: 260000 },
  { month: 'Apr', spend: 198000, budget: 250000 },
]

const categorySpendData = [
  { category: 'Materials', spend: 412 },
  { category: 'Equipment', spend: 198 },
  { category: 'Services', spend: 156 },
  { category: 'Supplies', spend: 98 },
  { category: 'Other', spend: 79 },
]

const pendingApprovals = [
  { id: 'PR-8451', requester: 'Operations', category: 'Equipment', amount: '$12,500', status: 'pending', urgency: 'High' },
  { id: 'PR-8450', requester: 'IT Dept', category: 'Software', amount: '$8,200', status: 'review', urgency: 'Medium' },
  { id: 'PR-8449', requester: 'Warehouse', category: 'Supplies', amount: '$3,450', status: 'approved', urgency: 'Low' },
  { id: 'PR-8448', requester: 'Sales', category: 'Marketing', amount: '$15,800', status: 'pending', urgency: 'Medium' },
]

const quickActions = [
  { label: '📊 Show procurement spend analysis', action: 'Show procurement spend analysis' },
  { label: '📋 Pending approval requests', action: 'Show pending approval requests' },
  { label: '💰 Compare vendor pricing', action: 'Compare vendor pricing for office supplies' },
  { label: '📈 Category spend breakdown', action: 'Category spend breakdown this quarter' },
  { label: '⚠️ Any budget overruns?', action: 'Any budget overruns this month?' },
  { label: '🔍 Find best vendor for...', action: 'Find best vendor for electronic components' },
]

const columns = [
  { key: 'id', label: 'Request ID' },
  { key: 'requester', label: 'Requester' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'pending'> = {
        'approved': 'success',
        'review': 'warning',
        'pending': 'pending',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
]

export default function ProcurementCopilotPage() {
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

      if (content.toLowerCase().includes('spend') || content.toLowerCase().includes('analysis')) {
        response = `📊 **Procurement Spend Analysis**\n\n**Q1 2026 Summary:**\n• Total Spend: $943,000\n• Budget: $1,010,000\n• Variance: -$67,000 (6.6% under budget) ✅\n\n**Top Categories:**\n1. Raw Materials: $412,000 (43.7%)\n2. Equipment: $198,000 (21.0%)\n3. Services: $156,000 (16.5%)\n4. Supplies: $98,000 (10.4%)\n5. Other: $79,000 (8.4%)\n\n**Cost Savings Achieved:**\n💰 Negotiated discounts: $45,200\n💰 Bulk purchasing: $28,400\n💰 Vendor consolidation: $18,600\n\n**Total Savings:** $92,200 (9.8% of spend)\n\nI've opened the spend trend chart on the right.`
        setChartData(spendTrend)
        setChartTitle('Monthly Spend vs Budget')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Spend vs Budget</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={spendTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="spend" stroke="#8b5cf6" strokeWidth={2} name="Actual Spend" />
                <Line type="monotone" dataKey="budget" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" name="Budget" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Purple: Actual Spend | Gray dashed: Budget</div>
          </div>
        )
      } else if (content.toLowerCase().includes('approval') || content.toLowerCase().includes('pending')) {
        response = `📋 **Pending Approval Requests**\n\n**Awaiting Your Review (4):**\n\n🔴 **PR-8451** - High Priority\n   • Requester: Operations\n   • Category: Equipment\n   • Amount: $12,500\n   • Item: Forklift maintenance parts\n   • Justification: Critical equipment repair\n   • Recommendation: ✅ Approve\n\n🟡 **PR-8450** - Medium Priority\n   • Requester: IT Department\n   • Category: Software\n   • Amount: $8,200\n   • Item: Security software licenses\n   • Justification: Annual renewal\n   • Recommendation: ✅ Approve (compare pricing first)\n\n🟡 **PR-8448** - Medium Priority\n   • Requester: Sales\n   • Category: Marketing\n   • Amount: $15,800\n   • Item: Trade show booth\n   • Justification: Q2 industry event\n   • Recommendation: 🔍 Review ROI\n\nWould you like me to process any of these?`
      } else if (content.toLowerCase().includes('vendor') || content.toLowerCase().includes('pricing') || content.toLowerCase().includes('compare')) {
        response = `💰 **Vendor Pricing Comparison**\n\n**Category:** Office Supplies\n**Last Updated:** Apr 15, 2026\n\n**Top Vendors:**\n\n🥇 **OfficeMax Pro**\n   • Avg Discount: 18%\n   • Delivery: 2-3 days\n   • Min Order: $100\n   • Rating: 4.8/5\n   • Best for: Paper, toner\n\n🥈 **Staples Business**\n   • Avg Discount: 15%\n   • Delivery: 1-2 days\n   • Min Order: $50\n   • Rating: 4.6/5\n   • Best for: Quick delivery\n\n🥉 **Amazon Business**\n   • Avg Discount: 12%\n   • Delivery: Same/Next day\n   • Min Order: None\n   • Rating: 4.5/5\n   • Best for: Variety, speed\n\n**Recommendation:**\nUse OfficeMax Pro for bulk orders, Staples for urgent needs.\n\n**Potential Savings:** $2,400/year by consolidating`
      } else if (content.toLowerCase().includes('category') || content.toLowerCase().includes('breakdown')) {
        response = `📈 **Category Spend Breakdown - Q1 2026**\n\n**Total Spend:** $943,000\n\n**By Category:**\n\n📦 **Raw Materials** - $412,000\n   • Budget: $400,000\n   • Variance: +$12,000 (3% over)\n   • Trend: ↗️ Increasing\n\n🔧 **Equipment** - $198,000\n   • Budget: $220,000\n   • Variance: -$22,000 (10% under)\n   • Trend: ↘️ Decreasing\n\n👥 **Services** - $156,000\n   • Budget: $160,000\n   • Variance: -$4,000 (2.5% under)\n   • Trend: → Stable\n\n📎 **Supplies** - $98,000\n   • Budget: $100,000\n   • Variance: -$2,000 (2% under)\n   • Trend: → Stable\n\n**Key Insights:**\n⚠️ Raw materials trending over budget\n✅ Equipment spend well controlled\n💡 Consider renegotiating raw material contracts`
        setChartData(categorySpendData)
        setChartTitle('Spend by Category')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Spend by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categorySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}k`} />
                <Tooltip formatter={(value) => `$${Number(value)}k`} />
                <Bar dataKey="spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('budget') || content.toLowerCase().includes('overrun')) {
        response = `⚠️ **Budget Status Report**\n\n**April 2026 Status:**\n• Budget: $250,000\n• Spent: $198,000 (79.2%)\n• Remaining: $52,000\n• Days Left: 13\n\n**Categories At Risk:**\n\n🔴 **Raw Materials**\n   • Budget: $100,000\n   • Spent: $98,500 (98.5%)\n   • Risk: High - May exceed by $8,000\n   • Action: Defer non-critical orders\n\n🟡 **Equipment**\n   • Budget: $55,000\n   • Spent: $48,200 (87.6%)\n   • Risk: Medium - PR-8451 pending\n   • Action: Prioritize critical repairs only\n\n**Categories On Track:**\n✅ Services: 72% utilized\n✅ Supplies: 68% utilized\n✅ Other: 45% utilized\n\n**Recommendation:**\nDefer $15,000 in non-critical purchases to May to stay within budget.`
      } else {
        response = `I help optimize procurement processes and manage spending. I can assist with:\n\n• Spend analysis and tracking\n• Purchase request approvals\n• Vendor comparison and selection\n• Budget monitoring\n• Cost savings identification\n• Contract management\n\nWhat would you like to explore?`
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
        <h3 className="text-lg font-semibold text-gray-100">Procurement Dashboard</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Monthly Spend"
          value="$198K"
          subtitle="Budget: $250K"
          trend="down"
          trendValue="21% under budget"
          icon={<ShoppingCart size={20} />}
          color="green"
        />
        <StatCard
          title="Cost Savings"
          value="$92.2K"
          subtitle="YTD savings"
          trend="up"
          trendValue="9.8% of spend"
          icon={<TrendingDown size={20} />}
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value="4"
          subtitle="$40K total value"
          icon={<FileCheck size={20} />}
          color="orange"
        />
        <StatCard
          title="At Risk"
          value="1"
          subtitle="Category over budget"
          trend="neutral"
          trendValue="Raw Materials"
          icon={<AlertTriangle size={20} />}
          color="red"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Requests</h4>
        <DataTable columns={columns} data={pendingApprovals} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Procurement Copilot"
      welcomeMessage="I help you manage procurement activities, track spending, and optimize vendor relationships. Ask me about budget status, pending approvals, or let me help find the best vendors for your needs."
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
