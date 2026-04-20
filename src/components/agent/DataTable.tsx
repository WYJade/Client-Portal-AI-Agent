import { useNavigate } from 'react-router-dom'

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
  isLink?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  maxRows?: number
  onRowClick?: (row: any) => void
  rowLinkPath?: string
  rowLinkKey?: string
}

export default function DataTable({ columns, data, maxRows = 5, onRowClick, rowLinkPath, rowLinkKey }: DataTableProps) {
  const navigate = useNavigate()
  const displayData = maxRows ? data.slice(0, maxRows) : data

  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row)
    } else if (rowLinkPath) {
      const path = rowLinkKey ? `${rowLinkPath}/${row[rowLinkKey]}` : rowLinkPath
      navigate(path)
    }
  }

  const isClickable = onRowClick || rowLinkPath

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`px-3 py-2 font-medium ${
                  index === 0 && isClickable ? 'text-purple-400' : 'text-gray-400'
                } ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {displayData.map((row, index) => (
            <tr 
              key={index} 
              className={`hover:bg-gray-800/50 ${isClickable ? 'cursor-pointer hover:bg-purple-600/10' : ''}`}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={`px-3 py-2 ${
                    colIndex === 0 && isClickable 
                      ? 'text-purple-400 font-medium hover:text-purple-300 underline decoration-purple-400/30 underline-offset-2' 
                      : 'text-gray-300'
                  } ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > maxRows && (
        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-800 border-t border-gray-700">
          Showing {maxRows} of {data.length} items
        </div>
      )}
    </div>
  )
}
