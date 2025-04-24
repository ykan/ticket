import { UserButton } from '@clerk/nextjs'
import { Ticket } from 'lucide-react'

import { MenuGroup, MenuItem } from '@/components/menu'

export default function TicketLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-[270px_1fr] min-h-screen bg-sidebar">
      {/* 侧边栏 */}
      <aside className="bg-sidebar p-4 flex flex-col gap-6">
        {/* 用户信息 */}
        <div className="px-2 h-7">
          <UserButton showName />
        </div>

        {/* 工单管理 */}
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
      </aside>

      {/* 主内容区域 */}
      <main className="flex flex-col m-2 rounded-s border-[0.5px] border-black/[0.0375] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.0375)]">
        {children}
      </main>
    </div>
  )
}
