'use client'
import { cn } from '@/lib/utils'
import { usePathname, Link } from '@/lib/navigation'

type MenuItemProps = {
  icon: React.ReactNode
  label: string
  href: string
}

export function MenuItem({ icon, label, href }: MenuItemProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

type MenuGroupProps = {
  title: string
  children: React.ReactNode
}

export function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-2 text-xs font-medium text-sidebar-foreground/60">
        {title}
      </div>
      {children}
    </div>
  )
}
