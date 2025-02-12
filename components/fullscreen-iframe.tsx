"use client"

import IframeResizer from "@iframe-resizer/react"

export function FullscreenIframe({ src }: { src: string }) {
  return (
    <div className="absolute top-0 h-screen w-full">
      <IframeResizer
        license="GPLv3"
        src={src}
        className="h-full w-full"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}
