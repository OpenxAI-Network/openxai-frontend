import React from "react"
import Image from "next/image"
import NextLink from "next/link"
import HeaderBackground from "@/public/HeaderBackground.png"
import OpenmeshFull from "@/public/OpenmeshFull.png"
import { Button } from "@/components/ui/button"
import { Title } from "@/components/base"
import { Progress } from "@/components/ui/progress"
import { GPUChart } from "@/components/GPUChart"

export default function IndexPage() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 -z-50 flex h-[750px] place-content-center overflow-hidden bg-black">
        <Image
          className="w-full object-none"
          alt="Header background"
          src={HeaderBackground}
          height={750}
        />
      </div>
      <section className="container grid items-center gap-6 py-10 pb-8">
        <div className="ml-12 flex w-full flex-col items-start gap-4">
          <div className="pt-12" />
          <Image
            className="h-[50px] w-[225px] md:h-[66px] md:w-[300px]"
            alt="Openmesh logo"
            src={OpenmeshFull}
            height={66}
            width={300}
          />
          <div className="pt-8" />
          <h1 className="font-inter text-6xl font-bold md:text-8xl">
            <span className="bg-gradient-to-r from-[#4776E6] via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
              Decentralized AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#4776E6] via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
              Revolution Begins
            </span>
          </h1>
          <div className="pt-8" />
          <p className="text-xl text-gray-300">Join the future of AI infrastructure at 40% lower cost</p>
          <div className="pt-8" />
          <Button
            className="w-64 bg-[#4776E6] text-lg hover:bg-[#3665D5]"
            asChild
          >
            <NextLink href="#GET">Get $DEEP</NextLink>
          </Button>
          <div className="pt-12" />
        </div>

        <div className="mt-12 h-[500px] w-full">
          <GPUChart />
        </div>

        <section className="container grid items-center gap-6 py-10 pb-8">
          <div className="flex flex-col place-items-center">
            <Progress className="h-6 w-full max-w-2xl bg-gray-800" value={5} />
            <span className="text-lg">50,000/1,000,000 DEEP</span>
          </div>
          
          <div className="text-center">
            <p className="mb-4 text-xl text-gray-300">
              Early investors get exclusive access to decentralized GPU infrastructure at up to 40% below market rates
            </p>
            <p className="text-lg text-gray-400">
              Limited time presale - Join the revolution now
            </p>
          </div>
          
          <Title id="GET">Get $DEEP</Title>
          <iframe
            src="https://app.uniswap.org/#/swap?outputCurrency=0xc7b10907033Ca6e2FC00FCbb8CDD5cD89f141384"
            className="w-full rounded-lg"
            height="660px"
          />
        </section>
      </section>
    </>
  )
}