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

interface TGEManualToken {
  account: string
  amount: number
  atTGE: number // percentage
  vestingDays: number
}

const totalSupply = 100_000_000 * 1_000_000 * 0.01
const tge: TGEManualToken[] = [
  {
    account: "0xE7A2E10D4586968Bd9229b4cF128652b24aE78Ae",
    amount: 0.15 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xabaF2C519f7e48407CF2071165868E1Fefcf5A67",
    amount: 0.05 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x049CDeD5283b8f95AE261c2b47e00fb26DD2585E",
    amount: 0.05 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x583844b4A455488359968154aFD6A9BbCE983080",
    amount: 0.1 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x3c23F79698f1757549Fa3F3284E25F93075c3DC8",
    amount: 0.15 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xB1004094eE6840d2EDd8dF19F693e0c24c954A7B",
    amount: 0.4 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x02F0170d8a80a261Ce2DE1183d5a3A7F29A85c1f",
    amount: 0.05 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x113be2A0Dd0b6d7808D30c8F5CfC3fA2232bbD06",
    amount: 0.36 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xa357F8BD6C3E98E31611ea28Dd97bb6E76Ad7d15",
    amount: 0.05 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x6Ff837a1a5587D7877DA43F72898D2f64A3DC347",
    amount: 0.135 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x6E01Ba971675DB2596557698A3f95B8D3e7E2612",
    amount: 0.135 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x830F13c7E038eBc64050e35c82167096D56ED7Ee",
    amount: 0.085 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x72230606639BB743Cc7C07FfebBE1F767a0eD2dB",
    amount: 0.05 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x7C9BE84fa48118a0166D790eB1545b23841F8694",
    amount: 0.2 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x19243697ba923539223f0CC777B55fBd4118F5cA",
    amount: 0.135 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xd24aF87D8adC73529491faF0d9D56cDC46886Be0",
    amount: 0.36 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xa56bBD51250A29149161e8e4e617528A014597cb",
    amount: 0.4 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0xcc669A9F057C1E69dE1BfebB26E4489AD94cE529",
    amount: 0.5 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x83034F61E9F9d711EDc1be3411CacDCa289E16Ce",
    amount: 0.7 * totalSupply,
    atTGE: 0.5,
    vestingDays: 60,
  },
  {
    account: "0x4662E43E5fe849c6F1aBB502b2B806edC1f2A769",
    amount: 0.5 * totalSupply,
    atTGE: 1,
    vestingDays: 0,
  },
  {
    account: "0x95cC955915950DBE8cd2620A1A222374193DF3fC",
    amount: 0.5 * totalSupply,
    atTGE: 1,
    vestingDays: 0,
  },
  {
    account: "0x53475662D4c11dA9AdC1a8664965D73bDbf07b1f",
    amount: 0.02 * totalSupply,
    atTGE: 0.2,
    vestingDays: 60,
  },
]

const tgeDate = Math.round(Date.UTC(2025, 9 - 1, 10, 17, 59, 0, 0) / 1000)

const tokens: ManualToken[] = tge.flatMap((token) => {
  const amount = Math.round(token.amount)
  const atTGE = Math.round(amount * token.atTGE)
  const vested = amount - atTGE
  const perDay =
    token.vestingDays === 0 ? 0 : Math.round(vested / token.vestingDays)
  return [
    {
      account: token.account,
      amount: atTGE,
      description: "TGE deal",
      release_after: tgeDate,
    },
  ].concat(
    ...Array.from({ length: token.vestingDays }).map((_, i) => {
      return {
        account: token.account,
        amount: perDay,
        description: "TGE deal",
        release_after: tgeDate + 24 * 60 * 60 * (i + 1),
      }
    })
  )
})

export default function ManualTokensTGEPage() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  return (
    <div className="text-white flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 place-items-center">
          <span className="text-2xl">
            Token Claims (
            {tokens.reduce((prev, cur) => prev + cur.amount, 0) / 1_000_000})
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
