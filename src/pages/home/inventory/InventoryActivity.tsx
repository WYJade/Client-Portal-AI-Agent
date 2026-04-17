import { useState } from 'react'
import { ChevronRight, ChevronDown, Download, Search } from 'lucide-react'

interface InventoryItem {
  id: string
  facility: string
  itemId: string
  description: string
  shortDescription: string
  title: string
  uom: string
  goodsType: string
  currentBalance: number
  beginningBalance: number
}

const mockData: InventoryItem[] = [
  { id: '1', facility: '146-El Paso', itemId: '43S310R', description: '43S310R', shortDescription: '48" x 40"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 38220, beginningBalance: 0 },
  { id: '2', facility: '146-El Paso', itemId: '43Q851G', description: '43Q851G', shortDescription: '48" x 40"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 491, beginningBalance: 0 },
  { id: '3', facility: '146-El Paso', itemId: '50S551G', description: '50S551G', shortDescription: '52" x 48"', title: 'TCL NORTH AMERICA', uom: 'FA', goodsType: 'GOOD', currentBalance: 457, beginningBalance: 0 },
  { id: '4', facility: '146-El Paso', itemId: '55S451', description: '55S451', shortDescription: '56" x 48"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 0, beginningBalance: 0 },
  { id: '5', facility: '146-El Paso', itemId: '55Q851G', description: '55Q851G', shortDescription: '58" x 48"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 549, beginningBalance: 0 },
  { id: '6', facility: '146-El Paso', itemId: '55S551G', description: '55S551G', shortDescription: '56" x 48"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 388, beginningBalance: 0 },
  { id: '7', facility: '146-El Paso', itemId: '65S451', description: '65S451', shortDescription: '65" x 46"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'DAMAGE', currentBalance: 16, beginningBalance: 0 },
  { id: '8', facility: '146-El Paso', itemId: '146-El Paso', description: '65S451', shortDescription: '65" x 48"', title: 'TCL NORTH AMERICA', uom: 'FA', goodsType: 'GOOD', currentBalance: 15457, beginningBalance: 0 },
  { id: '9', facility: '146-El Paso', itemId: '65Q651G', description: '65Q651G', shortDescription: '65" x 48"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 1146, beginningBalance: 0 },
  { id: '10', facility: '146-El Paso', itemId: '65S551G', description: '65S551G', shortDescription: '65" x 48"', title: 'TCL NORTH AMERICA', uom: 'EA', goodsType: 'GOOD', currentBalance: 2, beginningBalance: 0 },
]

export default function InventoryActivity() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) newExpanded.delete(id)
    else newExpanded.add(id)
    setExpandedRows(newExpanded)
  }

  // Pagination variables for future use
  void rowsPerPage

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          {/* Placeholder for filters */}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
            <Download size={14} />
            Export to Excel
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-purple-600 rounded hover:bg-purple-700">
            <Search size={14} />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b border-gray-200">
              <th className="w-10 px-3 py-3"></th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Facility</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Item ID</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Description</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Short Description</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">UOM</th>
              <th className="px-3 py-3 text-left font-medium text-gray-600">Goods Type</th>
              <th className="px-3 py-3 text-right font-medium text-gray-600">Current Balance</th>
              <th className="px-3 py-3 text-right font-medium text-gray-600">Beginning Balance</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-3 py-3">
                  <button
                    onClick={() => toggleRowExpand(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedRows.has(item.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </td>
                <td className="px-3 py-3 text-gray-900">{item.facility}</td>
                <td className="px-3 py-3 text-gray-900">{item.itemId}</td>
                <td className="px-3 py-3 text-gray-900">{item.description}</td>
                <td className="px-3 py-3 text-gray-900">{item.shortDescription}</td>
                <td className="px-3 py-3 text-gray-900">{item.title}</td>
                <td className="px-3 py-3 text-gray-900">{item.uom}</td>
                <td className="px-3 py-3 text-gray-900">{item.goodsType}</td>
                <td className="px-3 py-3 text-right text-gray-900">{item.currentBalance.toLocaleString()}</td>
                <td className="px-3 py-3 text-right text-gray-900">{item.beginningBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-white text-sm">
        <div className="text-gray-500">
          0 of 109 row(s) selected.
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-gray-500">Page 1 of 11</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">«</button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">‹</button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">›</button>
            <button className="px-2 py-1 text-gray-400 hover:text-gray-600">»</button>
          </div>
        </div>
      </div>
    </div>
  )
}
