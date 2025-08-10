# Ayrshaer CMS - Content Management System

## Project Overview
Ayrshaer CMS is a comprehensive content management system with integrated payment processing, analytics, and AI-driven features. Built as a full-stack web application with modern technologies.

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Payments**: Stripe integration
- **Analytics**: Google Analytics
- **AI**: Gemini AI for content recommendations and creation
- **Deployment**: Replit

## Core Features
- User authentication and authorization
- Dashboard for content, media, and product management
- Article management with multi-language support
- Media library management
- Product catalog with inventory tracking
- Stripe payment integration
- Google Analytics tracking
- Gemini AI content recommendations and creation
- Analytics reports and insights
- Freemium subscription model

## Architecture Decisions
- Using database storage instead of memory storage for persistence
- Implementing role-based access control for freemium model
- Separating concerns with dedicated modules for payments, analytics, and AI
- Using TypeScript for type safety across frontend and backend

## User Preferences
- Focus on clean, modern UI/UX
- Comprehensive feature set with scalable architecture
- Production-ready implementation with proper error handling

## Recent Changes
- 2025-01-10: Project initialization and database setup
- 2025-01-10: Core schema design for articles, media, products, and users

## Next Steps
- Implement authentication system
- Create core CRUD operations
- Build dashboard interface
- Integrate external services (Stripe, Analytics, Gemini)