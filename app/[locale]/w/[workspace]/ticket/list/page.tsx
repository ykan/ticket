'use client'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'

export default function TicketList() {
  const t = useTranslations('ticket.list')
  const { data: list } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await request.get('/ticket/list')
      return res.data
    },
  })
  return (
    <div>
      <div className="px-4 pt-3 pb-2 border-b-[0.5px]">{t('title')}</div>
      <ul className="px-4 pt-3">
        {list?.map((item: Tables<'ticket'>) => (
          <li key={item.id}>
            <span className="px-1">{item.priority}</span>
            <span className="px-1">{item.status}</span>
            <span className="px-1">{item.title}</span>
            <span className="px-1">{item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
