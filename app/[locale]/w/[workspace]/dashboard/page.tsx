'use client'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { Button } from '@/components/ui/button'
import { Tables } from '@/lib/supabase.types'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { TicketList } from '@/components/ticket-list'

export default function Dashboard() {
  const t = useTranslations('ticket.list')

  const { data, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const [res1, res2] = await Promise.all([
        request.get('/tickets?status=Todo'),
        request.get('/tickets?level=P0'),
      ])
      return {
        todoList: res1.data as Tables<'ticket'>[],
        p0List: res2.data as Tables<'ticket'>[],
      }
    },
  })

  const handleCreate = () => {
    request.post('/ticket', {
      title: '测试 P2 工单',
      description: `## 测试工单\n\`\`\`js\nconsole.log('test')\n\`\`\``,
      level: 'P2',
    })
  }

  const renderP0List = () => {
    if (!data?.p0List?.length) {
      return null
    }
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">P0 工单</div>
          <div className="text-sm text-gray-500">
            共 {data?.p0List.length} 条
          </div>
        </div>
        <TicketList tickets={data?.p0List || []} />
      </div>
    )
  }

  const renderTodoList = () => {
    if (!data?.todoList?.length) {
      return null
    }
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">待处理工单</div>
          <div className="text-sm text-gray-500">
            共 {data?.todoList.length} 条
          </div>
        </div>
        <TicketList tickets={data?.todoList || []} />
      </div>
    )
  }

  return (
    <PageView loading={isLoading}>
      <PageHead>
        <div className="text-lg font-semibold flex-1">{t('title')}</div>
        <div>
          <Button size="sm" onClick={handleCreate}>
            创建工单
          </Button>
        </div>
      </PageHead>
      <PageBody>
        {renderP0List()}
        {renderTodoList()}
      </PageBody>
    </PageView>
  )
}
