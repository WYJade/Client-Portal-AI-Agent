import { MenuItem, AIAgent, AIAgentGroup } from '../types/menu'

export const homeMenuItems: MenuItem[] = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: 'LayoutDashboard',
    children: [
      { id: 'otif', label: 'OTIF', path: '/home/dashboards/otif' },
      { id: 'kpi', label: 'KPI', path: '/home/dashboards/kpi' },
      { id: 'ticket-insights', label: 'Ticket Insights', path: '/home/dashboards/ticket-insights' },
    ],
  },
  {
    id: 'purchase-management',
    label: 'Purchase Management',
    icon: 'ShoppingCart',
    children: [
      { id: 'projects', label: 'Projects', path: '/home/purchase/projects' },
      { id: 'purchase-request', label: 'Purchase Request', path: '/home/purchase/request' },
      { id: 'purchase-order', label: 'Purchase Order', path: '/home/purchase/order' },
    ],
  },
  {
    id: 'sales-order',
    label: 'Sales Order',
    icon: 'FileText',
    children: [
      { id: 'wholesale-orders', label: 'Wholesale Orders', path: '/home/sales/wholesale' },
      { id: 'retail-orders', label: 'Retail Orders', path: '/home/sales/retail' },
    ],
  },
  {
    id: 'work-order',
    label: 'Work Order',
    icon: 'Clipboard',
    path: '/home/work-order',
  },
  {
    id: 'inbound',
    label: 'Inbound',
    icon: 'PackageCheck',
    children: [
      { id: 'inquiry', label: 'Inquiry', path: '/home/inbound/inquiry' },
      { id: 'schedule-summary', label: 'Schedule Summary', path: '/home/inbound/schedule-summary' },
      { id: 'received-summary', label: 'Received Summary', path: '/home/inbound/received-summary' },
      { id: 'receipt-entry', label: 'Receipt Entry', path: '/home/inbound/receipt-entry' },
      { id: 'put-away-report', label: 'Put Away Report', path: '/home/inbound/put-away-report' },
      { id: 'make-appointment', label: 'Make Appointment', path: '/home/inbound/make-appointment' },
      { id: 'appointment-list', label: 'Appointment List', path: '/home/inbound/appointment-list' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'Package',
    children: [
      { id: 'sn-lookup', label: 'SN Look Up', path: '/home/inventory/sn-lookup' },
      { id: 'inventory-activity', label: 'Inventory Activity', path: '/home/inventory/activity' },
      { id: 'inventory-adjustment', label: 'Inventory Adjustment', path: '/home/inventory/adjustment' },
    ],
  },
]

export const aiAgentGroups: AIAgentGroup[] = [
  {
    id: 'customer-service',
    label: 'Customer Service',
    icon: 'Headphones',
    agents: [
      { id: 'customer-agent', name: 'Customer Agent', description: 'Assist customers with inquiries and support' },
      { id: 'sales-assistant', name: 'Sales Assistant', description: 'Help with sales-related questions and orders' },
      { id: 'quote-agent', name: 'Quote Agent', description: 'Generate and manage customer quotes' },
    ],
  },
  {
    id: 'supplier-collaboration',
    label: 'Supplier Collaboration',
    icon: 'Handshake',
    agents: [
      { id: 'supplier-assistant', name: 'Supplier Assistant', description: 'Manage supplier communications and collaboration' },
    ],
  },
  {
    id: 'logistics-operations',
    label: 'Logistics Operations',
    icon: 'Truck',
    agents: [
      { id: 'dispatch-coordinator', name: 'Dispatch Coordinator', description: 'Coordinate dispatch and delivery operations' },
      { id: 'shipment-tracker', name: 'Shipment Tracker', description: 'Track shipments and provide status updates' },
      { id: 'warehouse-operator-agent', name: 'Warehouse Operator Agent', description: 'Assist with warehouse operations' },
      { id: 'small-parcel-agent', name: 'Small Parcel Agent', description: 'Manage small parcel shipments and tracking' },
      { id: 'ltl-agent', name: 'LTL Agent', description: 'Handle less-than-truckload freight operations' },
    ],
  },
  {
    id: 'procurement-inventory',
    label: 'Procurement & Inventory',
    icon: 'ShoppingBag',
    agents: [
      { id: 'procurement-copilot', name: 'Procurement Copilot', description: 'Assist with procurement processes' },
      { id: 'inventory-advisor', name: 'Inventory Advisor', description: 'Provide inventory management advice' },
    ],
  },
  {
    id: 'support-assurance',
    label: 'Support & Assurance',
    icon: 'Shield',
    agents: [
      { id: 'finance-specialist', name: 'Finance Specialist', description: 'Handle finance-related inquiries' },
      { id: 'exception-handler', name: 'Exception Handler', description: 'Manage exceptions and resolve issues' },
    ],
  },
]

// Flat list of all agents for easy lookup
export const aiAgents: AIAgent[] = aiAgentGroups.flatMap(group => group.agents)
