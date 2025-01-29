import React from "react"
import Image from "next/image"
import NextLink from "next/link"
import aiven from "@/public/aiven.svg"
import aragon from "@/public/aragon.png"
import chainlink from "@/public/chainlink.svg"
import digitalocean from "@/public/digitalocean.svg"
import equinix from "@/public/equinix.svg"
import fantom from "@/public/fantom.png"
import HeaderBackground from "@/public/HeaderBackground.png"
import hivelocityFull from "@/public/hivelocity-full.svg"
import hivelocity from "@/public/hivelocity.svg"
import OpenmeshLogo from "@/public/logo.svg"
import mongodb from "@/public/mongodb.svg"
import OpenmeshFull from "@/public/OpenmeshFull.png"
import partners from "@/public/partners.svg"
import polygon from "@/public/polygon.png"
import singularitynet from "@/public/singularitynet.svg"
import snowflake from "@/public/snowflake.svg"
import tokenChart from "@/public/token-chart.png"
import validationcloud from "@/public/validationcloud.png"
import vultr from "@/public/vultr.svg"

import { Button } from "@/components/ui/button"
import { Link, ListItem, Subtitle, Text, Title } from "@/components/base"
import Reserved from "@/components/custom/reserved"
import Tickets from "@/components/custom/tickets"
import { Progress } from "@/components/ui/progress"

export default function IndexPage() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 -z-50 flex h-[500px] place-content-center overflow-hidden bg-black">
        <Image
          className="w-full object-none"
          alt="Header background"
          src={HeaderBackground}
          height={500}
        />
      </div>
      <section className="container grid items-center gap-6 py-10 pb-8">
        <div className="ml-12 flex w-full flex-col items-start gap-2">
          <div className="pt-6" />
          <Image
            className="h-[50px] w-[225px] md:h-[66px] md:w-[300px]"
            alt="Openmesh logo"
            src={OpenmeshFull}
            height={66}
            width={300}
          />
          <div className="pt-6" />
          <h1 className="whitespace-break-spaces text-4xl text-secondary md:text-6xl">
            Deeplink
          </h1>
          <div className="pt-2" />
          <Button
            className="w-64 bg-blue-600 text-lg hover:bg-blue-800"
            asChild
          >
            <NextLink href="#GET">Get $DEEP</NextLink>
          </Button>
          <div className="pt-1" />
        </div>
        <section className="container absolute inset-x-0 top-[475px] grid items-center gap-6 py-10 pb-8">
          <div className="flex flex-col place-items-center">
          <Progress className="h-6" value={5} />
          <span>50,000/1,000,000 DEEP</span>
          </div>
          <Title>Explain Deeplink</Title>
          <Text>Vision, tokennomics, etc.</Text>
          <Title id="GET">Get $DEEP</Title>
          <iframe
            src="https://app.uniswap.org/#/swap?outputCurrency=0xc7b10907033Ca6e2FC00FCbb8CDD5cD89f141384"
            height="660px"
            width="100%"
          />
        </section>
      </section>
    </>
  )
}
