import { Tables } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { TicketLevel } from '@/components/ticket-level'
import { TicketStatus } from '@/components/ticket-status'
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
            'flex items-center'
          )}
          onClick={() => handleTicketClick(ticket)}
        >
          <div>
            <TicketStatus status={ticket.status} />
          </div>
          <div className="px-2 min-w-10 text-sm">#{ticket.no}</div>
          <div className="pr-2">
            <TicketLevel level={ticket.level} />
          </div>
          <div className="flex-1 min-w-0">{ticket.title}</div>
        </div>
      ))}
    </div>
  )
}
