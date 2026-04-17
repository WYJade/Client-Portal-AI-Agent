import { useState, useCallback } from 'react'
import { Package, AlertTriangle, TrendingUp, RotateCcw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import AgentChatLayout, { Message } from '../../components/agent/AgentChatLayout'
import StatCard from '../../components/agent/StatCard'
import DataTable from '../../components/agent/DataTable'
import StatusBadge from '../../components/agent/StatusBadge'

const inventoryTrend = [
  { week: 'W1', value: 2.4, turnover: 4.2 },
  { week: 'W2', value: 2.5, turnover: 4.0 },
  { week: 'W3', value: 2.3, turnover: 4.5 },
  { week: 'W4', value: 2.6, turnover: 4.1 },
]

const stockAlerts = [
  { sku: 'SKU-78451', name: 'Industrial Sensor', onHand: 12, reorderPoint: 50, status: 'critical', daysLeft: 3 },
  { sku: 'SKU-65432', name: 'Control Module', onHand: 28, reorderPoint: 40, status: 'low', daysLeft: 8 },
  { sku: 'SKU-98765', name: 'Power Supply Unit', onHand: 156, reorderPoint: 100, status: 'ok', daysLeft: 25 },
  { sku: 'SKU-45678', name: 'Connector Kit', onHand: 45, reorderPoint: 60, status: 'low', daysLeft: 12 },
  { sku: 'SKU-11223', name: 'Display Panel', onHand: 8, reorderPoint: 25, status: 'critical', daysLeft: 2 },
]

const quickActions = [
  { label: '📊 Show inventory health overview', action: 'Show inventory health overview' },
  { label: '⚠️ Items below reorder point', action: 'Show items below reorder point' },
  { label: '📈 Inventory turnover analysis', action: 'Inventory turnover analysis' },
  { label: '💰 Dead stock report', action: 'Show dead stock report' },
  { label: '🔮 Demand forecast for next month', action: 'Demand forecast for next month' },
  { label: '📦 Optimize reorder quantities', action: 'Optimize reorder quantities' },
]

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'onHand', label: 'On Hand', align: 'right' as const },
  { key: 'reorderPoint', label: 'Reorder Pt', align: 'right' as const },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => {
      const statusMap: Record<string, 'success' | 'warning' | 'error'> = {
        'ok': 'success',
        'low': 'warning',
        'critical': 'error',
      }
      return <StatusBadge status={statusMap[value] || 'pending'} label={value} />
    }
  },
  { key: 'daysLeft', label: 'Days Left', align: 'right' as const },
]

