"use client"

import { useMemo } from "react"
import Link from "next/link"
import { OpenxAIContract } from "@/contracts/OpenxAI"
import { OpenxAIClaimerContract } from "@/contracts/OpenxAIClaimer"
import { OpenxAINonCirculatingSupplyVestingContract } from "@/contracts/OpenxAINonCirculatingSupplyVesting"
import { UniswapV2Contract } from "@/contracts/UniswapV2"
import { Address, formatUnits } from "viem"
import { useReadContract, useReadContracts } from "wagmi"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Donut } from "@/components/charts/donut"
import { StackedArea } from "@/components/charts/stacked-area"
import { chains } from "@/components/custom/web3-provider"

interface Contract {
  address: Address
  label: string
  showBalance?: boolean
  vesting?: boolean
  lp?: boolean
}

const contracts: Contract[] = [
  {
    address: OpenxAIClaimerContract.address,
    label: "OpenxAI Claimer",
    showBalance: true,
  },
  {
    address: "0xf0c25895632632047f170cf4dda0e41a8ba25789",
    label: "OpenxAI Token Vault",
    showBalance: true,
  },
  {
    address: "0x2174Ee12b8f21Cf6BC04f6b06a9Fb7333C008492",
    label: "OpenxAI Opportunity Fund",
    showBalance: true,
  },
  {
    address: "0x31076C1e7C819867C2E438fBE90e51747424a084",
    label: "OpenxAI Liquidity Fund",
    showBalance: true,
  },
  {
    address: "0x4f4ae633345b77baf651fbd948ae12c75b9fcb2a",
    label: "OpenxAI Vesting (1 year)",
    vesting: true,
  },
  {
    address: "0x24bd6fe22730876bc02bd91c85fb268c8b86c843",
    label: "OpenxAI Vesting (2 year)",
    vesting: true,
  },
  {
    address: "0x2006ddd6338760918434fcd51f74832500660b91",
    label: "OpenxAI Vesting (3 year)",
    vesting: true,
  },
  {
    address: "0x5fb9c6442da158dcdc66804f4cafb8bf1c42025a",
    label: "OpenxAI Vesting (4 year)",
    vesting: true,
  },
  {
    address: "0xaa15e4ee9f86744d2d3e4812e0f285d1817251d3",
    label: "OpenxAI Vesting (5 year)",
    vesting: true,
  },
  {
    address: "0xec2e1a7d9c66cab82d9234cb199ae6df96ad9084",
    label: "OpenxAI Vesting (6 year)",
    vesting: true,
  },
  {
    address: "0xdc72273eb7974a78eeff690c59f4288cc3a77f1f",
    label: "OpenxAI Vesting (7 year)",
    vesting: true,
  },
  {
    address: "0x0d62e1b68c1f2b2a21bb7e817714961d9152cbbc",
    label: "OpenxAI Vesting (8 year)",
    vesting: true,
  },
  {
    address: "0x7aD1dB1b8A8ce3040BC1807d7Af6A8BC88584600",
    label: "Uniswap V2 OPENX / ETH Pool",
    lp: true,
  },
  {
    address: "0x3A1C54520b590805b0aB589F0c14Aac3D608F431",
    label: "Pending Return",
  },
]

