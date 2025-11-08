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
      key: { in: ['contact_heading', 'contact_subtext'] }
    }
  })

  const contactHeading = settings.find(s => s.key === 'contact_heading')?.value || 'Contact'
  const contactSubtext = settings.find(s => s.key === 'contact_subtext')?.value || 'Interested in working together? Get in touch.'

  return { navigation, contactHeading, contactSubtext }
}

export default async function ContactPage() {
  const { navigation, contactHeading, contactSubtext } = await getPageData()

  return (
    <>
      <Header navigation={navigation} />
      <main className="bg-black min-h-screen pt-32">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-12 text-center"
            style={{ fontFamily: 'var(--font-contact-page)' }}
          >
            {contactHeading}
          </h1>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-white/10">
              <p
                className="text-white text-lg md:text-xl mb-8 text-center"
                style={{ fontFamily: 'var(--font-contact-page)' }}
              >
                {contactSubtext}
              </p>

              <form className="space-y-6" style={{ fontFamily: 'var(--font-contact-page)' }}>
                <div>
                  <label htmlFor="name" className="block text-white mb-2 text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2 text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 px-6 rounded font-medium hover:bg-white/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
