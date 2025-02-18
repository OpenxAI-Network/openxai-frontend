import { FullscreenIframe } from "@/components/fullscreen-iframe"
import { Header } from "@/components/Header"
import { redirect } from 'next/navigation'

export default function IndexPage() {
  redirect('/genesis')

//  return (
//    <>
//      <FullscreenIframe src="https://exuberant-deck-437452.framer.app/" />
//    </>
//  )
}
