import { useState, useRef, useEffect, ReactNode } from 'react'
import { Send, X, Download, Maximize2, Minimize2, FileSpreadsheet, FileText, FileJson } from 'lucide-react'
import * as XLSX from 'xlsx'

export interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  chart?: ReactNode
  data?: any
}

interface QuickAction {
  label: string
  action: string
}

interface AgentChatLayoutProps {
  agentName: string
  welcomeMessage: string
  statsPanel: ReactNode
  quickActions: QuickAction[]
  messages: Message[]
  onSendMessage: (message: string) => void
  chartPanel?: ReactNode
  chartData?: any[]
  chartTitle?: string
  onCloseChart?: () => void
  isChartExpanded?: boolean
  onToggleChartExpand?: () => void
}

// Helper function to export data as CSV
const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Helper function to export data as JSON
const exportToJSON = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Helper function to export data as XLS (Excel)
const exportToXLS = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  
  // Auto-size columns
  const headers = Object.keys(data[0])
  const colWidths = headers.map(header => {
    const maxLength = Math.max(
      header.length,
      ...data.map(row => String(row[header] || '').length)
    )
    return { wch: Math.min(maxLength + 2, 50) }
  })
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export default function AgentChatLayout({
  agentName,
  welcomeMessage,
  statsPanel,
  quickActions,
  messages,
  onSendMessage,
  chartPanel,
  chartData,
  chartTitle = 'chart_data',
  onCloseChart,
  isChartExpanded,
  onToggleChartExpand,
}: AgentChatLayoutProps) {
  const [inputValue, setInputValue] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleExportCSV = () => {
    if (chartData) {
      exportToCSV(chartData, chartTitle.replace(/\s+/g, '_').toLowerCase())
      setShowExportMenu(false)
    }
  }

  const handleExportJSON = () => {
    if (chartData) {
      exportToJSON(chartData, chartTitle.replace(/\s+/g, '_').toLowerCase())
      setShowExportMenu(false)
    }
  }

  const handleExportXLS = () => {
    if (chartData) {
      exportToXLS(chartData, chartTitle.replace(/\s+/g, '_').toLowerCase())
      setShowExportMenu(false)
    }
  }

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${chartPanel ? 'mr-0' : ''}`}>
        {/* Scrollable Content Area - Stats, Welcome, Quick Actions, Messages all scroll together */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.1) transparent' }}
        >
          {/* Stats Panel */}
          <div className="p-6 border-b border-gray-100">
            {statsPanel}
          </div>

          {/* Chat Content */}
          <div className="p-6 space-y-4">
            {/* Welcome Message - always shown */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Hi, I'm your {agentName}
                </h2>
                <p className="text-gray-600 leading-relaxed">{welcomeMessage}</p>
              </div>

              {/* Quick Actions - only shown when no messages */}
              {messages.length === 0 && (
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(action.action)}
                      className="p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-purple-700">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.chart && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      {message.chart}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <div className="max-w-3xl mx-auto">
            {/* Quick Action Pills - shown when there are messages */}
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.slice(0, 3).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(action.action)}
                    className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${agentName} anything...`}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 text-gray-400 hover:text-purple-600 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Panel */}
      {chartPanel && (
        <div 
          className={`border-l border-gray-200 bg-white flex flex-col transition-all duration-300 ${
            isChartExpanded ? 'w-[600px]' : 'w-[400px]'
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h3 className="font-medium text-gray-900">Visualization</h3>
            <div className="flex items-center gap-2">
              {/* Export Dropdown */}
              {chartData && chartData.length > 0 && (
                <div className="relative" ref={exportMenuRef}>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Export Data"
                  >
                    <Download size={16} />
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                      <button
                        onClick={handleExportXLS}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileSpreadsheet size={14} className="text-green-600" />
                        Export as Excel
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileText size={14} className="text-blue-600" />
                        Export as CSV
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileJson size={14} className="text-orange-600" />
                        Export as JSON
                      </button>
                    </div>
                  )}
                </div>
              )}
              {onToggleChartExpand && (
                <button
                  onClick={onToggleChartExpand}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title={isChartExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isChartExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              )}
              {onCloseChart && (
                <button
                  onClick={onCloseChart}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {chartPanel}
          </div>
          {/* Quick Suggestions in Chart Panel */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-500 mb-2">Continue exploring:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.slice(0, 3).map((action, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(action.action)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors"
                >
                  {action.label.replace(/^[^\s]+\s/, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
