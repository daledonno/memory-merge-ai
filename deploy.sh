#!/bin/bash

# Memory Merge AI - VPS Deployment Script
echo "🚀 Deploying Memory Merge AI to VPS..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 (if not already installed)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx (if not already installed)
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/memory-merge-ai
sudo chown -R $USER:$USER /var/www/memory-merge-ai

# Copy application files
echo "📋 Copying application files..."
cp -r . /var/www/memory-merge-ai/

# Navigate to app directory
cd /var/www/memory-merge-ai

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'memory-merge-ai',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/memory-merge-ai',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/memory-merge-ai << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/memory-merge-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://your-domain.com"
echo "📊 Monitor with: pm2 status"
echo "📝 View logs with: pm2 logs memory-merge-ai"