export default function TokenPage() {
  const { data: totalSupply } = useReadContract({
    abi: OpenxAIContract.abi,
    address: OpenxAIContract.address,
    functionName: "totalSupply",
  })

  const { data: balances } = useReadContracts({
    contracts: contracts.map((contract) => {
      return {
        abi: OpenxAIContract.abi,
        address: OpenxAIContract.address,
        functionName: "balanceOf",
        args: [contract.address],
      } as const
    }),
    allowFailure: false,
  })

  const totalNonCirculating = useMemo(() => {
    if (!balances) {
      return undefined
    }

    return balances.reduce((prev, cur) => prev + cur, BigInt(0))
  }, [balances])

  const { data: pools } = useReadContracts({
    contracts: [
      {
        abi: UniswapV2Contract.abi,
        address: "0x7ad1db1b8a8ce3040bc1807d7af6a8bc88584600", // OPENX / ETH
        functionName: "getReserves",
      },
      {
        abi: UniswapV2Contract.abi,
        address: "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C", // USDC / ETH
        functionName: "getReserves",
      },
    ] as const,
    allowFailure: false,
    query: {
      refetchInterval: 2_000, // 2s
    },
  })

  const prices = useMemo(() => {
    if (!pools) return undefined

    const floatPools = pools.map((pool) => [
      parseFloat(formatUnits(pool[0], 0)),
      parseFloat(formatUnits(pool[1], 0)),
    ])
    return {
      ethPerOpenx: floatPools[0][0] / floatPools[0][1],
      usdcPerEth: (floatPools[1][1] * 10 ** 12) / floatPools[1][0],
    }
  }, [pools])

  const { data: vesting } = useReadContracts({
    contracts: contracts
      .filter((contract) => contract.vesting)
      .flatMap((contract) => {
        return [
          {
            abi: OpenxAINonCirculatingSupplyVestingContract.abi,
            address: contract.address,
            functionName: "amount",
          },
          {
            abi: OpenxAINonCirculatingSupplyVestingContract.abi,
            address: contract.address,
            functionName: "releasable",
          },
          {
            abi: OpenxAINonCirculatingSupplyVestingContract.abi,
            address: contract.address,
            functionName: "released",
          },
        ] as const
      }),
    allowFailure: false,
  })

  const locked = useMemo(() => {
    const opportunityIndex = contracts.findIndex(
      (contract) => contract.label === "OpenxAI Opportunity Fund"
    )
    const liquidityIndex = contracts.findIndex(
      (contract) => contract.label === "OpenxAI Liquidity Fund"
    )
    if (
      totalSupply === undefined ||
      !balances ||
      !vesting ||
      opportunityIndex === -1 ||
      liquidityIndex === -1
    ) {
      return undefined
    }

    const opportunityAmount = balances[opportunityIndex]
    const liquidityAmount = balances[liquidityIndex]
    const vestingAmount = Array.from(
      { length: vesting.length / 3 },
      (_, i) => vesting[i * 3] - vesting[i * 3 + 1]
    ).reduce((prev, cur) => prev + cur, BigInt(0))

    return {
      unlocked:
        totalSupply - (opportunityAmount + liquidityAmount + vestingAmount),
      opportunity: opportunityAmount,
      liquidity: liquidityAmount,
      vesting: vestingAmount,
    }
  }, [totalSupply, balances, vesting])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-5xl text-white">Live Tokennomics</span>
          <span className="text-white/60">
            All displayed data comes directly from onchain smart contracts.
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-xl:grid-cols-3">
          <Stat
            value={
              totalSupply !== undefined && totalNonCirculating !== undefined
                ? formatBigInt({
                    number: totalSupply - totalNonCirculating,
                    maximumFractionDigits: 2,
                  })
                : "..."
            }
            label="Circulating Supply"
          />
          <Stat
            value={
              totalSupply !== undefined
                ? formatBigInt({ number: totalSupply })
                : "..."
            }
            label="Total Supply"
          />
          <Stat
            value={prices !== undefined ? prices.ethPerOpenx.toFixed(7) : "..."}
            label="ETH / OPENX"
          />
          <Stat
            value={
              prices !== undefined
                ? (prices.ethPerOpenx * prices.usdcPerEth).toFixed(3)
                : "..."
            }
            label="OPENX / USDC"
          />
          <Stat
            value={
              totalSupply !== undefined &&
              totalNonCirculating !== undefined &&
              prices !== undefined
                ? `$${formatNumber({
                    number:
                      prices.ethPerOpenx *
                      prices.usdcPerEth *
                      parseFloat(
                        formatUnits(totalSupply - totalNonCirculating, 18)
                      ),
                    maximumFractionDigits: 0,
                  })}`
                : "..."
            }
            label="Market Cap"
          />
          <Stat
            value={
              totalSupply !== undefined && prices !== undefined
                ? `$${formatNumber({
                    number:
                      prices.ethPerOpenx *
                      prices.usdcPerEth *
                      parseFloat(formatUnits(totalSupply, 18)),
                    maximumFractionDigits: 0,
                  })}`
                : "..."
            }
            label="Fully Diluted Market Cap"
          />
          {locked && (
            <Donut
              className="col-span-2"
              chartData={Object.keys(locked).map((id) => {
                return {
                  label: id,
                  value: parseFloat(
                    formatUnits(locked[id as keyof typeof locked], 18)
                  ),
                }
              })}
              data={formatBigInt({
                number: locked.liquidity + locked.opportunity + locked.vesting,
                maximumFractionDigits: 0,
              })}
              label="OPENX locked"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <span className="text-4xl text-white">Contract Balances</span>
        <Table>
          <TableHeader>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Contract
            </TableHead>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Balance
            </TableHead>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Block Explorer
            </TableHead>
          </TableHeader>
          <TableBody>
            {contracts
              .map((contract, i) => [i, contract] as const)
              .filter((contract) => contract[1].showBalance)
              .map((contract) => (
                <TableRow className="hover:bg-black/20">
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {contract[1].label}
                  </TableCell>
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {balances
                      ? `${formatBigInt({ number: balances[contract[0]], maximumFractionDigits: 0 })} OPENX`
                      : "..."}
                  </TableCell>
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    <Button variant="outline" asChild>
                      <Link
                        href={`${chains[0].blockExplorers.default.url}/address/${contract[1].address}`}
                        target="_blank"
                      >
                        View on BaseScan
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* filter claimer vault opportunity liquidity, table | label | balance | view on explorer */}
      </div>
      <div className="flex flex-col gap-5">
        <span className="text-4xl text-white">Vesting Contracts</span>
        {vesting && (
          <StackedArea
            chartData={[
              {
                xAxis: "TGE",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (0 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (0 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (0 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (0 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (0 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (0 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (0 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (0 / 8),
              },
              {
                xAxis: "Y1",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (1 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (1 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (1 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (1 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (1 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (1 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (1 / 8),
              },
              {
                xAxis: "Y2",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (2 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (2 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (2 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (2 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (2 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (2 / 8),
              },
              {
                xAxis: "Y3",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (3 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (3 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (3 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (3 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (3 / 8),
              },
              {
                xAxis: "Y4",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (4 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (4 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (4 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (4 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (4 / 8),
              },
              {
                xAxis: "Y5",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (4 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (5 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (5 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (5 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (5 / 8),
              },
              {
                xAxis: "Y6",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (4 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (5 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (6 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (6 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (6 / 8),
              },
              {
                xAxis: "Y7",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (4 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (5 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (6 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (7 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (7 / 8),
              },
              {
                xAxis: "Y8",
                one_year: parseFloat(formatUnits(vesting[3 * 0], 18)) * (1 / 1),
                two_year: parseFloat(formatUnits(vesting[3 * 1], 18)) * (2 / 2),
                three_year:
                  parseFloat(formatUnits(vesting[3 * 2], 18)) * (3 / 3),
                four_year:
                  parseFloat(formatUnits(vesting[3 * 3], 18)) * (4 / 4),
                five_year:
                  parseFloat(formatUnits(vesting[3 * 4], 18)) * (5 / 5),
                six_year: parseFloat(formatUnits(vesting[3 * 5], 18)) * (6 / 6),
                seven_year:
                  parseFloat(formatUnits(vesting[3 * 6], 18)) * (7 / 7),
                eight_year:
                  parseFloat(formatUnits(vesting[3 * 7], 18)) * (8 / 8),
              },
            ]}
          />
        )}
        <Table>
          <TableHeader>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Contract
            </TableHead>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Total
            </TableHead>
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Unvested
            </TableHead>
            {/* <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Claimed
            </TableHead> */}
            <TableHead className="bg-[#1F2021]/50 border-white text-white font-semibold">
              Block Explorer
            </TableHead>
          </TableHeader>
          <TableBody>
            {contracts
              .filter((contract) => contract.vesting)
              .map((contract, i) => (
                <TableRow className="hover:bg-black/20">
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {contract.label}
                  </TableCell>
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {vesting
                      ? `${formatBigInt({ number: vesting[i * 3] })} OPENX`
                      : "..."}
                  </TableCell>
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {vesting
                      ? `${formatBigInt({ number: vesting[i * 3 + 1], maximumFractionDigits: 0 })} OPENX (${((100 * parseFloat(formatUnits(vesting[i * 3 + 1], 18))) / parseFloat(formatUnits(vesting[i * 3], 18))).toFixed(2)}%)`
                      : "..."}
                  </TableCell>
                  {/* <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    {vesting
                      ? `${formatBigInt({ number: vesting[i * 3 + 2] })} OPENX`
                      : "..."}
                  </TableCell> */}
                  <TableCell className="bg-[#1F2021]/50 border-white text-white/90">
                    <Button variant="outline" asChild>
                      <Link
                        href={`${chains[0].blockExplorers.default.url}/address/${contract.address}`}
                        target="_blank"
                      >
                        View on BaseScan
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* filter starts with vesting, table | label | total | unvested | claimed | view on explorer */}
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-[#1F2021]/50 text-center place-content-center">
      <CardHeader>
        <CardTitle className="text-white">{value}</CardTitle>
        <CardDescription className="text-base text-white/60">
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function formatBigInt({
  number,
  decimals,
  maximumFractionDigits,
}: {
  number: bigint
  decimals?: number
  maximumFractionDigits?: number
}): string {
  return formatNumber({
    number: parseFloat(formatUnits(number, decimals ?? 18)),
    maximumFractionDigits,
  })
}

function formatNumber({
  number,
  maximumFractionDigits,
}: {
  number: number
  maximumFractionDigits?: number
}): string {
  return number.toLocaleString("en-US", { maximumFractionDigits })
}
