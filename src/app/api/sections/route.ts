import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET sections for a page
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageId = searchParams.get('pageId')

    const where = pageId ? { pageId } : undefined

    const sections = await prisma.section.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        contentBlocks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

// CREATE new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageId, type, title, subtitle, content, order, layout, visible } = body

    if (!pageId || !type) {
      return NextResponse.json(
        { error: 'Page ID and type are required' },
        { status: 400 }
      )
    }

    const section = await prisma.section.create({
      data: {
        pageId,
        type,
        title: title || '',
        subtitle: subtitle || '',
        content: content || '',
        order: order ?? 0,
        layout: layout || 'default',
        visible: visible ?? true,
      },
      include: {
        images: true,
        contentBlocks: true,
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

// UPDATE section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 })
    }

    const section = await prisma.section.update({
      where: { id },
      data,
      include: {
        images: true,
        contentBlocks: true,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

// DELETE section
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 })
    }

    await prisma.section.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}
