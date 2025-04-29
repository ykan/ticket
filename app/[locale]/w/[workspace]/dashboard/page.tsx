'use client'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { TicketList } from '@/components/ticket-list'
import { TicketDialog } from '@/components/ticket-dialog'
import { cn } from '@/lib/utils'

function DashboardTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('py-2 px-10 bg-muted border-b-[0.5px]', className)}>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const t = useTranslations('ticket.list')

  const { data, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const [res1, res2] = await Promise.all([
        request.get('/tickets'),
        request.get('/tickets?level=P0'),
      ])
      return {
        allList: res1.data as Tables<'ticket'>[],
        p0List: res2.data as Tables<'ticket'>[],
      }
    },
  })

  const renderP0List = () => {
    if (!data?.p0List?.length) {
      return null
    }
    return (
      <div className="flex flex-col">
        <DashboardTitle>
          <span className="font-bold">P0 工单</span>
          <span className="text-red-600/50 ml-3 text-[12px]">
            请尽快处理，文案可以再想想
          </span>
        </DashboardTitle>
        <TicketList tickets={data?.p0List || []} />
      </div>
    )
  }

  const renderAllList = () => {
    if (!data?.allList?.length) {
      return null
    }
    return (
      <div className="flex flex-col">
        <DashboardTitle
          className={data?.p0List?.length ? 'border-t-[0.5px]' : ''}
        >
          <span className="font-bold">所有工单</span>
        </DashboardTitle>
        <TicketList tickets={data?.allList || []} />
      </div>
    )
  }

  return (
    <PageView loading={isLoading}>
      <PageHead>
        <div className="text-lg font-semibold flex-1">{t('title')}</div>
        <div>
          <TicketDialog />
        </div>
      </PageHead>
      <PageBody>
        {renderP0List()}
        {renderAllList()}
      </PageBody>
    </PageView>
  )
}
