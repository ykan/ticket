import { CircleDot, CheckCircle2, XCircle, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Enums } from '@/lib/supabase.types'

const getStatusConfig = (status: Enums<'ticket_status'>) => {
  switch (status) {
    case 'Doing':
      return {
        icon: CircleDot,
        color: 'text-yellow-600 bg-yellow-500/2',
      }
    case 'Canceled':
      return {
        icon: XCircle,
        color: 'text-gray-600 bg-gray-500/2',
      }
    case 'Done':
      return {
        icon: CheckCircle2,
        color: 'text-green-600 bg-green-500/2',
      }
    default:
      return {
        icon: Clock,
        color: 'text-blue-600 bg-blue-500/2',
      }
  }
}

type TicketStatusProps = {
  status: Enums<'ticket_status'>
  className?: string
  showText?: boolean
}

export function TicketStatus({
  status,
  className,
  showText,
}: TicketStatusProps) {
  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center h-6 rounded',
        showText ? 'px-1' : 'w-6',
        config.color,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {showText && <span className="ml-1">{status}</span>}
    </div>
  )
}
