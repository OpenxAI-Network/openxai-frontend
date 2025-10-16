import { NextResponse } from 'next/server'
import { getEcosystemMetrics } from '@/lib/data/ecosystem-data'

export async function GET() {
  try {
    const metrics = await getEcosystemMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ecosystem metrics' },
      { status: 500 }
    )
  }
}

