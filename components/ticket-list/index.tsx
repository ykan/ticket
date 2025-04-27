import { Tables } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { TicketLevel } from '@/components/ticket-level'
import { useRootPath } from '@/lib/navigation'

type TicketListProps = {
  tickets: Tables<'ticket'>[]
}

export function TicketList({ tickets }: TicketListProps) {
  const router = useRouter()
  const rootPath = useRootPath()

  const handleTicketClick = (ticket: Tables<'ticket'>) => {
    router.push(`${rootPath}/ticket/${ticket.no}`)
  }

  return (
    <div className="divide-y">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className={cn(
            'py-3 px-4 hover:bg-muted/50 cursor-pointer transition-colors',
            'flex items-center gap-4'
          )}
          onClick={() => handleTicketClick(ticket)}
        >
          <TicketLevel level={ticket.level} />
          <div className="w-15">#{ticket.no}</div>
          <div className="w-20">{ticket.status}</div>
          <div className="flex-1 min-w-0">{ticket.title}</div>
        </div>
      ))}
    </div>
  )
}
