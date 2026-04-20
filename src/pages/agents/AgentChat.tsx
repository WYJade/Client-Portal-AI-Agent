import { useOutletContext } from 'react-router-dom'
import { AIAgent } from '../../types/menu'
import CustomerAgentPage from './CustomerAgentPage'
import SalesAssistantPage from './SalesAssistantPage'
import SupplierAssistantPage from './SupplierAssistantPage'
import DispatchCoordinatorPage from './DispatchCoordinatorPage'
import ShipmentTrackerPage from './ShipmentTrackerPage'
import WarehouseOperatorPage from './WarehouseOperatorPage'
import ProcurementCopilotPage from './ProcurementCopilotPage'
import InventoryAdvisorPage from './InventoryAdvisorPage'
import FinanceSpecialistPage from './FinanceSpecialistPage'
import ExceptionHandlerPage from './ExceptionHandlerPage'
import QuoteAgentPage from './QuoteAgentPage'
import SmallParcelAgentPage from './SmallParcelAgentPage'
import LTLAgentPage from './LTLAgentPage'

interface AgentChatContext {
  selectedAgentId: string
  agents: AIAgent[]
}

const agentComponents: Record<string, React.ComponentType> = {
  'customer-agent': CustomerAgentPage,
  'sales-assistant': SalesAssistantPage,
  'supplier-assistant': SupplierAssistantPage,
  'dispatch-coordinator': DispatchCoordinatorPage,
  'shipment-tracker': ShipmentTrackerPage,
  'warehouse-operator-agent': WarehouseOperatorPage,
  'procurement-copilot': ProcurementCopilotPage,
  'inventory-advisor': InventoryAdvisorPage,
  'finance-specialist': FinanceSpecialistPage,
  'exception-handler': ExceptionHandlerPage,
  'quote-agent': QuoteAgentPage,
  'small-parcel-agent': SmallParcelAgentPage,
  'ltl-agent': LTLAgentPage,
}

export default function AgentChat() {
  const { selectedAgentId } = useOutletContext<AgentChatContext>()
  
  const AgentComponent = agentComponents[selectedAgentId]
  
  if (AgentComponent) {
    return <AgentComponent />
  }

  // Fallback for unknown agents
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-gray-500">
        <p>Agent not found</p>
      </div>
    </div>
  )
}
