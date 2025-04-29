import { Sidebar } from '@/components/sidebar'

export default function TicketLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid grid-cols-[244px_1fr] h-screen bg-sidebar">
      <Sidebar />
      <main className="flex flex-col m-2 rounded-s border-[0.5px] border-black/[0.0375] bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.0375)] overflow-auto">
        {children}
      </main>
    </div>
  )
}
