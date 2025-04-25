import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'
import { Ticket } from 'lucide-react'

import { MenuGroup, MenuItem } from '@/components/menu'
import LangSwitcher from '@/components/lang-switcher'
import ThemeSwitcher from '@/components/theme-switcher'

export default function TicketLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-[270px_1fr] min-h-screen bg-sidebar">
      {/* 侧边栏 */}
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

        {/* 组织切换器 - 固定在底部 */}
        <div className="mt-auto pt-3 border-t border-sidebar-border flex justify-between">
          <UserButton showName />
          <div>
            <ThemeSwitcher />
            <LangSwitcher />
          </div>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex flex-col m-2 rounded-s border-[0.5px] border-black/[0.0375] bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.0375)]">
        {children}
      </main>
    </div>
  )
}
