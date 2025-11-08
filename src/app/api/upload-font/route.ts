import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('font') as File
    const fontName = formData.get('fontName') as string
    const fontType = formData.get('fontType') as string // 'primary' or 'headings'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!fontName) {
      return NextResponse.json({ error: 'Font name is required' }, { status: 400 })
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()
    const allowedExtensions = ['ttf', 'otf', 'woff', 'woff2']

    if (!fileExtension || !allowedExtensions.includes(fileExtension.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload .ttf, .otf, .woff, or .woff2 files' },
        { status: 400 }
      )
    }

    // Create safe filename
    const safeFileName = fontName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
    const fileName = `${safeFileName}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public/fonts directory
    const publicPath = path.join(process.cwd(), 'public', 'fonts', fileName)
    await writeFile(publicPath, buffer)

    // Return the font info
    return NextResponse.json({
      success: true,
      fontName,
      fontPath: `/fonts/${fileName}`,
      fontFamily: fontName,
    })
  } catch (error) {
    console.error('Error uploading font:', error)
    return NextResponse.json({ error: 'Failed to upload font' }, { status: 500 })
  }
}
