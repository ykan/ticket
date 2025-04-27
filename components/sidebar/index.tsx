'use client'
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'
import { Languages, Moon, Sun, Gauge } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@/lib/navigation'
import { cn } from '@/lib/utils'

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button onClick={toggleTheme} variant="ghost" size="sm">
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}

function LangSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = (changeLocale: string) => {
    router.push(pathname.replace(locale, changeLocale))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">
        <DropdownMenuRadioGroup value={locale} onValueChange={toggleLocale}>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DashboardItem() {
  const pathname = usePathname()
  const isActive = pathname.includes('/dashboard')

  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
      )}
    >
      <Gauge className="w-5 h-5" />
      <span>工作台</span>
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="p-4 flex flex-col">
      {/* workspace */}
      <div className="h-8">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
        />
      </div>

      {/* 工单管理 */}
      <div className="flex-1">
        <div className="py-4">
          <DashboardItem />
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-sidebar-border flex justify-between">
        <UserButton showName />
        <div className="flex gap-1">
          <ThemeSwitcher />
          <LangSwitcher />
        </div>
      </div>
    </aside>
  )
}
