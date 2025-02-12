import { FullscreenIframe } from "@/components/fullscreen-iframe"
import { Header } from "@/components/Header"

export default function IndexPage() {
  return (
    <>
      <Header />
      <FullscreenIframe src="https://exuberant-deck-437452.framer.app/" />
    </>
  )
}
