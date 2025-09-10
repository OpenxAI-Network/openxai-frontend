"use client"

import React, { useState } from "react"
import axios from "axios"
import { useAccount, useSignMessage } from "wagmi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface PromoCode {
  code: string
  credits: number
  description: string
}

export default function ManualTokensPage() {
  const { address } = useAccount()
  const [codes, setCodes] = useState<PromoCode[]>([])
  const { signMessageAsync } = useSignMessage()

  const [pendingCode, setPendingCode] = useState<PromoCode>({
    code: "",
    credits: 0,
    description: "",
  })

  return (
    <div className="text-white flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">Add New</span>
          <Button
            variant="outline"
            onClick={() => {
              setCodes((codes) =>
                codes.concat([
                  {
                    ...pendingCode,
                    credits: Math.round(pendingCode.credits * 1_000_000),
                  },
                ])
              )
              setPendingCode({
                code: "",
                credits: 0,
                description: "",
              })
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg">Code</Label>
          <Input
            className="w-auto bg-transparent"
            value={pendingCode.code}
            onChange={(e) =>
              setPendingCode((code) => {
                return { ...code, code: e.target.value }
              })
            }
          />
          <Button
            variant="outline"
            onClick={() => {
              setPendingCode((code) => {
                return { ...code, code: crypto.randomUUID() }
              })
            }}
          >
            Generate
          </Button>
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg" htmlFor="promo_code_credits">
            Credits
          </Label>
          <Input
            id="promo_code_credits"
            className="w-auto bg-transparent"
            type="number"
            value={pendingCode.credits}
            onChange={(e) =>
              setPendingCode((code) => {
                return { ...code, credits: parseFloat(e.target.value) }
              })
            }
          />
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg" htmlFor="manual_token_description">
            Description
          </Label>
          <Input
            id="manual_token_description"
            className="w-auto bg-transparent"
            value={pendingCode.description}
            onChange={(e) =>
              setPendingCode((token) => {
                return { ...token, description: e.target.value }
              })
            }
          />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">Promo Codes</span>
          <Button
            variant="outline"
            onClick={() => {
              if (!address) {
                return
              }

              const promo_codes = JSON.stringify(codes)
              signMessageAsync({
                account: address,
                message: promo_codes,
              })
                .then((signature) => {
                  return axios.post(
                    "https://indexer.core.openxai.org/api/promo_code/add",
                    {
                      promo_codes,
                      signature,
                    }
                  )
                })
                .catch(console.error)
            }}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCodes([])
            }}
          >
            Reset
          </Button>
        </div>
        {codes.map((code, i) => {
          return <span key={i}>{JSON.stringify(code)}</span>
        })}
      </div>
    </div>
  )
}
