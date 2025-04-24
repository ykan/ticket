'use client'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'

// 获取工单列表
export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await request.get('/ticket/list')
      return res.data
    },
  })
}

export default function TicketList() {
  const t = useTranslations('ticket.list')
  const { data: list } = useTickets()
  return (
    <div className="p-5">
      <div>{t('title')}</div>
      <ul>
        {list?.map((item: Tables<'ticket'>) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>{item.desc}</span>
            <span>{item.status}</span>
            <span>{item.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
