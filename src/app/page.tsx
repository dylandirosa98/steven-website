import { prisma } from '@/lib/prisma'
import Hero from '@/components/Hero'
import PhotoGrid from '@/components/PhotoGrid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

async function getPageData() {
  const navigation = await prisma.navigation.findMany({
    where: { visible: true, parentId: null },
    orderBy: { order: 'asc' },
  })

  const images = await prisma.image.findMany({
    orderBy: { order: 'asc' },
  })

  const settings = await prisma.siteSettings.findMany({
    where: {
      key: { in: ['hero_image', 'hero_title'] }
    }
  })

  const heroImage = settings.find(s => s.key === 'hero_image')?.value || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920'
  const heroTitle = settings.find(s => s.key === 'hero_title')?.value || 'Photography by Steven Quach'

  return { navigation, images, heroImage, heroTitle }
}

export default async function Home() {
  const { navigation, images, heroImage, heroTitle } = await getPageData()

  return (
    <>
      <Header navigation={navigation} />
      <main>
        <Hero
          image={heroImage}
          title={heroTitle}
        />
        <PhotoGrid images={images} />
      </main>
      <Footer />
    </>
  )
}
