'use client'
// import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'
import { MDViewer } from '@/components/md-viewer'

export default function Ticket() {
  // const t = useTranslations('ticket.detail')
  const { no } = useParams<{ no: string }>()
  const { data = {} } = useQuery({
    queryKey: ['ticket', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}`)
      return res
    },
  })
  const detail = data as Tables<'ticket'>
  return (
    <div>
      <div className="px-4 pt-3 pb-2 border-b-[0.5px]">
        <span className="px-1">{detail?.status}</span>
        <span>{detail?.title}</span>
      </div>
      <div className="p-10">
        <MDViewer content={detail?.description || ''} />
      </div>
    </div>
  )
}
