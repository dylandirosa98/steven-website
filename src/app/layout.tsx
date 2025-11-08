import type { Metadata } from 'next'
import './globals.css'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Steven Quach Photography',
  description: 'Unique moments seen through a creative lens',
}

async function getFontSettings() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            'font_header_logo', 'font_header_logo_file', 'font_header_logo_name',
            'font_header_nav', 'font_header_nav_file', 'font_header_nav_name',
            'font_home_page', 'font_home_page_file', 'font_home_page_name',
            'font_about_page', 'font_about_page_file', 'font_about_page_name',
            'font_contact_page', 'font_contact_page_file', 'font_contact_page_name'
          ]
        }
      }
    })

    const defaultFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

    return {
      headerLogo: settings.find(s => s.key === 'font_header_logo')?.value || defaultFont,
      headerLogoFile: settings.find(s => s.key === 'font_header_logo_file')?.value || '',
      headerLogoName: settings.find(s => s.key === 'font_header_logo_name')?.value || '',

      headerNav: settings.find(s => s.key === 'font_header_nav')?.value || defaultFont,
      headerNavFile: settings.find(s => s.key === 'font_header_nav_file')?.value || '',
      headerNavName: settings.find(s => s.key === 'font_header_nav_name')?.value || '',

      homePage: settings.find(s => s.key === 'font_home_page')?.value || defaultFont,
      homePageFile: settings.find(s => s.key === 'font_home_page_file')?.value || '',
      homePageName: settings.find(s => s.key === 'font_home_page_name')?.value || '',

      aboutPage: settings.find(s => s.key === 'font_about_page')?.value || defaultFont,
      aboutPageFile: settings.find(s => s.key === 'font_about_page_file')?.value || '',
      aboutPageName: settings.find(s => s.key === 'font_about_page_name')?.value || '',

      contactPage: settings.find(s => s.key === 'font_contact_page')?.value || defaultFont,
      contactPageFile: settings.find(s => s.key === 'font_contact_page_file')?.value || '',
      contactPageName: settings.find(s => s.key === 'font_contact_page_name')?.value || '',
    }
  } catch (error) {
    console.error('Error fetching font settings:', error)
    const defaultFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    return {
      headerLogo: defaultFont,
      headerLogoFile: '',
      headerLogoName: '',
      headerNav: defaultFont,
      headerNavFile: '',
      headerNavName: '',
      homePage: defaultFont,
      homePageFile: '',
      homePageName: '',
      aboutPage: defaultFont,
      aboutPageFile: '',
      aboutPageName: '',
      contactPage: defaultFont,
      contactPageFile: '',
      contactPageName: '',
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fonts = await getFontSettings()

  // Helper function to get font format
  const getFontFormat = (filePath: string) => {
    if (filePath.endsWith('.woff2')) return 'woff2'
    if (filePath.endsWith('.woff')) return 'woff'
    if (filePath.endsWith('.otf')) return 'opentype'
    return 'truetype'
  }

  // Generate @font-face CSS for all uploaded fonts
  let fontFaceCSS = ''
  const addedFonts = new Set<string>()

  // Add @font-face for each section if a custom font is uploaded
  const fontSections = [
    { file: fonts.headerLogoFile, name: fonts.headerLogoName },
    { file: fonts.headerNavFile, name: fonts.headerNavName },
    { file: fonts.homePageFile, name: fonts.homePageName },
    { file: fonts.aboutPageFile, name: fonts.aboutPageName },
    { file: fonts.contactPageFile, name: fonts.contactPageName },
  ]

  fontSections.forEach(({ file, name }) => {
    if (file && name && !addedFonts.has(name)) {
      fontFaceCSS += `
        @font-face {
          font-family: "${name}";
          src: url("${file}") format("${getFontFormat(file)}");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `
      addedFonts.add(name)
    }
  })

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            ${fontFaceCSS}
            :root {
              --font-header-logo: ${fonts.headerLogo};
              --font-header-nav: ${fonts.headerNav};
              --font-home-page: ${fonts.homePage};
              --font-about-page: ${fonts.aboutPage};
              --font-contact-page: ${fonts.contactPage};
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
