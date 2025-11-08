import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const fontSettings = [
    // Header Logo Font (Steven Quach)
    { key: 'font_header_logo', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', description: 'Header Logo Font (Steven Quach)', category: 'fonts' },
    { key: 'font_header_logo_file', value: '', description: 'Header Logo Font File Path', category: 'fonts' },
    { key: 'font_header_logo_name', value: '', description: 'Header Logo Font Name', category: 'fonts' },

    // Header Navigation Font (About, Contact)
    { key: 'font_header_nav', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', description: 'Header Navigation Font', category: 'fonts' },
    { key: 'font_header_nav_file', value: '', description: 'Header Navigation Font File Path', category: 'fonts' },
    { key: 'font_header_nav_name', value: '', description: 'Header Navigation Font Name', category: 'fonts' },

    // Home Page Font (Hero section)
    { key: 'font_home_page', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', description: 'Home Page Font', category: 'fonts' },
    { key: 'font_home_page_file', value: '', description: 'Home Page Font File Path', category: 'fonts' },
    { key: 'font_home_page_name', value: '', description: 'Home Page Font Name', category: 'fonts' },

    // About Page Font
    { key: 'font_about_page', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', description: 'About Page Font', category: 'fonts' },
    { key: 'font_about_page_file', value: '', description: 'About Page Font File Path', category: 'fonts' },
    { key: 'font_about_page_name', value: '', description: 'About Page Font Name', category: 'fonts' },

    // Contact Page Font
    { key: 'font_contact_page', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', description: 'Contact Page Font', category: 'fonts' },
    { key: 'font_contact_page_file', value: '', description: 'Contact Page Font File Path', category: 'fonts' },
    { key: 'font_contact_page_name', value: '', description: 'Contact Page Font Name', category: 'fonts' },
  ]

  for (const setting of fontSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('Font settings seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
