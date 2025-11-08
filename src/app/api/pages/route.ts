import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      include: {
        sections: {
          include: {
            images: true,
            contentBlocks: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// CREATE new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, description, published, order } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        description: description || '',
        published: published ?? false,
        order: order ?? 0,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}

// UPDATE page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const page = await prisma.page.update({
      where: { id },
      data,
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

// DELETE page
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    await prisma.page.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
