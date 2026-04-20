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
  const prevMessagesLengthRef = useRef(messages.length)

  // Only scroll to bottom when a new message is added
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages])

  // Reset scroll to top when switching agents
  useEffect(() => {
    if (messages.length === 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [agentName])

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
    <div className="h-full flex bg-gray-950">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
        >
          {/* Welcome Message Section - At TOP */}
          <div className="px-6 py-5 bg-gray-950">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Hi, I'm your {agentName}
            </h2>
            <p className="text-gray-400 leading-relaxed">{welcomeMessage}</p>
          </div>

          {/* Stats Panel - Dashboard Section - BELOW welcome message */}
          <div className="bg-gray-900 border-t border-gray-700">
            <div className="px-6 py-5">
              {statsPanel}
            </div>
          </div>

          {/* Quick Actions Grid - Below stats panel, only shown when no messages */}
          {messages.length === 0 && (
            <div className="px-6 py-5 bg-gray-900 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(action.action)}
                    className="p-4 text-left bg-gray-800 border border-gray-700 rounded-xl hover:border-purple-500/50 hover:bg-gray-700 transition-all group"
                  >
                    <span className="text-sm text-gray-300 group-hover:text-purple-400 line-clamp-2">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Visual Separator between Dashboard and Chat */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="flex items-center justify-center py-3 bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-700"></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chat</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-700"></div>
              </div>
            </div>
          </div>

          {/* Chat Content Area - Messages only */}
          <div className="px-6 py-4 bg-gray-950">
            {/* Messages Container */}
            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 border border-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      {message.chart && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                          {message.chart}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at bottom, full width */}
        <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 shrink-0">
          {/* Input Field - Full width */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agentName} anything... Press Enter to send`}
              className="w-full px-5 py-3.5 pr-14 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Quick Actions & Chart */}
      <div 
        className={`border-l border-gray-800 bg-gray-900 flex flex-col transition-all duration-300 shrink-0 ${
          chartPanel && isChartExpanded ? 'w-[550px]' : 'w-[320px]'
        }`}
      >
        {/* Chart Section - only shown when chartPanel exists */}
        {chartPanel && (
          <>
            {/* Chart Header */}
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-gray-100">Visualization</h3>
              <div className="flex items-center gap-1">
                {/* Export Dropdown */}
                {chartData && chartData.length > 0 && (
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Export Data"
                    >
                      <Download size={18} />
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-2 z-10 min-w-[170px]">
                        <button
                          onClick={handleExportXLS}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3"
                        >
                          <FileSpreadsheet size={16} className="text-green-500" />
                          Export as Excel
                        </button>
                        <button
                          onClick={handleExportCSV}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3"
                        >
                          <FileText size={16} className="text-blue-500" />
                          Export as CSV
                        </button>
                        <button
                          onClick={handleExportJSON}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-3"
                        >
                          <FileJson size={16} className="text-orange-500" />
                          Export as JSON
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {onToggleChartExpand && (
                  <button
                    onClick={onToggleChartExpand}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                    title={isChartExpanded ? 'Minimize' : 'Maximize'}
                  >
                    {isChartExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                )}
                {onCloseChart && (
                  <button
                    onClick={onCloseChart}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Chart Content */}
            <div className="flex-1 overflow-auto p-5">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-800">
                {chartPanel}
              </div>
            </div>
          </>
        )}
        
        {/* Quick Suggestions - Always visible */}
        <div className={`px-5 py-4 border-t border-gray-800 shrink-0 ${!chartPanel ? 'flex-1 overflow-auto' : ''}`}>
          <p className="text-xs font-medium text-gray-500 mb-3">Quick actions</p>
          <div className="flex flex-col gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(action.action)}
                className="px-3 py-2 text-xs text-left text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
