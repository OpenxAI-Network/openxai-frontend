"use client"

import axios from "axios"
import { useAccount, useSignMessage } from "wagmi"

import { Button } from "@/components/ui/button"

interface ManualToken {
  account: string
  amount: number
  description: string
  release_after: number
}

interface AmbManualToken {
  account: string
  start: number
  monthly: number
  extra?: number
}

const tge: AmbManualToken[] = [
  // {
  //   account: "0x43859cf8b0d5246a0e83aC308B9f0d988D571c55",
  //   start: Date.UTC(2025, 2 - 1, 8),
  //   monthly: 750,
  //   extra: 30000,
  // },
  // {
  //   account: "0x9AFe0A821700957540Aad78109122aEe3300ab9B",
  //   start: Date.UTC(2025, 2 - 1, 28),
  //   monthly: 500,
  //   extra: 20000,
  // },
  // {
  //   account: "0x50A1eB95CD2F1bBE3571E13722E51f5BEC909cb4",
  //   start: Date.UTC(2025, 2 - 1, 8),
  //   monthly: 500,
  //   extra: 80000,
  // },
  // {
  //   account: "0xB8425bFfD7CBc3780ca6713ED302a4D48C465664",
  //   start: Date.UTC(2025, 2 - 1, 8),
  //   monthly: 500,
  //   extra: 80000,
  // },
  // {
  //   account: "0x745E180e9953Da325c4497fE4A0F2077d441F21f",
  //   start: Date.UTC(2025, 7 - 1, 1),
  //   monthly: 500,
  // },
  // {
  //   account: "0xed3c3fa777AE3d2cBf109c53832919C6c27Df915",
  //   start: Date.UTC(2025, 8 - 1, 1),
  //   monthly: 500,
  // },
  // {
  //   account: "0x53E4503dB26192f39E3EE5f55d47B2D4A0356cD4",
  //   start: Date.UTC(2025, 7 - 1, 16),
  //   monthly: 500,
  // },
  // {
  //   account: "0x483CB31977bD9030716F2Aa0601d9bE62Ac2cE13",
  //   start: Date.UTC(2025, 7 - 1, 27),
  //   monthly: 500,
  // },
  // {
  //   account: "0x7F4d132aC0488fe776fF994f7bCeFB9574383364",
  //   start: Date.UTC(2025, 8 - 1, 26),
  //   monthly: 500,
  // },
  // {
  //   account: "0xf6A944f72e940Ce7213aCF2E0DDe96672F64733D",
  //   start: Date.UTC(2025, 8 - 1, 9),
  //   monthly: 500,
  // },
  // {
  //   account: "0x4437ce8885Ff0BcDc628d4da48EcC9B56BdeC896",
  //   start: Date.UTC(2025, 7 - 1, 29),
  //   monthly: 500,
  // },
  // {
  //   account: "0x2938AFd9B656D26CCA344F10367Fe43844A3cD55",
  //   start: Date.UTC(2025, 8 - 1, 8),
  //   monthly: 500,
  // },
  // {
  //   account: "0x7A610904997D8B48e07473a32691F603880e0d4C",
  //   start: Date.UTC(2025, 8 - 1, 6),
  //   monthly: 500,
  // },
  // {
  //   account: "0xe7a9F3285dD6ed7BE8e4f4345708E90f794458c3",
  //   start: Date.UTC(2025, 10 - 1, 1),
  //   monthly: 500,
  // },
  // {
  //   account: "0xb3ABf724A40b796d11dF97BA70Ae68Dd15d18AB5",
  //   start: Date.UTC(2025, 9 - 1, 29),
  //   monthly: 500,
  // },
  // {
  //   account: "0x031aa32020FfA5623B50fc0461778d70b23100B5",
  //   start: Date.UTC(2025, 2 - 1, 4),
  //   monthly: 2000,
  //   extra: 80000,
  // },
]

const day = 24 * 60 * 60
const tgeDate = Math.round(Date.UTC(2025, 9 - 1, 10) / 1000)
const until = tgeDate + 365 * 2 * day

const tokens: ManualToken[] = tge.flatMap((token) => {
  const start = Math.round(token.start / 1000)
  const perDay = Math.round((1_000_000 * token.monthly) / 30)
  const vestingDays = Math.round((until - start) / day)

  const extra: ManualToken[] = []
  if (token.extra) {
    const beforeTGEDays = Math.round((tgeDate - start) / day)
    const beforeTGEAmount = Math.round((1_000_000 * token.extra) / 365)
    const afterTGEVesting = 2 * 365
    const afterTGEAmount = Math.round(
      (1_000_000 * token.extra - beforeTGEAmount * beforeTGEDays) /
        afterTGEVesting
    )
    extra.push(
      ...Array.from({ length: beforeTGEDays }).map((_, i) => {
        return {
          account: token.account,
          amount: beforeTGEAmount,
          description: "Amb previous commitment pre-TGE",
          release_after: start + day * (i + 1),
        }
      })
    )
    extra.push(
      ...Array.from({ length: afterTGEVesting }).map((_, i) => {
        return {
          account: token.account,
          amount: afterTGEAmount,
          description: "Amb previous commitment post-TGE",
          release_after: tgeDate + day * (i + 1),
        }
      })
    )
  }

  return extra.length > 1
    ? extra
    : extra.concat(
        ...Array.from({ length: vestingDays }).map((_, i) => {
          return {
            account: token.account,
            amount: perDay,
            description: "Amb token vesting",
            release_after: start + day * (i + 1),
          }
        })
      )
})

export default function ManualTokensAMBPage() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return (
    <div className="text-white flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">
            Token Claims (total (
            {tokens.reduce((prev, cur) => prev + cur.amount, 0) / 1_000_000}
            ), unlocked (
            {tokens
              .filter((t) => t.release_after < Math.round(Date.now() / 1000))
              .reduce((prev, cur) => prev + cur.amount, 0) / 1_000_000}
            ))
          </span>
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
        </div>
        {tokens.map((token, i) => {
          return <span key={i}>{JSON.stringify(token)}</span>
        })}
      </div>
    </div>
  )
}
