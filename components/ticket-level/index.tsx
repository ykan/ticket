import { Enums } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'

const getColorByLevel = (level: Enums<'ticket_level'>) => {
  switch (level) {
    case 'P0':
      return 'bg-red-500/10 text-red-600'
    case 'P1':
      return 'bg-yellow-500/10 text-yellow-600'
    default:
      return 'bg-blue-500/10 text-blue-600'
  }
}

type TicketLevelProps = {
  level: Enums<'ticket_level'>
  className?: string
}

export function TicketLevel({ level, className }: TicketLevelProps) {
  return (
    <div
      className={cn(
        'text-xs px-2 py-1 rounded inline-flex items-center w-8 h-8',
        getColorByLevel(level),
        className
      )}
    >
      {level}
    </div>
  )
}
