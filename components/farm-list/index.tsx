import { Tables } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useRootPath } from '@/lib/navigation'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { FarmMinerStatus } from '@/components/farm-miner-status'

export function FarmList({ className }: { className?: string }) {
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

  const renderList = () => {
    if (isLoading) {
      return <div className="text-center text-muted-foreground">加载中...</div>
    }

    if (!farms.length) {
      return <div className="text-center text-muted-foreground">暂无农场</div>
    }
    return farms.map((farm) => (
      <div
        key={farm.id}
        className={cn(
          'py-1 px-3 hover:bg-muted/50 cursor-pointer transition-colors rounded-md',
          'flex items-center gap-2'
        )}
        onClick={() => handleFarmClick(farm)}
      >
        <FarmMinerStatus status={farm.status} />
        <span className="text-sm">{farm.name}</span>
      </div>
    ))
  }

  return <div className={cn('space-y-1', className)}>{renderList()}</div>
}
