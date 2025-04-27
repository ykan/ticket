'use client'
import { useTranslations } from 'next-intl'

import { request } from '@/lib/request'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const t = useTranslations('ticket.list')
  const handleCreate = () => {
    request.post('/ticket', {
      title: 'test',
      description: `## 测试工单\n\`\`\`js\nconsole.log('test')\n\`\`\``,
      level: 'P1',
    })
  }

  return (
    <div>
      <div className="px-4 pt-3 pb-2 border-b-[0.5px]">{t('title')}</div>
      <div>
        <Button onClick={handleCreate}>创建工单</Button>
      </div>
    </div>
  )
}
