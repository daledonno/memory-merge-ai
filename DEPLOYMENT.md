# Memory Merge AI - VPS Deployment Guide

## 🚀 Quick Deployment

### 1. Upload Files to VPS
```bash
# Upload the entire project folder to your VPS
scp -r . user@your-vps-ip:/home/user/memory-merge-ai
```

### 2. Run Deployment Script
```bash
# SSH into your VPS
ssh user@your-vps-ip

# Navigate to project directory
cd /home/user/memory-merge-ai

# Make deployment script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

### 3. Configure Environment Variables
```bash
# Create production environment file
nano /var/www/memory-merge-ai/.env.local
```

Add these variables:
```env
# FAL AI API Key
FAL_KEY=f842343c-8953-4215-bc95-78b61df4afc5:fcc1f2cb204cf7ce9a1bc23019b56056

# Printful API Key (get OAuth token from https://developers.printful.com/)
PRINTFUL_API_KEY=your_printful_oauth_token_here

# Node Environment
NODE_ENV=production
```

### 4. Configure Domain
```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/memory-merge-ai

# Replace 'your-domain.com' with your actual domain
# Save and restart Nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📊 Management Commands

### PM2 Process Management
```bash
# Check status
pm2 status

# View logs
pm2 logs memory-merge-ai

# Restart app
pm2 restart memory-merge-ai

# Stop app
pm2 stop memory-merge-ai
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

## 🔧 Troubleshooting

### Check Application Logs
```bash
pm2 logs memory-merge-ai --lines 50
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check if Port 3000 is Running
```bash
sudo netstat -tlnp | grep :3000
```

## 🌐 Domain Setup

1. **Point your domain to VPS IP** in your DNS settings
2. **Update Nginx config** with your actual domain name
3. **Restart Nginx** after domain changes
4. **Test the site** at your domain

## 💰 Cost Optimization

- **VPS Requirements**: 1GB RAM, 1 CPU core minimum
- **Estimated Cost**: $5-10/month for basic VPS
- **Bandwidth**: Unlimited on most VPS providers
- **Storage**: 20GB should be sufficient

## 🔒 Security Notes

- Keep your API keys secure
- Use environment variables for sensitive data
- Enable firewall on your VPS
- Keep system packages updated
- Use SSL certificates for production
