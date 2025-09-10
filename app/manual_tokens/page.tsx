"use client"

import { useState } from "react"
import axios from "axios"
import { useAccount, useSignMessage } from "wagmi"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface ManualToken {
  account: string
  amount: number
  description: string
  release_after: number
}

export default function ManualTokensPage() {
  const { address } = useAccount()
  const [tokens, setTokens] = useState<ManualToken[]>([])
  const { signMessageAsync } = useSignMessage()

  const [pendingToken, setPendingToken] = useState<{
    account: string
    amount: number
    description: string
    starting_from: Date
    repeats: number
  }>({
    account: "",
    amount: 0,
    description: "",
    starting_from: new Date(),
    repeats: 1,
  })

  return (
    <div className="text-white flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">Add New</span>
          <Button
            variant="outline"
            onClick={() => {
              setTokens((tokens) =>
                tokens.concat(
                  ...Array.from({ length: pendingToken.repeats }).map(
                    (_, i) => {
                      return {
                        ...pendingToken,
                        amount: Math.round(pendingToken.amount * 1_000_000),
                        release_after:
                          Math.round(
                            pendingToken.starting_from.getTime() / 1000
                          ) +
                          24 * 60 * 60 * i,
                      }
                    }
                  )
                )
              )
              setPendingToken({
                account: "",
                amount: 0,
                description: "",
                starting_from: new Date(),
                repeats: 1,
              })
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg">Account</Label>
          <Input
            className="w-auto bg-transparent"
            value={pendingToken.account}
            onChange={(e) =>
              setPendingToken((token) => {
                return { ...token, account: e.target.value }
              })
            }
          />
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg" htmlFor="manual_token_amount">
            Amount
          </Label>
          <Input
            id="manual_token_amount"
            className="w-auto bg-transparent"
            type="number"
            value={pendingToken.amount}
            onChange={(e) =>
              setPendingToken((token) => {
                return { ...token, amount: parseFloat(e.target.value) }
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
            value={pendingToken.description}
            onChange={(e) =>
              setPendingToken((token) => {
                return { ...token, description: e.target.value }
              })
            }
          />
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg" htmlFor="manual_token_starting_from">
            Starting From
          </Label>
          <DatePicker
            id="manual_token_starting_from"
            date={pendingToken.starting_from}
            setDate={(date) =>
              setPendingToken((token) => {
                return { ...token, starting_from: date }
              })
            }
          />
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg">Time</Label>
          <Input
            className="bg-transparent"
            type="number"
            value={Math.floor(
              (pendingToken.starting_from.getTime() % (24 * 60 * 60 * 1000)) /
                (60 * 60 * 1000)
            )}
            onChange={(e) => {
              const hours = parseInt(e.target.value)
              if (!isNaN(hours)) {
                setPendingToken((token) => {
                  return {
                    ...token,
                    starting_from: new Date(
                      Math.floor(
                        pendingToken.starting_from.getTime() /
                          (24 * 60 * 60 * 1000)
                      ) *
                        (24 * 60 * 60 * 1000) +
                        hours * (60 * 60 * 1000) +
                        Math.floor(
                          ((pendingToken.starting_from.getTime() %
                            (24 * 60 * 60 * 1000)) %
                            (60 * 60 * 1000)) /
                            (60 * 1000)
                        ) *
                          (60 * 1000)
                    ),
                  }
                })
              }
            }}
          />
          <span>:</span>
          <Input
            className="bg-transparent"
            type="number"
            value={Math.floor(
              ((pendingToken.starting_from.getTime() % (24 * 60 * 60 * 1000)) %
                (60 * 60 * 1000)) /
                (60 * 1000)
            )}
            onChange={(e) => {
              const minutes = parseInt(e.target.value)
              if (!isNaN(minutes)) {
                setPendingToken((token) => {
                  return {
                    ...token,
                    starting_from: new Date(
                      Math.floor(
                        pendingToken.starting_from.getTime() /
                          (24 * 60 * 60 * 1000)
                      ) *
                        (24 * 60 * 60 * 1000) +
                        minutes * (60 * 1000) +
                        Math.floor(
                          (pendingToken.starting_from.getTime() %
                            (24 * 60 * 60 * 1000)) /
                            (60 * 60 * 1000)
                        ) *
                          (60 * 60 * 1000)
                    ),
                  }
                })
              }
            }}
          />
        </div>
        <div className="flex gap-3 place-items-center">
          <Label className="text-lg" htmlFor="manual_token_repeats">
            Repeats
          </Label>
          <Input
            id="manual_token_repeats"
            className="w-auto bg-transparent"
            type="number"
            value={pendingToken.repeats}
            onChange={(e) =>
              setPendingToken((token) => {
                return { ...token, repeats: parseFloat(e.target.value) }
              })
            }
          />
        </div>
        <Separator />
        <span className="text-xl">Confirm</span>
        <div className="flex gap-3 place-items-center">
          <span className="text-lg">Ends on</span>
          <span className="px-2 py-1 border-2 rounded-md">
            {new Date(
              pendingToken.starting_from.getTime() +
                24 * 60 * 60 * 1000 * pendingToken.repeats
            ).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-3 place-items-center">
          <span className="text-lg">Total Tokens</span>
          <span className="px-2 py-1 border-2 rounded-md">
            {pendingToken.amount * pendingToken.repeats}
          </span>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">Token Claims</span>
          <Button
            variant="outline"
            onClick={() => {
              if (!address) {
                return
              }

              const manual_tokens = JSON.stringify(tokens)
              signMessageAsync({
                account: address,
                message: manual_tokens,
              })
                .then((signature) => {
                  return axios.post(
                    "https://indexer.core.openxai.org/api/manual_tokens/upload",
                    {
                      manual_tokens,
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
              setTokens([])
            }}
          >
            Reset
          </Button>
        </div>
        {tokens.map((token, i) => {
          return <span key={i}>{JSON.stringify(token)}</span>
        })}
      </div>
    </div>
  )
}
