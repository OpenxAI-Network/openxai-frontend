import { SideMenu } from "@/components/genesis/SideMenu"

export function MobileResponsiveWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
      <SideMenu />
      <main className="min-w-[320px] flex-1 overflow-x-auto p-4 pt-28 [@media(max-width:500px)]:pt-24 [@media(max-width:960px)]:pt-48 [@media(min-width:960px)]:ml-[234px] [@media(min-width:960px)]:p-8 [@media(min-width:960px)]:pt-32">
        <div className="px-safe">
          {children}
        </div>
      </main>
    </div>
  )
}