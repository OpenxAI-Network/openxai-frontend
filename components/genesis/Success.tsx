import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SuccessModalProps {
  depositAmount?: string
  tokenAmount?: string
  onClose?: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  depositAmount = "0.35ETH",
  tokenAmount = "316,438 OPENX",
  onClose,
}) => {
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (onClose) onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-gray-900 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex justify-center">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-blue-600">
            <div className="absolute size-32 animate-ping rounded-full bg-blue-600/20" />
            <Check className="size-12 text-white" />
          </div>
        </div>

        <h2 className="mb-6 text-4xl font-semibold text-white">Success!</h2>

        <p className="mb-8 text-lg text-gray-400">
          You deposited {depositAmount} & you will
          <br />
          receive {tokenAmount}
        </p>

        <p className="text-sm text-gray-500">
          Auto redirect in {countdown} seconds or{" "}
          <Link href="/claims" className="text-blue-500 underline">
            go to your dashboard
          </Link>
        </p>

        <Button
          onClick={onClose}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Close
        </Button>
      </div>
    </div>
  )
}

export default SuccessModal
