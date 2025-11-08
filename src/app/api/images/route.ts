import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET images
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sectionId = searchParams.get('sectionId')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (sectionId) where.sectionId = sectionId
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const images = await prisma.image.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

// CREATE new image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sectionId,
      url,
      alt,
      title,
      description,
      width,
      height,
      order,
      category,
      tags,
      featured,
    } = body

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const image = await prisma.image.create({
      data: {
        sectionId: sectionId || null,
        url,
        alt: alt || '',
        title: title || '',
        description: description || '',
        width: width || null,
        height: height || null,
        order: order ?? 0,
        category: category || null,
        tags: tags || [],
        featured: featured ?? false,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating image:', error)
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
  }
}

// UPDATE image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const image = await prisma.image.update({
      where: { id },
      data,
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

// DELETE image
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    await prisma.image.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
