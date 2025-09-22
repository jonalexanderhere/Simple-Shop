# Yilzi Digital Solutions - E-commerce Website

A modern, full-stack e-commerce website built with Next.js 15, Supabase, and TypeScript. Features a beautiful blue-themed design with glass morphism effects, comprehensive admin dashboard, real-time analytics, and WhatsApp integration.

## 🚀 Features

### Frontend Features
- **Modern Design**: Beautiful blue gradient theme with glass morphism effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Product Showcase**: Interactive product grid with detailed product pages
- **Shopping Cart**: Full shopping cart functionality with session persistence
- **Contact Forms**: Multiple contact forms with validation
- **Testimonials**: Customer testimonials with ratings
- **Real-time Analytics**: Live visitor tracking and statistics

### Backend Features
- **Supabase Integration**: PostgreSQL database with Row Level Security (RLS)
- **Admin Dashboard**: Comprehensive admin panel for managing all aspects
- **Order Management**: Complete order processing system
- **WhatsApp Integration**: Automatic order notifications via WhatsApp
- **Visitor Tracking**: Real-time visitor analytics and behavior tracking
- **Contact Management**: Customer inquiry management system

### Admin Dashboard Features
- **Real-time Monitoring**: Live statistics and system health monitoring
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Processing**: View and manage customer orders
- **Customer Messages**: Handle customer inquiries and support requests
- **Analytics Dashboard**: Comprehensive analytics with charts and graphs
- **User Management**: Manage customer accounts and data

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui components
- **Charts**: Recharts for analytics visualization
- **Authentication**: Supabase Auth
- **TypeScript**: Full type safety
- **Icons**: Lucide React icons

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Basic knowledge of React/Next.js

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd yilzishop
npm install
\`\`\`

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (automatically provided by Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host

# Admin Configuration
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_ADMIN_USERNAME=your_admin_username

# Development Redirect URL (for email confirmations)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### 3. Database Setup

The project includes SQL scripts to set up your database. Run these scripts in order:

1. **Create Database Schema**:
   \`\`\`sql
   -- Run scripts/001_create_database_schema.sql in your Supabase SQL editor
   \`\`\`

2. **Seed Sample Data**:
   \`\`\`sql
   -- Run scripts/002_seed_sample_data.sql in your Supabase SQL editor
   \`\`\`

3. **Fix RLS Policies**:
   \`\`\`sql
   -- Run scripts/005_fix_all_rls_policies.sql in your Supabase SQL editor
   \`\`\`

### 4. Supabase Configuration

#### Row Level Security (RLS) Setup
The database uses RLS for security. The policies are configured to:
- Allow public access to products and testimonials
- Allow anonymous visitor tracking
- Protect user data and admin functions
- Enable session-based cart functionality

#### Authentication Setup
1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Configure email templates and redirect URLs
4. Enable email confirmations if desired

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

\`\`\`
yilzishop/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/           # Main admin dashboard
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   ├── messages/            # Customer messages
│   │   └── login/               # Admin login
│   ├── products/                # Product pages
│   ├── cart/                    # Shopping cart
│   ├── contact/                 # Contact page
│   ├── about/                   # About page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── ui/                      # shadcn/ui components
│   ├── cart/                    # Shopping cart components
│   ├── products/                # Product-related components
│   └── layout/                  # Layout components
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase client configuration
│   ├── visitor-tracker.ts      # Visitor tracking system
│   └── utils.ts                # General utilities
├── scripts/                     # Database scripts
│   ├── 001_create_database_schema.sql
│   ├── 002_seed_sample_data.sql
│   └── 005_fix_all_rls_policies.sql
└── middleware.ts               # Next.js middleware for auth
\`\`\`

## 🔧 Configuration

### Admin Access
- Default admin route: `/admin/login`
- Use the credentials set in your environment variables
- Admin dashboard provides full control over the website

### Database Tables
The system uses the following main tables:
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart contents
- `users` - Customer accounts
- `contact_messages` - Customer inquiries
- `testimonials` - Customer reviews
- `visitor_tracking` - Analytics data
- `daily_analytics` - Aggregated statistics

### Visitor Tracking
The system automatically tracks:
- Page views and user sessions
- Device type and browser information
- Geographic location (country/city)
- Visit duration and behavior
- Referrer information

## 🎨 Customization

### Design System
The website uses a custom blue-themed design system:
- Primary colors: Blue gradients (#3B82F6 to #1E40AF)
- Glass morphism effects with backdrop blur
- Consistent spacing and typography
- Responsive breakpoints

### Modifying Colors
Edit the CSS variables in `app/globals.css`:
\`\`\`css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Add your custom colors */
}
\`\`\`

### Adding New Products
1. Use the admin dashboard at `/admin/products`
2. Or insert directly into the `products` table
3. Ensure `is_active` is set to `true` for public visibility

## 🔒 Security

### Row Level Security (RLS)
All database tables use RLS policies to ensure:
- Users can only access their own data
- Public data (products, testimonials) is accessible to all
- Admin functions are properly protected
- Anonymous visitor tracking is allowed

### Authentication
- Supabase handles user authentication
- Admin routes are protected by middleware
- Session management is automatic

## 📊 Analytics & Monitoring

### Real-time Dashboard
The admin dashboard provides:
- Live visitor count and statistics
- Order tracking and management
- System health monitoring
- Revenue and conversion analytics

### Visitor Tracking
Automatic tracking includes:
- Page views and unique visitors
- Session duration and bounce rate
- Geographic distribution
- Device and browser analytics

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Supabase credentials
- Admin credentials
- Database connection strings

## 🛠 Development

### Adding New Features
1. Create components in the appropriate directory
2. Add database tables/columns as needed
3. Update RLS policies for new tables
4. Test thoroughly in development

### Database Migrations
1. Create new SQL files in the `scripts/` directory
2. Use incremental numbering (003_, 004_, etc.)
3. Test migrations in development first
4. Apply to production database

## 🐛 Troubleshooting

### Common Issues

**Supabase Connection Errors**:
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies allow required operations

**Admin Login Issues**:
- Verify admin credentials in environment variables
- Check middleware configuration
- Ensure admin routes are properly protected

**Visitor Tracking Errors**:
- Check RLS policies for visitor_tracking table
- Verify anonymous access is enabled
- Check browser console for JavaScript errors

**Database Permission Errors**:
- Review RLS policies
- Check user authentication status
- Verify table permissions

### Getting Help
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify environment variables are set correctly
4. Check database RLS policies

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review the Supabase documentation
- Open an issue in the repository

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies.**
