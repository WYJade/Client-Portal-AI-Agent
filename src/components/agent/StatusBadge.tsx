interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  label: string
}

const statusStyles = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  pending: 'bg-gray-100 text-gray-700',
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {label}
    </span>
  )
}
