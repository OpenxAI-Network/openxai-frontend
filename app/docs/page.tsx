import { Header } from "@/components/Header"

export default function DocPage() {
  return (
    <>
      <Header />
      <div className="container flex min-h-screen flex-col items-center">
        <iframe
          src="https://openxai-docs.vercel.app/"
          title="OpenXAI Documentation"
          loading="lazy"
          style={{ border: 0 }}
          className="h-screen w-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </>
  )
}