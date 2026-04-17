interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  label: string
}

const statusStyles = {
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-gray-500/20 text-gray-400',
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {label}
    </span>
  )
}
