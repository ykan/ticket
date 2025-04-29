import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type PageProps = {
  children?: React.ReactNode
  className?: string
}

export function PageHead({ children, className }: PageProps) {
  return (
    <div
      className={cn(
        'border-b-[0.5px] h-12 flex px-2 items-center bg-background',
        className
      )}
    >
      {children}
    </div>
  )
}
export function PageBody({ children, className }: PageProps) {
  return <div className={cn('flex-1 overflow-auto', className)}>{children}</div>
}

type PageViewProps = {
  loading?: boolean
  children: React.ReactNode
}
export function PageView({ loading, children }: PageViewProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <div className="h-full w-full flex flex-col">{children}</div>
}
