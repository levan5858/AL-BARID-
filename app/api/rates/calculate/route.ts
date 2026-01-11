import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      origin,
      destination,
      weight,
      length,
      width,
      height,
      serviceType,
    } = body

    // Validate required fields
    if (!origin || !destination || !weight || !length || !width || !height || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic rate calculation logic
    const baseRate = 50 // Base shipping cost in USD
    const weightFactor = weight * 2 // $2 per kg
    const volumeFactor = (length * width * height) / 1000 * 0.5 // Volume-based pricing

    // Distance factor (simplified - same country = 30, different country = 50)
    const originCountry = origin.split(',')[1]?.trim() || origin
    const destinationCountry = destination.split(',')[1]?.trim() || destination
    const isInternational = originCountry !== destinationCountry
    const distanceFactor = isInternational ? 50 : 30

    // Service type multiplier
    const serviceMultiplier = serviceType === 'express' ? 1.5 : 1

    // Calculate total cost
    const totalCost = (baseRate + weightFactor + distanceFactor + volumeFactor) * serviceMultiplier

    // Calculate estimated delivery time
    const estimatedDays =
      serviceType === 'express'
        ? Math.floor(Math.random() * 2) + 1 // 1-2 days
        : Math.floor(Math.random() * 3) + 3 // 3-5 days

    const estimatedDelivery = estimatedDays === 1 ? '1 day' : `${estimatedDays} days`

    return NextResponse.json({
      cost: Math.round(totalCost * 100) / 100, // Round to 2 decimal places
      estimatedDelivery,
      currency: 'USD',
      breakdown: {
        baseRate,
        weightFactor,
        distanceFactor,
        volumeFactor,
        serviceMultiplier,
      },
    })
  } catch (error) {
    console.error('Error calculating rate:', error)
    return NextResponse.json(
      { error: 'Failed to calculate rate' },
      { status: 500 }
    )
  }
}