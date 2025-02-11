import { Header } from "@/components/Header"

export default function ModelsPage() {
  return (
    <>
      <Header />
      <div className="container flex min-h-screen flex-col items-center">
        <iframe
          src="https://studio.openxai.org/app-store"
          title="OpenxAI Model Studio"
          loading="lazy"
          style={{ border: 0 }}
          className="h-screen w-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </>
  )
} 