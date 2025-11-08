# Photography Portfolio Website

A modern, database-driven photography portfolio with a complete admin panel. Built with Next.js 14, Prisma, Neon PostgreSQL, and Stack Auth.

## Overview

This is a professional photography website inspired by tibalism.com, featuring:
- Beautiful, animated portfolio showcasing your photography
- Complete admin panel at `/admin` for content management
- Database-backed content (no code changes needed to update)
- Secure authentication with Stack Auth
- Fully responsive design
- Deployed to Vercel with Neon database integration

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Features

### Frontend (Public Site)
- 🎨 Beautiful photography portfolio with smooth scroll animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 🖼️ Dynamic content loaded from database
- ✨ Intersection Observer scroll animations
- 🎯 SEO optimized with Next.js
- 🚀 Optimized images with Next.js Image component
- 📧 Contact form with database storage

### Admin Panel (`/admin`)
- 🔐 Secure authentication (Stack Auth)
- 📄 **Pages Management**: Create, edit, and delete pages
- 🖼️ **Images Management**: Upload and organize portfolio photos
- 🧩 **Sections Management**: Manage page content sections
- 🔗 **Navigation Management**: Edit menu items
- ⚙️ **Settings**: Configure site-wide settings (title, email, etc.)
- 📊 Dashboard with statistics and quick actions
- 📧 View contact form submissions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Auth**: Stack Auth
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## What You Can Do

### Without Writing Code

Using the admin panel at `/admin`, you can:

1. **Manage Pages**
   - Create new pages
   - Edit page content
   - Publish/unpublish pages
   - Delete pages

2. **Upload Images**
   - Add new portfolio photos (via URL)
   - Organize by category (portrait, landscape, B&W, etc.)
   - Set display order
   - Mark images as featured

3. **Edit Navigation**
   - Add/remove menu items
   - Change menu order
   - Show/hide menu items
   - Link to pages or sections

4. **Update Settings**
   - Change site title
   - Update contact email
   - Modify site description

5. **View Contact Submissions**
   - See all contact form submissions
   - Mark as read/unread

### Sections You Can Manage

Each page can have multiple sections:
- **HERO**: Full-screen hero with image and text
- **ABOUT**: About text with centered content
- **PORTFOLIO**: Image grid with lightbox
- **CATEGORY**: Categorized image sections
- **CONTACT**: Contact form
- **CUSTOM**: Custom HTML content

## Project Structure

```
steven-website/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin panel
│   │   ├── api/            # API routes
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   ├── lib/               # Utilities (Prisma, Auth)
│   └── middleware.ts      # Auth protection
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Initial data
├── .env                   # Environment variables
└── SETUP.md              # Detailed setup guide
```

## Database Models

- **Page**: Website pages (home, about, etc.)
- **Section**: Content sections within pages
- **Image**: Portfolio photos
- **Navigation**: Menu items
- **SiteSettings**: Global settings
- **ContactSubmission**: Contact form data

## Documentation

📖 **[Read SETUP.md](SETUP.md)** for detailed documentation including:
- Complete installation instructions
- Database schema details
- API routes documentation
- Deployment guide
- Customization options
- Troubleshooting

## Environment Variables

Your environment variables are already configured in `.env`:
- Neon database credentials
- Stack Auth credentials
- Next.js configuration

**Important**: Never commit `.env` to git (it's in `.gitignore`)

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed sample data
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add Neon integration in Vercel dashboard
4. Deploy

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Connect to Neon database
- Deploy to production

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## Admin Access

1. Go to `/admin`
2. Sign up/sign in with Stack Auth
3. Start managing your content

## Image Hosting

For portfolio images, use:
- **Cloudinary** (recommended)
- **Unsplash**
- **ImgBB**
- **Any service with direct image URLs**

Simply paste the image URL in the admin panel when uploading.

## Support & Documentation

- [SETUP.md](SETUP.md) - Complete setup and usage guide
- [Prisma Docs](https://www.prisma.io/docs) - Database ORM
- [Next.js Docs](https://nextjs.org/docs) - Framework
- [Stack Auth Docs](https://docs.stackauth.com) - Authentication

## Credits

- Design inspiration: tibalism.com
- Built with Next.js, Prisma, Neon, and Stack Auth
- All animations and layouts preserved from original design

## License

Private project. All rights reserved.
