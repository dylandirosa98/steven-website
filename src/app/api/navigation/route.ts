import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const navigation = await prisma.navigation.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(navigation)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { label, href, order, visible, external, parentId } = body

    if (!label || !href) {
      return NextResponse.json(
        { error: 'Label and href are required' },
        { status: 400 }
      )
    }

    const navItem = await prisma.navigation.create({
      data: {
        label,
        href,
        order: order ?? 0,
        visible: visible ?? true,
        external: external ?? false,
        parentId: parentId || null,
      },
    })

    return NextResponse.json(navItem, { status: 201 })
  } catch (error) {
    console.error('Error creating navigation item:', error)
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Navigation ID is required' }, { status: 400 })
    }

    const navItem = await prisma.navigation.update({
      where: { id },
      data,
    })

    return NextResponse.json(navItem)
  } catch (error) {
    console.error('Error updating navigation item:', error)
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Navigation ID is required' }, { status: 400 })
    }

    await prisma.navigation.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Navigation item deleted successfully' })
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 })
  }
}
