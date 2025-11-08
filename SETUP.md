# Photography Website - Setup Guide

A modern, database-driven photography portfolio with a complete admin panel. Built with Next.js 14, Prisma, Neon PostgreSQL, and Stack Auth.

## Features

### Frontend
- 🎨 Beautiful photography portfolio with smooth animations
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🖼️ Dynamic content loaded from database
- ✨ Scroll-triggered animations
- 🎯 SEO optimized
- 🚀 Optimized images with Next.js Image component

### Admin Panel (`/admin`)
- 🔐 Secure authentication with Stack Auth
- 📄 **Pages Management**: Create, edit, delete pages
- 🖼️ **Images Management**: Upload and organize photos
- 🧩 **Sections Management**: Manage page sections
- 🔗 **Navigation Management**: Edit menu items
- ⚙️ **Settings**: Configure site-wide settings
- 📊 Dashboard with statistics
- 📧 Contact form submissions tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Authentication**: Stack Auth
- **Hosting**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon database account (you already have credentials)
- Stack Auth account (you already have credentials)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already created with your Neon and Stack Auth credentials. Make sure it's not committed to git (it's in `.gitignore`).

### 3. Initialize Database

Push the Prisma schema to your Neon database:

```bash
npm run db:push
```

This will create all the necessary tables in your Neon database.

### 4. Seed Initial Data

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- A home page with sample sections
- Sample portfolio images
- Navigation menu items
- Site settings

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Project Structure

```
steven-website/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Initial data seeding
├── src/
│   ├── app/
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx    # Dashboard
│   │   │   ├── pages/      # Pages management
│   │   │   ├── images/     # Images management
│   │   │   ├── navigation/ # Navigation management
│   │   │   └── settings/   # Settings management
│   │   ├── api/            # API routes
│   │   │   ├── pages/
│   │   │   ├── sections/
│   │   │   ├── images/
│   │   │   ├── navigation/
│   │   │   ├── settings/
│   │   │   └── contact/
│   │   ├── login/          # Login page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Portfolio.tsx
│   │   ├── About.tsx
│   │   ├── Category.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client
│   │   └── stack.ts        # Stack Auth config
│   └── middleware.ts       # Auth middleware
├── .env                    # Environment variables (NOT in git)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Using the Admin Panel

### 1. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

### 2. Sign In

You'll be redirected to `/login`. Create an account using Stack Auth.

### 3. Admin Features

#### Pages Management (`/admin/pages`)
- View all pages
- Create new pages
- Edit page details (title, slug, description)
- Publish/unpublish pages
- Delete pages
- Manage page sections

#### Images Management (`/admin/images`)
- View all images in a grid
- Upload new images (via URL)
- Organize by category
- Mark images as featured
- Delete images

**Image URLs**: Use services like:
- Cloudinary
- Unsplash
- ImgBB
- Any image hosting with direct URLs

#### Navigation Management (`/admin/navigation`)
- Add/remove menu items
- Reorder navigation
- Show/hide menu items
- Link to pages or sections

#### Settings (`/admin/settings`)
- Update site title
- Change contact email
- Modify site description

## Database Schema

### Main Models

1. **Page** - Website pages
   - title, slug, description
   - published status
   - order for sorting

2. **Section** - Page sections
   - type (HERO, ABOUT, PORTFOLIO, etc.)
   - title, subtitle, content
   - layout type
   - order

3. **Image** - Photo gallery
   - URL, alt text, title
   - category, tags
   - featured status
   - order

4. **Navigation** - Menu items
   - label, href
   - order, visibility
   - parent/child relationships

5. **SiteSettings** - Global settings
   - key/value pairs
   - categories

6. **ContactSubmission** - Contact form data
   - name, email, message
   - read status

## API Routes

All API routes support standard REST methods:

- `GET /api/pages` - List all pages
- `POST /api/pages` - Create page
- `PUT /api/pages` - Update page
- `DELETE /api/pages?id=xxx` - Delete page

Same pattern for:
- `/api/sections`
- `/api/images`
- `/api/navigation`
- `/api/settings`
- `/api/contact`

## Deployment to Vercel

### 1. Connect to Vercel

```bash
vercel login
vercel
```

### 2. Add Environment Variables

In Vercel dashboard, add all environment variables from `.env`:
- All `DATABASE_*` variables
- All `POSTGRES_*` variables
- All `NEXT_PUBLIC_STACK_*` variables
- `STACK_SECRET_SERVER_KEY`

Or use the Neon integration in Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Go to Integrations
4. Add Neon integration
5. Connect your Neon project

### 3. Deploy

```bash
vercel --prod
```

### 4. Run Database Migration

After first deployment, run:

```bash
vercel env pull .env.production.local
npm run db:push
npm run db:seed
```

## Customization

### Change Colors

Edit `tailwind.config.js` and `src/app/globals.css`:

```css
:root {
  --color-primary: #2c3e50;    /* Your brand color */
  --color-secondary: #3498db;
  --color-accent: #1abc9c;
}
```

### Add New Section Types

1. Add to `prisma/schema.prisma`:
```prisma
enum SectionType {
  HERO
  ABOUT
  PORTFOLIO
  YOUR_NEW_TYPE  // Add here
}
```

2. Create component in `src/components/YourSection.tsx`

3. Add to `src/app/page.tsx` switch statement

4. Run `npm run db:push`

### Modify Database

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Update components/API routes as needed

## Prisma Studio

View and edit database directly:

```bash
npm run db:studio
```

Opens visual database editor at [http://localhost:5555](http://localhost:5555)

## Troubleshooting

### Database Connection Issues

- Verify `.env` has correct `DATABASE_URL`
- Check Neon dashboard for database status
- Ensure IP allowlist includes your IP (if configured)

### Auth Not Working

- Verify Stack Auth credentials in `.env`
- Check Stack dashboard for project status
- Clear browser cookies and try again

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npm run postinstall
```

### Images Not Loading

- Verify image URLs are publicly accessible
- Add domains to `next.config.js`:
```js
images: {
  domains: ['your-image-host.com'],
}
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

## Adding More Features

### Email Notifications

Install nodemailer or use Resend:

```bash
npm install resend
```

Update `/api/contact` to send emails on form submission.

### Image Upload to Cloudinary

```bash
npm install cloudinary
```

Create upload endpoint in `/api/upload`.

### Blog Section

1. Create `Post` model in Prisma
2. Add blog API routes
3. Create blog components
4. Add to admin panel

## Support

For issues:
1. Check this SETUP guide
2. Review Prisma docs: https://www.prisma.io/docs
3. Check Next.js docs: https://nextjs.org/docs
4. Stack Auth docs: https://docs.stackauth.com

## License

Private project. All rights reserved.
