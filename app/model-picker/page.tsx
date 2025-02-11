"use client"

import React, { useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define our data types
type Model = {
  id: string
  name: string
  description: string
  performance: string
  requirements: {
    cpu: string
    memory: string
    storage: string
  }
  goodFor: string[]
  isOpenSource: boolean
  providers: string[]
  icon: string
  tooltip: string
}

type Provider = {
  id: string
  name: string
  description: string
  pricingModels: string[]
  hostingCosts: {
    basePrice: number
    cpu: number
    memory: number
    bandwidth: number
  }
  tooltip: string
  icon: string
}

type PricingModel = {
  id: string
  name: string
  description: string
  icon: string
}

// Sample data based on research
const AI_MODELS: Model[] = [
  {
    id: "deepseek",
    name: "Deepseek",
    description: "High-performance language model",
    performance: "High",
    requirements: {
      cpu: "8 vCPU",
      memory: "32GB RAM",
      storage: "100GB SSD"
    },
    goodFor: ["Coding", "Text Generation", "Reasoning"],
    isOpenSource: true,
    providers: ["aws", "azure", "google", "openmesh", "equinix"],
    icon: "/models/deepseek.png",
    tooltip: "Best for production deployments requiring high throughput"
  },
  {
    id: "llama",
    name: "Llama",
    description: "Meta's open source model, versatile for various tasks",
    performance: "Medium-High",
    requirements: {
      cpu: "4 vCPU",
      memory: "16GB RAM",
      storage: "50GB SSD"
    },
    goodFor: ["Coding", "Conversational AI", "Text Summarization"],
    isOpenSource: true,
    providers: ["aws", "azure", "openmesh", "equinix"],
    icon: "/models/llama.png",
    tooltip: "Versatile model for various tasks"
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "A model from Mistral AI, known for multilingual capabilities",
    performance: "Medium",
    requirements: {
      cpu: "2 vCPU",
      memory: "8GB RAM",
      storage: "20GB SSD"
    },
    goodFor: ["Multilingual Tasks", "Coding", "Translation"],
    isOpenSource: true,
    providers: ["aws", "google", "openmesh", "equinix"],
    icon: "/models/mistral.png",
    tooltip: "Ideal for multilingual tasks and translation"
  },
  // Add other models like Qwen, Kimi...
]

const PROVIDERS: Provider[] = [
  {
    id: "openmesh",
    name: "Openmesh",
    description: "Decentralized AI hosting",
    pricingModels: ["saas", "erc721", "erc4337"],
    hostingCosts: {
      basePrice: 9,
      cpu: 0.05,
      memory: 0.02,
      bandwidth: 0.01
    },
    tooltip: "Lowest cost, decentralized hosting with full ownership",
    icon: "/providers/openmesh.png"
  },
  {
    id: "aws",
    name: "AWS",
    description: "Amazon Web Services",
    pricingModels: ["saas"],
    hostingCosts: {
      basePrice: 30,
      cpu: 0.15,
      memory: 0.06,
      bandwidth: 0.09
    },
    tooltip: "Enterprise-grade infrastructure with higher costs",
    icon: "/providers/aws.png"
  },
  {
    id: "google",
    name: "Google Cloud",
    description: "Reliable cloud infrastructure",
    pricingModels: ["saas"],
    hostingCosts: {
      basePrice: 28,
      cpu: 0.12,
      memory: 0.05,
      bandwidth: 0.08
    },
    tooltip: "Reliable and scalable cloud infrastructure",
    icon: "/providers/google.png"
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    description: "Enterprise-grade AI hosting",
    pricingModels: ["saas"],
    hostingCosts: {
      basePrice: 32,
      cpu: 0.10,
      memory: 0.04,
      bandwidth: 0.07
    },
    tooltip: "Enterprise-grade AI hosting with higher costs",
    icon: "/providers/azure.png"
  },
  {
    id: "equinix",
    name: "Equinix",
    description: "Bare metal hosting for high performance",
    pricingModels: ["erc4337"],
    hostingCosts: {
      basePrice: 15,
      cpu: 0.08,
      memory: 0.03,
      bandwidth: 0.05
    },
    tooltip: "High-performance bare metal hosting",
    icon: "/providers/equinix.png"
  },
]

const PRICING_MODELS: PricingModel[] = [
  {
    id: "saas",
    name: "SaaS, Credit Cards",
    description: "Monthly subscription with no ownership",
    icon: "/pricing/saas.png"
  },
  {
    id: "erc721",
    name: "ERC-721 - Model Ownership",
    description: "Own the model through blockchain token",
    icon: "/pricing/erc721.png"
  },
  {
    id: "erc4337",
    name: "ERC-4337 (Rent, Resell)",
    description: "Rent or resell model usage rights",
    icon: "/pricing/erc4337.png"
  },
]

export default function ModelPickerPage() {
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])

  const calculateTotalCost = (modelId: string, providerId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId)
    const provider = PROVIDERS.find(p => p.id === providerId)
    if (!model || !provider) return 0

    return provider.hostingCosts.basePrice +
           (provider.hostingCosts.cpu * parseInt(model.requirements.cpu)) +
           (provider.hostingCosts.memory * parseInt(model.requirements.memory)) +
           provider.hostingCosts.bandwidth
  }

  const handleDeploy = () => {
    if (selectedModels.length > 0 && selectedProviders.length > 0 && selectedPricing.length > 0) {
      console.log("Deploying:", { selectedModels, selectedProviders, selectedPricing })
    }
  }

  const updateComparisonTable = () => {
    const modelsToShow = selectedModels.length > 0 ? 
      AI_MODELS.filter(m => selectedModels.includes(m.id)) :
      AI_MODELS.slice(0, 3)

    return (
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Metric</th>
            {modelsToShow.map(model => (
              <th key={model.id} className="p-4 text-left">{model.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-4">Hosting Cost</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">
                {selectedProviders.length > 0 ? (
                  <ul>
                    {selectedProviders.map(providerId => (
                      <li key={providerId}>
                        {PROVIDERS.find(p => p.id === providerId)?.name}: 
                        ${calculateTotalCost(model.id, providerId)}/month
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Select provider(s)"
                )}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4">Data AI model ownership</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">
                {model.isOpenSource ? "OpenxAI {'>'} 100% user own" : "Unknown"}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4">No code</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">✓</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4">Performance</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">{model.performance}</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4">Good for</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">{model.goodFor.join(', ')}</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-4">Availability</td>
            {modelsToShow.map(model => (
              <td key={model.id} className="p-4">Available</td>
            ))}
          </tr>
          {selectedPricing.length > 0 && (
            <tr className="border-t">
              <td className="p-4">Licensing Benefits</td>
              {modelsToShow.map(model => (
                <td key={model.id} className="p-4">
                  <ul>
                    {selectedPricing.map(priceId => (
                      <li key={priceId}>
                        {priceId === 'erc721' && '✓ Full ownership'}
                        {priceId === 'erc4337' && '✓ Rental/Resale rights'}
                        {priceId === 'saas' && '✗ No ownership'}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    )
  }

  const canLaunch = selectedModels.length === 1 && 
                    selectedProviders.length === 1 && 
                    selectedPricing.length === 1

  return (
    <>
      <Header />
      <main className="container mx-auto mt-24 px-4">
        <h1 className="mb-12 text-center text-4xl font-bold">
          Revolutionizing Open<br />
          Permissionless AI Ecosystem
        </h1>

        {/* Step 1: Pick the model */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">1</span>
            <span className="text-xl font-semibold text-blue-600">Pick the model</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {AI_MODELS.map((model) => (
              <TooltipProvider key={model.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center gap-2 rounded-lg border p-4 transition-all hover:border-blue-500 ${
                        selectedModels.includes(model.id) ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (selectedModels.includes(model.id)) {
                          setSelectedModels(selectedModels.filter(m => m !== model.id))
                        } else {
                          setSelectedModels([...selectedModels, model.id])
                        }
                      }}
                    >
                      <img src={model.icon} alt={model.name} className="h-6 w-6" />
                      <span>{model.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{model.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Step 2: Infrastructure */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">2</span>
            <span className="text-xl font-semibold text-blue-600">Infrastructure</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {PROVIDERS.filter(provider => 
              selectedModels.length === 0 || AI_MODELS.find(m => m.id === selectedModels[0])?.providers.includes(provider.id)
            ).map((provider) => (
              <TooltipProvider key={provider.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center gap-2 rounded-lg border p-4 transition-all hover:border-blue-500 ${
                        selectedProviders.includes(provider.id) ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (selectedProviders.includes(provider.id)) {
                          setSelectedProviders(selectedProviders.filter(p => p !== provider.id))
                        } else {
                          setSelectedProviders([...selectedProviders, provider.id])
                        }
                      }}
                    >
                      <img src={provider.icon} alt={provider.name} className="h-6 w-6" />
                      <span>{provider.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{provider.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Step 3: Monetization model */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">3</span>
            <span className="text-xl font-semibold text-blue-600">Monetization model</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {PRICING_MODELS.filter(pricing => 
              selectedProviders.length > 0 && PROVIDERS.find(p => p.id === selectedProviders[0])?.pricingModels.includes(pricing.id)
            ).map((pricing) => (
              <TooltipProvider key={pricing.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center gap-2 rounded-lg border p-4 transition-all hover:border-blue-500 ${
                        selectedPricing.includes(pricing.id) ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (selectedPricing.includes(pricing.id)) {
                          setSelectedPricing(selectedPricing.filter(p => p !== pricing.id))
                        } else {
                          setSelectedPricing([...selectedPricing, pricing.id])
                        }
                      }}
                    >
                      <img src={pricing.icon} alt={pricing.name} className="h-6 w-6" />
                      <span>{pricing.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{pricing.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-12 overflow-x-auto rounded-lg border">
          {updateComparisonTable()}
        </div>

        {/* Launch Button */}
        <div className="mb-12 flex justify-between">
          <Button
            onClick={handleDeploy}
            disabled={!canLaunch}
            className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {!canLaunch ? 'Select exactly one option from each step' : 'Launch it now'}
          </Button>
        </div>
      </main>
    </>
  )
}