'use client'
import { Button } from '@/components/ui/button'

import { request } from '@/lib/request'

let i = 20
export function CreateButton({ farmId }: { farmId: string }) {
  const handleCreate = () => {
    request.post('/miner', {
      farm_id: farmId,
      ip_address: `192.168.${i}.101`,
      mac_address: '00:1B:44:11:3A:D1',
      hostname: `MINER-NMG-${i++}`,
      model: 'Avalon 122',
      manufacturer: 'Canaan',
      serial_number: 'CAN202306001',
      status: 'Online',
      is_mining: true,
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
    <Button size="sm" onClick={handleCreate}>
      创建矿机
    </Button>
  )
}
