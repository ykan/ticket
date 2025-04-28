import { Tables } from '@/lib/supabase.types'
import { FarmMinerStatus } from './farm-miner-status'
import { cn } from '@/lib/utils'

type FarmDisplayProps = {
  farm: Tables<'farm'>
  miners?: Tables<'miner'>[]
  className?: string
}

export function FarmDisplay({
  farm,
  miners = [],
  className,
}: FarmDisplayProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className="text-lg font-semibold flex items-center">
          <FarmMinerStatus className="mr-4" status={farm.status} />
          <span className="font-medium">{farm.name}</span>
        </h2>
        <div className="text-sm text-muted-foreground">
          <div>地址：{farm.location}</div>
          <div>电费：{farm.eletricity_fee}</div>
        </div>
      </div>

      {miners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {miners.map((miner) => (
            <div
              key={miner.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-center mb-2">
                <FarmMinerStatus className="mr-4" status={miner.status} />
                <span className="font-medium">{miner.hostname}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>IP: {miner.ip_address}</div>
                <div>{miner.is_mining ? '挖矿中' : '未工作'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
