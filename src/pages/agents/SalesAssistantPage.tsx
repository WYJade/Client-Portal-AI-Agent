import { useState, useCallback } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'
import SectionHeader from '../../components/agent/SectionHeader'

const salesData = [
  { month: 'Jan', sales: 4200, target: 4000 },
  { month: 'Feb', sales: 3800, target: 4000 },
  { month: 'Mar', sales: 5100, target: 4500 },
  { month: 'Apr', sales: 4800, target: 4500 },
]

const productData = [
  { name: 'Sensors', value: 89400 },
  { name: 'Modules', value: 72300 },
  { name: 'Power', value: 58200 },
  { name: 'Others', value: 84500 },
]

const recentOrders = [
  { orderNo: 'ORD-9847', poNo: 'PO-78451', status: 'processing', scheduledDate: 'Apr 22', orderedDate: 'Apr 18', retailerName: 'Acme Corp', description: 'Electronic Components', orderedQty: 24, shippedQty: 0, missAppointment: 'No' },
  { orderNo: 'ORD-9846', poNo: 'PO-78450', status: 'shipped', scheduledDate: 'Apr 20', orderedDate: 'Apr 15', retailerName: 'TechStart Inc', description: 'Sensor Modules', orderedQty: 15, shippedQty: 15, missAppointment: 'No' },
  { orderNo: 'ORD-9845', poNo: 'PO-78449', status: 'delivered', scheduledDate: 'Apr 19', orderedDate: 'Apr 12', retailerName: 'Global Trade', description: 'Power Supplies', orderedQty: 48, shippedQty: 48, missAppointment: 'No' },
  { orderNo: 'ORD-9844', poNo: 'PO-78448', status: 'processing', scheduledDate: 'Apr 25', orderedDate: 'Apr 18', retailerName: 'FastShip LLC', description: 'Control Units', orderedQty: 12, shippedQty: 0, missAppointment: 'Yes' },
]

const quickActions = [
  { label: '📈 Show sales performance this month', action: 'Show sales performance this month' },
  { label: '🎯 How are we tracking against targets?', action: 'How are we tracking against targets?' },
  { label: '🏆 Who are our top customers?', action: 'Who are our top customers?' },
  { label: '📦 Show pending orders summary', action: 'Show pending orders summary' },
  { label: '💰 What products are selling best?', action: 'What products are selling best?' },
  { label: '📊 Compare regional sales performance', action: 'Compare regional sales performance' },
]

