import { SideMenu } from "@/components/genesis/SideMenu"

export function MobileResponsiveWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
      <SideMenu />
      <main className="min-w-[320px] flex-1 overflow-x-auto px-2 pt-28 
        [@media(max-width:500px)]:pt-24 
        [@media(max-width:960px)]:pt-48 
        [@media(min-width:960px)]:ml-[234px] 
        [@media(min-width:960px)]:px-4 
        [@media(min-width:960px)]:pt-16">
        <div>
          {children}
        </div>
      </main>
    </div>
  )
}