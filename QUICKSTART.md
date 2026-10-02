# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- `DATABASE_URL` - Your database connection string
- `ANTHROPIC_API_KEY` - From https://console.anthropic.com
- `GEMINI_API_KEY` - From https://makersuite.google.com/app/apikey
- `NEXTAUTH_SECRET` - Any random string (min 32 chars)

### 3. Setup Database
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Visit `http://localhost:3000`

Use demo credentials:
- Email: demo@example.com
- Password: demo123456

---

## Using with Supabase

### 1. Create Supabase Project
- Go to https://supabase.com
- Create new project
- Get connection string from Project Settings → Database → URI

### 2. Update Environment
```env
DATABASE_URL="your-supabase-connection-string"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Push Schema
```bash
npx prisma db push
```

---

## Using with MongoDB

### 1. Install MongoDB or use MongoDB Atlas
- Local: `brew install mongodb-community` (macOS)
- Cloud: https://www.mongodb.com/cloud/atlas

### 2. Update Environment
```env
DATABASE_URL="mongodb://localhost:27017/chatbot"
DATABASE_PROVIDER="mongodb"
```

### 3. Push Schema
```bash
npx prisma db push
```

---

## Get API Keys

### Anthropic
1. Visit https://console.anthropic.com
2. Sign up/login
3. Go to API Keys
4. Create new key
5. Copy to `.env.local` as `ANTHROPIC_API_KEY`

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy to `.env.local` as `GEMINI_API_KEY`

---

## Common Issues

### "Cannot find module" error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Database connection failed
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection with psql (PostgreSQL)
psql $DATABASE_URL

# For MongoDB, test with:
mongosh $DATABASE_URL
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Build & Production
npm run build        # Build for production
npm start           # Start production server

# Database
npx prisma db push      # Push schema changes
npx prisma studio      # Open Prisma Studio (GUI)
npx prisma generate    # Generate Prisma client

# Linting
npm run lint        # Run ESLint

# Docker
docker build -t chatbot .    # Build image
docker run -p 3000:3000 chatbot  # Run container
```

---

## Next Steps

1. ✅ Setup complete! Start chatting
2. 📝 Customize the UI in `src/components/`
3. 🔐 Add email verification for signups
4. 📊 Add analytics
5. 🌍 Deploy to Vercel/Railway/Render

---

For detailed setup, see `README.md`
