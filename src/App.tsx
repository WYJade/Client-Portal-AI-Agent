import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import InventoryActivity from './pages/home/inventory/InventoryActivity'
import AgentChat from './pages/agents/AgentChat'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/agents" replace />} />
        
        {/* Home Module Routes */}
        <Route path="home">
          <Route path="dashboards/otif" element={<PlaceholderPage title="OTIF Dashboard" />} />
          <Route path="dashboards/kpi" element={<PlaceholderPage title="KPI Dashboard" />} />
          <Route path="dashboards/ticket-insights" element={<PlaceholderPage title="Ticket Insights" />} />
          <Route path="purchase/projects" element={<PlaceholderPage title="Projects" />} />
          <Route path="purchase/request" element={<PlaceholderPage title="Purchase Request" />} />
          <Route path="purchase/order" element={<PlaceholderPage title="Purchase Order" />} />
          <Route path="sales/wholesale" element={<PlaceholderPage title="Wholesale Orders" />} />
          <Route path="sales/retail" element={<PlaceholderPage title="Retail Orders" />} />
          <Route path="work-order" element={<PlaceholderPage title="Work Order" />} />
          <Route path="inbound/inquiry" element={<PlaceholderPage title="Inquiry" />} />
          <Route path="inbound/schedule-summary" element={<PlaceholderPage title="Schedule Summary" />} />
          <Route path="inbound/received-summary" element={<PlaceholderPage title="Received Summary" />} />
          <Route path="inbound/receipt-entry" element={<PlaceholderPage title="Receipt Entry" />} />
          <Route path="inbound/put-away-report" element={<PlaceholderPage title="Put Away Report" />} />
          <Route path="inbound/make-appointment" element={<PlaceholderPage title="Make Appointment" />} />
          <Route path="inbound/appointment-list" element={<PlaceholderPage title="Appointment List" />} />
          <Route path="inventory/sn-lookup" element={<PlaceholderPage title="SN Look Up" />} />
          <Route path="inventory/activity" element={<InventoryActivity />} />
          <Route path="inventory/adjustment" element={<PlaceholderPage title="Inventory Adjustment" />} />
        </Route>

        {/* Agents Module Routes */}
        <Route path="agents" element={<AgentChat />} />

        {/* Favorites Module Routes */}
        <Route path="favorites" element={<PlaceholderPage title="Favorites" />} />
      </Route>
    </Routes>
  )
}
