# ReplyWise: AI Chatbot Platform — Deployment Guide

## Vercel (Recommended - Easiest)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- GitHub repository with the code

### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/chatbot-app.git
git push -u origin main
```

2. **Connect to Vercel**
- Visit https://vercel.com/new
- Select "Import Git Repository"
- Choose your GitHub repo
- Click "Import"

3. **Configure Environment**
- In Vercel dashboard, go to Settings → Environment Variables
- Add all variables from `.env.local`:
  - `DATABASE_URL`
  - `ANTHROPIC_API_KEY`
  - `GEMINI_API_KEY`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (set to your Vercel domain)
  - `JWT_SECRET`

4. **Deploy Database**
- If using Supabase: No action needed
- If using MongoDB Atlas: Add connection string

5. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your new URL

---

## Railway.app (Docker-based)

### Steps

1. **Create Railway Account**
- Visit https://railway.app
- Sign up with GitHub

2. **Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

3. **Add PostgreSQL Plugin**
- Click "Add Plugin"
- Select "PostgreSQL"
- Confirm

4. **Set Environment Variables**
- In your project settings:
- Add all `.env.local` variables
- Railway auto-generates `DATABASE_URL` from PostgreSQL plugin

5. **Deploy**
- Railway auto-deploys on push to main branch

### Cost
- Free tier includes 500 hours/month
- PostgreSQL included

---

## Render.com

### Steps

1. **Create Account**
- Visit https://render.com
- Sign up with GitHub

2. **Create Web Service**
- Click "New +" → "Web Service"
- Connect GitHub repository
- Select branch and directory

3. **Configure**
- Name: `chatbot-app`
- Environment: `Node`
- Build Command: `npm run build`
- Start Command: `npm start`
- Instance Type: Free tier or Starter

4. **Add Database**
- Click "New +" → "PostgreSQL"
- Enter instance name
- Copy connection string

5. **Set Environment Variables**
- Add all `.env.local` variables
- Set `DATABASE_URL` to PostgreSQL connection string
- Set `NEXTAUTH_URL` to your Render domain

6. **Deploy**
- Click "Create Web Service"
- Wait for build and deploy

---

## Netlify + Supabase

### Steps

1. **Create Supabase Project**
- Visit https://supabase.com
- Create new project
- Get connection string and API keys

2. **Connect to Netlify**
- Visit https://netlify.com
- Click "Add new site" → "Import an existing project"
- Select GitHub repository

3. **Configure Build**
- Build command: `npm run build`
- Publish directory: `.next`

4. **Set Environment Variables**
- Add all variables including Supabase credentials

5. **Deploy**
- Push to main branch
- Netlify auto-deploys

---

## Self-Hosted (VPS/Dedicated Server)

### Prerequisites
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name
- SSH access
- Docker installed

### Steps

1. **SSH into Server**
```bash
ssh root@your_server_ip
```

2. **Install Dependencies**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt install nginx -y
```

3. **Clone Repository**
```bash
git clone https://github.com/username/chatbot-app.git
cd chatbot-app
```

4. **Create .env File**
```bash
cp .env.example .env
nano .env  # Edit with your values
```

5. **Start Services**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

6. **Configure Nginx**
```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/chatbot

# Add:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Enable HTTPS (Let's Encrypt)**
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

8. **Monitor Services**
```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart
docker-compose restart app
```

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm run test || true

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Monitoring & Maintenance

### Uptime Monitoring
- UptimeRobot (free)
- Statuspage.io
- Pingdom

### Performance Monitoring
- Vercel Analytics
- New Relic APM
- Datadog

### Logs
- Vercel: Deployments → Runtime Logs
- Railway: Logs tab
- Self-hosted: `docker-compose logs`

### Database Backups
- Enable automatic backups in Supabase/MongoDB Atlas
- Regular exports: `pg_dump` for PostgreSQL

---

## Troubleshooting Deployments

### Build fails
- Check build logs
- Verify all environment variables set
- Test locally: `npm run build`

### Database connection error
- Verify `DATABASE_URL` format
- Check database is accessible from deployment IP
- Test connection string

### 502 Bad Gateway
- Check if app is running: `docker-compose ps`
- View logs: `docker-compose logs app`
- Restart app: `docker-compose restart app`

### Slow performance
- Check database indexes
- Enable caching
- Use CDN for static assets

---

For platform-specific help:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Render: https://render.com/docs
