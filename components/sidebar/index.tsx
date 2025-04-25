'use client'
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'
import { Languages, Moon, Sun, Ticket } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

import { MenuGroup, MenuItem } from '@/components/menu'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
        <MenuGroup title="工单管理">
          <MenuItem
            icon={<Ticket className="w-4 h-4" />}
            label="所有工单"
            href="/ticket/list"
          />
          <MenuItem
            icon={<Ticket className="w-4 h-4" />}
            label="所有矿场"
            href="/farm/list"
          />
        </MenuGroup>
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
