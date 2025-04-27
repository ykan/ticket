'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { request } from '@/lib/request'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { Tables } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'

export default function Farm() {
  const t = useTranslations('farm.list')
  const { id } = useParams<{ id: string }>()
  const { data: miners = [], isLoading } = useQuery({
    queryKey: ['miners', id],
    queryFn: async () => {
      const res = await request.get(`/miners?farm_id=${id}`)
      return res.data as Tables<'miner'>[]
    },
  })

  const handleCreate = () => {
    request.post('/miner', {
      farm_id: id,
      ip_address: '192.168.3.101',
      mac_address: '00:1B:44:11:3A:D1',
      hostname: 'MINER-NMG-003',
      model: 'Avalon 1366',
      manufacturer: 'Canaan',
      serial_number: 'CAN202306001',
      status: 'Online',
      is_mining: false,
      last_seen: new Date('2024-11-29T08:15:00'),
      firmware: {
        version: '1.1.0',
        type: 'official',
      },
      location: 'Rack-C01-01',
      notes: '运行正常',
    })
  }
  return (
    <PageView loading={isLoading}>
      <PageHead>
        <div className="text-lg font-semibold flex-1">{t('title')}</div>
        <div>
          <Button size="sm" onClick={handleCreate}>
            创建矿机
          </Button>
        </div>
      </PageHead>
      <PageBody>
        <div className="divide-y">
          {miners.map((miner) => (
            <div
              key={miner.id}
              className={cn(
                'py-3 px-4 hover:bg-muted/50 transition-colors',
                'flex items-center gap-4'
              )}
            >
              <div className="w-32 truncate">{miner.hostname}</div>
              <div className="w-32">{miner.ip_address}</div>
              <div className="w-24">{miner.model}</div>
              <div
                className={cn(
                  'w-20',
                  miner.status === 'Online' && 'text-green-500',
                  miner.status === 'Offline' && 'text-gray-500',
                  miner.status === 'Error' && 'text-red-500'
                )}
              >
                {miner.status}
              </div>
              <div className="flex-1 min-w-0 text-sm text-muted-foreground">
                {miner.notes}
              </div>
              <div className="w-32 text-sm text-muted-foreground">
                {miner.location}
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </PageView>
  )
}
