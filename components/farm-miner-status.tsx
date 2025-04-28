import { Enums } from '@/lib/supabase.types'
import { cn } from '@/lib/utils'

const getColorByStatus = (status: Enums<'farm_miner_status'>) => {
  switch (status) {
    case 'Error':
      return 'bg-red-500'
    case 'Partial':
      return 'bg-yellow-500'
    default:
      return 'bg-green-500'
  }
}

type FarmMinerStatusProps = {
  status: Enums<'farm_miner_status'>
  className?: string
}

export function FarmMinerStatus({ status, className }: FarmMinerStatusProps) {
  return (
    <span
      className={cn(
        'rounded inline-flex items-center w-2 h-2',
        getColorByStatus(status),
        className
      )}
    />
  )
}
