"use client"

import Image from "next/image"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

export default function CommunityPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto mt-24 flex flex-col items-center px-4">
        <h1 className="mb-8 text-center text-4xl font-bold">
          OpenxAI Community
        </h1>
        <div className="mb-8 overflow-hidden rounded-2xl border bg-white p-4 shadow-lg">
          <Image 
            src="/openxai-discourse.png" 
            alt="OpenxAI Community"
            width={1200}
            height={800}
            className="rounded-xl"
            priority
          />
        </div>
        <Button 
          className="bg-blue-600 px-8 py-6 text-lg hover:bg-blue-700"
          onClick={() => window.open('https://openxai.discourse.group', '_blank')}
        >
          Join the OpenxAI Discourse Community
        </Button>
      </main>
    </>
  )
}