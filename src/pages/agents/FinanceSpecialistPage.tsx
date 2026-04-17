import { useState, useCallback } from 'react'
import { DollarSign, CreditCard, FileText, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const cashFlowData = [
  { month: 'Jan', inflow: 520, outflow: 480 },
  { month: 'Feb', inflow: 485, outflow: 510 },
  { month: 'Mar', inflow: 610, outflow: 520 },
  { month: 'Apr', inflow: 545, outflow: 490 },
]

const pendingInvoices = [
  { id: 'INV-9847', customer: 'Acme Corp', amount: '$24,500', dueDate: 'Apr 20', status: 'pending', age: '5 days' },
  { id: 'INV-9842', customer: 'TechStart Inc', amount: '$18,200', dueDate: 'Apr 15', status: 'overdue', age: '12 days' },
  { id: 'INV-9838', customer: 'Global Trade', amount: '$45,800', dueDate: 'Apr 25', status: 'pending', age: '2 days' },
  { id: 'INV-9835', customer: 'FastShip LLC', amount: '$12,400', dueDate: 'Apr 10', status: 'overdue', age: '17 days' },
]

const quickActions = [
  { label: '💰 Show accounts receivable summary', action: 'Show accounts receivable summary' },
  { label: '📊 Cash flow analysis', action: 'Cash flow analysis this quarter' },
  { label: '⚠️ Overdue invoices report', action: 'Show overdue invoices' },
  { label: '📋 Pending payments to process', action: 'Pending payments to process' },
  { label: '📈 Revenue vs expenses trend', action: 'Revenue vs expenses trend' },
  { label: '🔍 Check payment status for...', action: 'Check payment status for Acme Corp' },
]

const columns = [
  { key: 'id', label: 'Invoice' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'dueDate', label: 'Due Date' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error'> = {
        'paid': 'success',
        'pending': 'warning',
        'overdue': 'error',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'age', label: 'Age', align: 'right' as const },
]

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function FinanceSpecialistPage() {
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

      if (content.toLowerCase().includes('receivable') || content.toLowerCase().includes('ar')) {
        const arAgingData = [
          { name: 'Current', value: 485200 },
          { name: '31-60 days', value: 198400 },
          { name: '61-90 days', value: 98600 },
          { name: '>90 days', value: 60300 },
        ]
        response = `💰 **Accounts Receivable Summary**\n\n**Total AR:** $842,500\n**Customers with Balance:** 156\n\n**Aging Analysis:**\n\n✅ **Current (0-30 days):** $485,200 (57.6%)\n   • 89 invoices\n   • Avg days: 12\n\n🟡 **31-60 days:** $198,400 (23.5%)\n   • 42 invoices\n   • Avg days: 45\n\n🟠 **61-90 days:** $98,600 (11.7%)\n   • 18 invoices\n   • Avg days: 72\n\n🔴 **Over 90 days:** $60,300 (7.2%)\n   • 7 invoices\n   • Avg days: 124\n\n**Collection Metrics:**\n• DSO (Days Sales Outstanding): 38 days\n• Collection Rate: 94.2%\n• Bad Debt Reserve: $25,000\n\n**Action Items:**\n• Follow up on 7 invoices >90 days\n• Send reminders for 18 invoices 61-90 days`
        setChartData(arAgingData)
        setChartTitle('AR Aging Distribution')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">AR Aging Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Current', value: 485200 },
                    { name: '31-60 days', value: 198400 },
                    { name: '61-90 days', value: 98600 },
                    { name: '>90 days', value: 60300 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      } else if (content.toLowerCase().includes('cash flow')) {
        response = `📊 **Cash Flow Analysis - Q1 2026**\n\n**Summary:**\n• Total Inflow: $1,615,000\n• Total Outflow: $1,480,000\n• Net Cash Flow: +$135,000 ✅\n\n**Monthly Breakdown:**\n\n**January:**\n📥 Inflow: $520,000\n📤 Outflow: $480,000\n💵 Net: +$40,000\n\n**February:**\n📥 Inflow: $485,000\n📤 Outflow: $510,000\n💵 Net: -$25,000 ⚠️\n\n**March:**\n📥 Inflow: $610,000\n📤 Outflow: $520,000\n💵 Net: +$90,000\n\n**Key Observations:**\n✅ Positive trend in Q1\n✅ March strongest month\n⚠️ February had negative flow (seasonal)\n\n**Forecast - April:**\nExpected Net: +$55,000\n\nI've opened the cash flow chart on the right.`
        setChartData(cashFlowData)
        setChartTitle('Monthly Cash Flow')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Cash Flow</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}k`} />
                <Tooltip formatter={(value) => `$${Number(value)}k`} />
                <Bar dataKey="inflow" fill="#22c55e" name="Inflow" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" name="Outflow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Green: Cash Inflow | Red: Cash Outflow</div>
          </div>
        )
      } else if (content.toLowerCase().includes('overdue')) {
        response = `⚠️ **Overdue Invoices Report**\n\n**Total Overdue:** $158,900\n**Invoices:** 25\n\n**High Priority (>$10,000):**\n\n🔴 **INV-9835** - FastShip LLC\n   • Amount: $12,400\n   • Due: Apr 10 (17 days overdue)\n   • Contact: John Smith\n   • Last Contact: Apr 12\n   • Action: Escalate to collections\n\n🔴 **INV-9842** - TechStart Inc\n   • Amount: $18,200\n   • Due: Apr 15 (12 days overdue)\n   • Contact: Sarah Johnson\n   • Last Contact: Apr 14\n   • Action: Send final notice\n\n🔴 **INV-9828** - Metro Systems\n   • Amount: $28,500\n   • Due: Apr 5 (22 days overdue)\n   • Contact: Mike Brown\n   • Last Contact: Apr 8\n   • Action: Payment plan discussion\n\n**Recommended Actions:**\n1. Call FastShip LLC today\n2. Send final notice to TechStart\n3. Schedule call with Metro Systems\n\nWould you like me to draft collection emails?`
      } else if (content.toLowerCase().includes('payment') && content.toLowerCase().includes('process')) {
        response = `📋 **Pending Payments to Process**\n\n**Accounts Payable Queue:**\n\n**Due Today (3):**\n• Vendor: TechParts Inc - $24,500\n• Vendor: Global Supply - $18,200\n• Vendor: FastFreight - $8,400\n**Total: $51,100**\n\n**Due This Week (8):**\n• Total Amount: $142,800\n• Vendors: 8\n\n**Payment Methods:**\n💳 ACH Transfer: $98,400 (5 payments)\n🏦 Wire Transfer: $44,400 (3 payments)\n\n**Cash Available:** $285,000\n**After Payments:** $233,900\n\n**Approval Status:**\n✅ Approved: 6 payments\n⏳ Pending Approval: 2 payments\n   • PR-8451: $12,500 (needs CFO)\n   • PR-8448: $15,800 (needs VP)\n\nWould you like me to process the approved payments?`
      } else if (content.toLowerCase().includes('revenue') || content.toLowerCase().includes('expense')) {
        response = `📈 **Revenue vs Expenses - Q1 2026**\n\n**Summary:**\n• Total Revenue: $2,845,000\n• Total Expenses: $2,180,000\n• Gross Profit: $665,000\n• Margin: 23.4%\n\n**Revenue Breakdown:**\n💰 Product Sales: $2,280,000 (80.1%)\n💰 Services: $425,000 (14.9%)\n💰 Other: $140,000 (5.0%)\n\n**Expense Breakdown:**\n📦 COGS: $1,420,000 (65.1%)\n👥 Payroll: $480,000 (22.0%)\n🏢 Operations: $180,000 (8.3%)\n📊 Marketing: $100,000 (4.6%)\n\n**Month-over-Month:**\n• Jan: 22.1% margin\n• Feb: 21.8% margin\n• Mar: 26.2% margin ✅\n\n**Trend:** Improving margins due to cost optimization`
      } else if (content.toLowerCase().includes('acme') || content.toLowerCase().includes('status')) {
        response = `🔍 **Payment Status: Acme Corp**\n\n**Customer ID:** CUST-1247\n**Credit Limit:** $100,000\n**Available Credit:** $45,500\n\n**Outstanding Invoices:**\n\n📄 **INV-9847** - $24,500\n   • Date: Apr 12, 2026\n   • Due: Apr 20, 2026\n   • Status: Pending (5 days until due)\n   • Terms: Net 30\n\n📄 **INV-9832** - $30,000\n   • Date: Mar 28, 2026\n   • Due: Apr 27, 2026\n   • Status: Pending\n   • Terms: Net 30\n\n**Payment History:**\n✅ Last Payment: $45,200 on Apr 5\n✅ Avg Payment Time: 28 days\n✅ Payment Rating: Excellent\n\n**Total Outstanding:** $54,500\n**Account Status:** Good Standing ✅\n\nNo action required - customer pays on time.`
      } else {
        response = `I help manage financial operations and provide insights. I can assist with:\n\n• Accounts receivable management\n• Cash flow analysis\n• Invoice tracking and collections\n• Payment processing\n• Financial reporting\n• Customer credit analysis\n\nWhat would you like to explore?`
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
        <h3 className="text-lg font-semibold text-gray-900">Finance Overview</h3>
        <span className="text-xs text-gray-500">April 2026</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Accounts Receivable"
          value="$842.5K"
          subtitle="156 customers"
          icon={<DollarSign size={20} />}
          color="green"
        />
        <StatCard
          title="Overdue"
          value="$158.9K"
          subtitle="25 invoices"
          trend="down"
          trendValue="8% less than last month"
          icon={<AlertCircle size={20} />}
          color="red"
        />
        <StatCard
          title="Pending Payments"
          value="$51.1K"
          subtitle="Due today"
          icon={<CreditCard size={20} />}
          color="orange"
        />
        <StatCard
          title="DSO"
          value="38 days"
          subtitle="Days Sales Outstanding"
          trend="up"
          trendValue="2 days improvement"
          icon={<FileText size={20} />}
          color="blue"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Invoices</h4>
        <DataTable columns={columns} data={pendingInvoices} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Finance Specialist"
      welcomeMessage="I help manage financial operations, track receivables, and provide cash flow insights. Ask me about invoice status, payment processing, or financial analysis."
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
