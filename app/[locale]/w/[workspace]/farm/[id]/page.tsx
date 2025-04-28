'use client'

import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { request } from '@/lib/request'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { Tables } from '@/lib/supabase.types'
import { FarmDisplay } from '@/components/farm-display'

export default function Farm() {
  const t = useTranslations('farm.list')
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['farm', id],
    queryFn: async () => {
      const [res1, res2] = await Promise.all([
        request.get(`/miners?farm_id=${id}`),
        request.get(`/farm/${id}`),
      ])
      return {
        miners: res1.data as Tables<'miner'>[],
        farm: res2.data as Tables<'farm'>,
      }
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
        {data?.farm ? (
          <FarmDisplay
            className="p-10"
            farm={data?.farm}
            miners={data?.miners}
          />
        ) : null}
      </PageBody>
    </PageView>
  )
}
