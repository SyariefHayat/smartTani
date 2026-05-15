import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | SmartTani',
  description: 'Panel admin untuk manajemen platform SmartTani',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b bg-slate-50/50">
        <div className="container flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            {/* Admin specific header items could go here */}
            <span className="text-sm font-medium text-muted-foreground">Administrator Mode</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
