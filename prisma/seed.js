const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { key: 'site_title' },
    update: {},
    create: {
      key: 'site_title',
      value: 'Steven Quach',
      description: 'Website title',
      category: 'general',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Unique moments seen through a creative lens',
      description: 'Website description',
      category: 'general',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'contact_email' },
    update: {},
    create: {
      key: 'contact_email',
      value: 'hello@example.com',
      description: 'Contact email address',
      category: 'contact',
    },
  });

  // Create navigation items
  const navItems = [
    { label: 'About', href: '#about', order: 1 },
    { label: 'Contact', href: '#contact', order: 2 },
  ];

  for (const item of navItems) {
    await prisma.navigation.upsert({
      where: { id: `nav-${item.order}` },
      update: item,
      create: {
        id: `nav-${item.order}`,
        ...item,
        visible: true,
      },
    });
  }

  // Create images directly (no sections needed)
  const images = [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Mountain landscape', order: 1 },
    { url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800', alt: 'Portrait', order: 2 },
    { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', alt: 'Nature scene', order: 3 },
    { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800', alt: 'Landscape', order: 4 },
    { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', alt: 'Nature', order: 5 },
    { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800', alt: 'Sunset', order: 6 },
    { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800', alt: 'Flower', order: 7 },
    { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', alt: 'Architecture', order: 8 },
    { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800', alt: 'Lake', order: 9 },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Person', order: 10 },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', alt: 'City', order: 11 },
    { url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800', alt: 'Portrait 2', order: 12 },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', alt: 'Portrait 3', order: 13 },
    { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', alt: 'Forest', order: 14 },
    { url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800', alt: 'Ocean', order: 15 },
    { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', alt: 'Travel', order: 16 },
  ];

  for (const imgData of images) {
    await prisma.image.create({
      data: {
        ...imgData,
        sectionId: null,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
