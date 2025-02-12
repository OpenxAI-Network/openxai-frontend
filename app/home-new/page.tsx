import { Header } from "@/components/Header"

export default function HomeNewPage() {
  return (
    <>
      <Header />
      <div className="container mt-24 flex min-h-screen flex-col items-center">
        <div className="flex max-w-3xl flex-col items-center rounded-[32px] bg-gradient-to-br from-[#E8F3FF] via-[#E8F0FF] to-[#FFE8F6] p-24 text-center">
          <h1 className="text-[80px] font-medium leading-tight">OpenxAI</h1>
          <h2 className="mt-4 text-[40px] leading-tight">
            Accelerate the AI industry<br />
            without corporations
          </h2>

          <div className="mt-8 flex items-center gap-12">
            <div className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-red-500/90">
                ✕
              </div>
              <span className="text-xl text-gray-800">No VC backed, No Company</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-green-500/90">
                ✓
              </div>
              <span className="text-xl text-gray-800">Anyone can build, train</span>
            </div>
          </div>

          <a
            href="/genesis"
            className="mt-12 rounded-lg bg-[#4169E1] px-8 py-3 text-lg text-white transition-colors hover:bg-[#3154b4]"
          >
            Genesis
          </a>
        </div>
      </div>
    </>
  )
}