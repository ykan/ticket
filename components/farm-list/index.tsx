import { Tables } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useRootPath } from '@/lib/navigation'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { FarmMinerStatus } from '@/components/farm-miner-status'

export function FarmList() {
  const router = useRouter()
  const rootPath = useRootPath()

  const { data: farms = [], isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: async () => {
      const res = await request.get('/farms')
      return res.data as Tables<'farm'>[]
    },
  })

  const handleFarmClick = (farm: Tables<'farm'>) => {
    router.push(`${rootPath}/farm/${farm.id}`)
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">加载中...</div>
  }

  if (!farms.length) {
    return <div className="text-center text-muted-foreground">暂无农场</div>
  }

  return (
    <div>
      <div>矿场列表</div>
      {farms.map((farm) => (
        <div
          key={farm.id}
          className={cn(
            'py-3 px-4 hover:bg-muted/50 cursor-pointer transition-colors',
            'flex items-center gap-4'
          )}
          onClick={() => handleFarmClick(farm)}
        >
          <FarmMinerStatus status={farm.status} />
          <span>{farm.name}</span>
        </div>
      ))}
    </div>
  )
}
