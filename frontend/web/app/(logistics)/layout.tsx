import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logistics Dashboard | SmartTani',
  description: 'Panel logistik untuk manajemen pengiriman SmartTani',
}

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b bg-slate-50/50">
        <div className="container flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">Logistik Mode</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
