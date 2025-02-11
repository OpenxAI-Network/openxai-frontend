import { Header } from "@/components/Header"

export default function IndexPage() {
  return (
    <>
      <Header />
      <div className="container flex min-h-screen flex-col items-center">
        <iframe
          src="https://exuberant-deck-437452.framer.app/"
          title="OpenxAI Initiative"
          loading="lazy"
          style={{ border: 0 }}
          className="h-screen w-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </>
  )
}