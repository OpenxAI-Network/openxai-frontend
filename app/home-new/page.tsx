import { Header } from "@/components/Header"

export default function HomeNewPage() {
  return (
    <>  
      <Header />
      <div className="container mt-24 flex min-h-screen flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-3xl p-24 rounded-[32px] bg-gradient-to-br from-[#E8F3FF] via-[#E8F0FF] to-[#FFE8F6]">
          <h1 className="text-[80px] leading-tight font-medium">OpenxAI</h1>
          <h2 className="text-[40px] leading-tight mt-4">
            Accelerate the AI industry<br />
            without corporations
          </h2>
          
          <div className="flex items-center gap-12 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-500/90 flex items-center justify-center">
                ✕
              </div>
              <span className="text-xl text-gray-800">No VC backed, No Company</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/90 flex items-center justify-center">
                ✓
              </div>
              <span className="text-xl text-gray-800">Anyone can build, train</span>
            </div>
          </div>

          <a 
            href="/genesis" 
            className="mt-12 px-8 py-3 bg-[#4169E1] text-white rounded-lg text-lg hover:bg-[#3154b4] transition-colors"
          >
            Genesis
          </a>
        </div>
      </div>
    </>
  )
}