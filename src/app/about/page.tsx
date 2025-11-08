import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getPageData() {
  const navigation = await prisma.navigation.findMany({
    where: { visible: true, parentId: null },
    orderBy: { order: 'asc' },
  })

  const settings = await prisma.siteSettings.findMany({
    where: {
      key: { in: ['about_heading', 'about_text_1', 'about_text_2', 'about_text_3'] }
    }
  })

  const aboutHeading = settings.find(s => s.key === 'about_heading')?.value || 'About'
  const aboutText1 = settings.find(s => s.key === 'about_text_1')?.value || ''
  const aboutText2 = settings.find(s => s.key === 'about_text_2')?.value || ''
  const aboutText3 = settings.find(s => s.key === 'about_text_3')?.value || ''

  return { navigation, aboutHeading, aboutText1, aboutText2, aboutText3 }
}

export default async function AboutPage() {
  const { navigation, aboutHeading, aboutText1, aboutText2, aboutText3 } = await getPageData()

  return (
    <>
      <Header navigation={navigation} />
      <main className="bg-black min-h-screen pt-32">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-12 text-center"
            style={{ fontFamily: 'var(--font-about-page)' }}
          >
            {aboutHeading}
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="text-white space-y-8" style={{ fontFamily: 'var(--font-about-page)' }}>
              {aboutText1 && (
                <p className="text-lg md:text-xl leading-relaxed">
                  {aboutText1}
                </p>
              )}

              {aboutText2 && (
                <p className="text-lg md:text-xl leading-relaxed">
                  {aboutText2}
                </p>
              )}

              {aboutText3 && (
                <p className="text-lg md:text-xl leading-relaxed">
                  {aboutText3}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
