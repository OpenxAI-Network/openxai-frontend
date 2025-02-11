import { Header } from "@/components/Header"

export default function CommunityPage() {
  return (
    <>
      <Header />
      <div className="m-0 min-h-screen w-full p-0">
        <iframe
          src="https://openxai.discourse.group/"
          title="OpenxAI Community"
          loading="lazy"
          style={{ border: 0, margin: 0, padding: 0 }}
          className="h-screen w-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </>
  )
}