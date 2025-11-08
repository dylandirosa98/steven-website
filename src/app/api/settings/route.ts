import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const settings = await prisma.siteSettings.findMany({
      where: category ? { category } : undefined,
      orderBy: { key: 'asc' },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, description, category } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value, description, category },
      create: {
        key,
        value,
        description: description || '',
        category: category || 'general',
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Setting ID is required' }, { status: 400 })
    }

    await prisma.siteSettings.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Setting deleted successfully' })
  } catch (error) {
    console.error('Error deleting setting:', error)
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 })
  }
}