export default function InventoryAdvisorPage() {
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

      if (content.toLowerCase().includes('health') || content.toLowerCase().includes('overview')) {
        response = `📊 **Inventory Health Overview**\n\n**Total Inventory Value:** $2.45M\n**SKU Count:** 2,847 active items\n\n**Health Metrics:**\n✅ Healthy Stock: 2,412 SKUs (84.7%)\n⚠️ Low Stock: 298 SKUs (10.5%)\n🔴 Critical: 89 SKUs (3.1%)\n📦 Overstock: 48 SKUs (1.7%)\n\n**Key Indicators:**\n• Inventory Turnover: 4.2x (Target: 4.0x) ✅\n• Days of Supply: 42 days (Target: 45) ✅\n• Fill Rate: 97.8% (Target: 98%) ⚠️\n• Carrying Cost: $18,500/month\n\n**Recommendations:**\n1. Address 89 critical items immediately\n2. Review 48 overstock items for markdown\n3. Improve fill rate by 0.2%\n\nWould you like details on any category?`
      } else if (content.toLowerCase().includes('reorder') || content.toLowerCase().includes('below')) {
        response = `⚠️ **Items Below Reorder Point**\n\n**Critical (Action Required):** 12 items\n**Low Stock:** 28 items\n\n**Top Priority Items:**\n\n🔴 **SKU-11223** - Display Panel\n   • On Hand: 8 units\n   • Reorder Point: 25 units\n   • Days of Stock: 2 days\n   • Suggested Order: 100 units\n   • Est. Cost: $4,500\n\n🔴 **SKU-78451** - Industrial Sensor\n   • On Hand: 12 units\n   • Reorder Point: 50 units\n   • Days of Stock: 3 days\n   • Suggested Order: 150 units\n   • Est. Cost: $8,250\n\n🟡 **SKU-65432** - Control Module\n   • On Hand: 28 units\n   • Reorder Point: 40 units\n   • Days of Stock: 8 days\n   • Suggested Order: 80 units\n   • Est. Cost: $3,200\n\n**Total Reorder Value:** $24,850\n\nWould you like me to generate purchase requests?`
      } else if (content.toLowerCase().includes('turnover')) {
        response = `📈 **Inventory Turnover Analysis**\n\n**Overall Turnover:** 4.2x annually\n**Industry Benchmark:** 3.8x\n**Status:** Above average ✅\n\n**By Category:**\n\n🏆 **High Velocity (>6x)**\n• Connectors: 8.2x\n• Cables: 7.5x\n• Fasteners: 6.8x\n\n✅ **Normal (4-6x)**\n• Sensors: 5.2x\n• Modules: 4.8x\n• Power Supplies: 4.3x\n\n⚠️ **Slow Moving (2-4x)**\n• Display Panels: 3.1x\n• Enclosures: 2.8x\n\n🔴 **Dead Stock (<2x)**\n• Legacy Adapters: 0.8x\n• Discontinued Parts: 0.3x\n\n**Recommendations:**\n• Increase stock for high-velocity items\n• Review pricing for slow movers\n• Liquidate dead stock ($45K value)\n\nI've opened the turnover trend chart.`
        setChartData(inventoryTrend)
        setChartTitle('Inventory Turnover Trend')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Inventory Turnover Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={inventoryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="turnover" stroke="#8b5cf6" strokeWidth={2} name="Turnover Rate" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Target turnover: 4.0x</div>
          </div>
        )
      } else if (content.toLowerCase().includes('dead stock')) {
        response = `💰 **Dead Stock Report**\n\n**Total Dead Stock Value:** $45,200\n**Items:** 156 SKUs\n**Age:** >180 days without movement\n\n**Top Dead Stock Items:**\n\n1. **Legacy Power Adapters** - $12,400\n   • Qty: 450 units\n   • Last Sale: 8 months ago\n   • Recommendation: Liquidate at 40% off\n\n2. **Discontinued Sensors** - $8,900\n   • Qty: 120 units\n   • Last Sale: 6 months ago\n   • Recommendation: Return to vendor\n\n3. **Old Model Displays** - $7,200\n   • Qty: 45 units\n   • Last Sale: 10 months ago\n   • Recommendation: Bundle with new models\n\n**Recovery Options:**\n• Liquidation sale: Est. recovery $27,000\n• Vendor returns: Est. recovery $8,900\n• Scrap/Donate: Write-off $9,300\n\nWould you like me to prepare a liquidation plan?`
      } else if (content.toLowerCase().includes('forecast') || content.toLowerCase().includes('demand')) {
        const forecastData = [
          { item: 'Connectors', current: 1800, forecast: 2400 },
          { item: 'Sensors', current: 1200, forecast: 1850 },
          { item: 'Modules', current: 1400, forecast: 1200 },
          { item: 'Power', current: 900, forecast: 1100 },
        ]
        response = `🔮 **Demand Forecast - May 2026**\n\n**Methodology:** ML-based forecast using 24-month history\n**Confidence Level:** 85%\n\n**Top 10 Items by Forecasted Demand:**\n\n1. **SKU-45678** - Connector Kit\n   • Forecast: 2,400 units (+15% vs Apr)\n   • Current Stock: 1,800 units\n   • Gap: Need 600 more units\n\n2. **SKU-78451** - Industrial Sensor\n   • Forecast: 1,850 units (+8% vs Apr)\n   • Current Stock: 1,200 units\n   • Gap: Need 650 more units\n\n3. **SKU-65432** - Control Module\n   • Forecast: 1,200 units (-5% vs Apr)\n   • Current Stock: 1,400 units\n   • Status: Adequate ✅\n\n**Seasonal Factors:**\n📈 Q2 typically +12% vs Q1\n📈 Industrial sector demand rising\n📉 Consumer electronics flat\n\n**Recommended Actions:**\n• Increase orders for top 5 items\n• Maintain current levels for stable items\n• Reduce orders for declining items`
        setChartData(forecastData)
        setChartTitle('Demand Forecast')
        setChartPanel(
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Demand Forecast</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { item: 'Connectors', current: 1800, forecast: 2400 },
                { item: 'Sensors', current: 1200, forecast: 1850 },
                { item: 'Modules', current: 1400, forecast: 1200 },
                { item: 'Power', current: 900, forecast: 1100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="item" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="current" fill="#e5e7eb" name="Current Stock" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" fill="#8b5cf6" name="May Forecast" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500">Gray: Current Stock | Purple: Forecasted Demand</div>
          </div>
        )
      } else if (content.toLowerCase().includes('optimize')) {
        response = `📦 **Reorder Quantity Optimization**\n\n**Analysis Method:** Economic Order Quantity (EOQ)\n\n**Optimized Recommendations:**\n\n**SKU-78451** - Industrial Sensor\n• Current ROQ: 100 units\n• Optimized ROQ: 150 units\n• Savings: $420/year (fewer orders)\n• New Safety Stock: 35 units\n\n**SKU-65432** - Control Module\n• Current ROQ: 50 units\n• Optimized ROQ: 80 units\n• Savings: $280/year\n• New Safety Stock: 25 units\n\n**SKU-45678** - Connector Kit\n• Current ROQ: 200 units\n• Optimized ROQ: 175 units\n• Savings: $150/year (less carrying cost)\n• New Safety Stock: 45 units\n\n**Total Annual Savings:** $4,850\n**Inventory Reduction:** $28,000\n\nWould you like me to update the reorder parameters?`
      } else {
        response = `I provide inventory optimization advice and demand forecasting. I can help with:\n\n• Inventory health monitoring\n• Reorder point analysis\n• Turnover optimization\n• Dead stock identification\n• Demand forecasting\n• Safety stock calculations\n\nWhat would you like to analyze?`
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
        <h3 className="text-lg font-semibold text-gray-100">Inventory Intelligence</h3>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Inventory Value"
          value="$2.45M"
          subtitle="2,847 SKUs"
          icon={<Package size={20} />}
          color="purple"
        />
        <StatCard
          title="Stock Alerts"
          value="89"
          subtitle="Critical items"
          trend="down"
          trendValue="12 less than last week"
          icon={<AlertTriangle size={20} />}
          color="red"
        />
        <StatCard
          title="Turnover Rate"
          value="4.2x"
          subtitle="Annual"
          trend="up"
          trendValue="Above 4.0x target"
          icon={<TrendingUp size={20} />}
          color="green"
        />
        <StatCard
          title="Fill Rate"
          value="97.8%"
          subtitle="Order fulfillment"
          trend="neutral"
          trendValue="Target: 98%"
          icon={<RotateCcw size={20} />}
          color="blue"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Stock Alerts</h4>
        <DataTable columns={columns} data={stockAlerts} maxRows={4} />
      </div>
    </div>
  )

  return (
    <AgentChatLayout
      agentName="Inventory Advisor"
      welcomeMessage="I provide intelligent inventory management advice, demand forecasting, and optimization recommendations. Ask me about stock levels, turnover analysis, or let me help optimize your inventory strategy."
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