const columns = [
  { key: 'orderNo', label: 'OrderNo' },
  { key: 'poNo', label: 'PONo' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'info'> = {
        'delivered': 'success',
        'shipped': 'info',
        'processing': 'warning',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'scheduledDate', label: 'ScheduledDate' },
  { key: 'orderedDate', label: 'OrderedDate' },
  { key: 'retailerName', label: 'Retailer Name' },
  { key: 'description', label: 'Description' },
  { key: 'orderedQty', label: 'OrderedQty', align: 'right' as const },
  { key: 'shippedQty', label: 'ShippedQty', align: 'right' as const },
  { key: 'missAppointment', label: 'MissAppointment' },
]

const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#3b82f6']

export default function SalesAssistantPage() {
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

      if (content.toLowerCase().includes('performance') || content.toLowerCase().includes('sales')) {
        response = `📊 **Sales Performance - April 2026**\n\n**Revenue Summary:**\n• Total Sales: $487,250\n• Orders Completed: 342\n• Average Order Value: $1,425\n\n**Performance Highlights:**\n✅ 8% above monthly target\n✅ 15% increase vs last month\n✅ New customer acquisition up 12%\n\nI've opened the sales trend chart on the right for a visual breakdown.`
        setChartData(salesData)
        setChartTitle('Monthly Sales vs Target')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Sales vs Target</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="sales" fill="#8b5cf6" name="Actual Sales" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Purple: Actual | Gray: Target</div>
          </div>
        )
      } else if (content.toLowerCase().includes('target')) {
        response = `🎯 **Target Tracking - Q2 2026**\n\n**Quarterly Target:** $1,500,000\n**Current Progress:** $1,124,500 (75%)\n**Days Remaining:** 74\n\n**Monthly Breakdown:**\n• April Target: $500,000 → $487,250 (97.5%) ✅\n• May Target: $500,000 → In Progress\n• June Target: $500,000 → Upcoming\n\n**Forecast:** On track to exceed Q2 target by ~5% 📈`
      } else if (content.toLowerCase().includes('top customers')) {
        response = `🏆 **Top Customers by Revenue (YTD)**\n\n1. **Global Trade Co.** - $245,800\n   └ 48 orders, Avg: $5,121\n\n2. **Acme Corporation** - $198,450\n   └ 62 orders, Avg: $3,201\n\n3. **TechStart Industries** - $156,200\n   └ 35 orders, Avg: $4,463\n\n4. **Prime Logistics** - $142,800\n   └ 41 orders, Avg: $3,483\n\n5. **FastShip LLC** - $128,500\n   └ 38 orders, Avg: $3,382\n\nWould you like me to analyze any specific customer's purchasing patterns?`
      } else if (content.toLowerCase().includes('products') || content.toLowerCase().includes('selling')) {
        response = `💰 **Best Selling Products - This Month**\n\n**By Revenue:**\n1. Industrial Sensors - $89,400 (245 units)\n2. Control Modules - $72,300 (180 units)\n3. Power Supplies - $58,200 (320 units)\n4. Connectors Kit - $45,600 (890 units)\n5. Display Panels - $38,900 (95 units)\n\n**Trending Up:** 📈\n• Smart Controllers (+45% vs last month)\n• IoT Modules (+32% vs last month)\n\n**Needs Attention:** ⚠️\n• Legacy Adapters (-18% vs last month)`
        setChartData(productData)
        setChartTitle('Product Category Distribution')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Product Category Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
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
      } else {
        response = `I can help you with sales analytics and order management. Here's what I can do:\n\n• Track sales performance and targets\n• Analyze customer purchasing patterns\n• Monitor order status and fulfillment\n• Identify top-selling products\n• Generate sales forecasts\n\nWhat would you like to explore?`
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
        <h3 className="text-lg font-semibold text-gray-100">Sales Dashboard</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value="$487.2K"
          subtitle="Target: $500K"
          trend="up"
          trendValue="+15% vs last month"
          icon={<DollarSign size={20} />}
          color="green"
          linkPath="/home/dashboards/kpi"
        />
        <StatCard
          title="Orders"
          value="342"
          subtitle="This month"
          trend="up"
          trendValue="+23 from last month"
          icon={<ShoppingCart size={20} />}
          color="purple"
          linkPath="/home/sales/wholesale"
        />
        <StatCard
          title="Avg Order Value"
          value="$1,425"
          subtitle="Per order"
          trend="up"
          trendValue="+$85 increase"
          icon={<TrendingUp size={20} />}
          color="blue"
          linkPath="/home/dashboards/kpi"
        />
        <StatCard
          title="Target Progress"
          value="97.5%"
          subtitle="Monthly target"
          trend="up"
          trendValue="On track"
          icon={<Target size={20} />}
          color="orange"
          linkPath="/home/dashboards/kpi"
        />
      </div>
      <div className="mt-4">
        <SectionHeader title="Recent Orders" linkText="Sales Orders" linkPath="/home/sales/wholesale" />
        <DataTable 
          columns={columns} 
          data={recentOrders} 
          maxRows={4} 
          rowLinkPath="/home/sales/wholesale"
        />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Sales Assistant"
      welcomeMessage="I help you track sales performance, analyze customer orders, and identify growth opportunities. Ask me about revenue trends, top customers, product performance, or order status."
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
