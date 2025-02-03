import { promises as fs } from 'fs'
import path from 'path'
import Image from "next/image"
import HeaderBackground from "@/public/HeaderBackground.png"
import { Header } from "@/components/Header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Model } from "@/types/models"

async function getModels(): Promise<Model[]> {
  const csvFile = path.join(process.cwd(), 'deep-link-supported-models.csv')
  const fileContents = await fs.readFile(csvFile, 'utf8')
  
  const [headers, ...rows] = fileContents.split('\n')
  
  return rows.map(row => {
    const [model_name, model_sizes, type, pulls, last_updated] = row.split(',')
    return {
      model_name,
      model_sizes,
      type,
      pulls,
      last_updated
    }
  }).filter(model => model.model_name) // Remove empty rows
}

export default async function ModelsPage() {
  const models = await getModels()

  return (
    <>
      <Header />
      <div className="absolute inset-x-0 top-0 -z-50 flex h-[750px] place-content-center overflow-hidden bg-black">
        <Image
          className="w-full object-none"
          alt="Header background"
          src={HeaderBackground}
          height={750}
        />
      </div>
      <div className="container mt-24 flex min-h-screen flex-col items-center">
        <h1 className="font-inter text-4xl font-bold text-white">Models</h1>
        <div className="mt-8 w-full">
          <div className="rounded-lg bg-white p-4">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-900">Model</TableHead>
                  <TableHead className="text-gray-900">Sizes</TableHead>
                  <TableHead className="text-gray-900">Type</TableHead>
                  <TableHead className="text-gray-900">Downloads</TableHead>
                  <TableHead className="text-gray-900">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.model_name} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">{model.model_name}</TableCell>
                    <TableCell className="text-gray-900">{model.model_sizes}</TableCell>
                    <TableCell className="text-gray-900">{model.type}</TableCell>
                    <TableCell className="text-gray-900">{model.pulls}</TableCell>
                    <TableCell className="text-gray-900">{model.last_updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
} 