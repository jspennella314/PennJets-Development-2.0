#!/bin/bash

# PennJets Deployment Script for Digital Ocean
# Run this script on your Digital Ocean droplet (167.71.184.95)

echo "🚀 Starting PennJets deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create deployment directory
sudo mkdir -p /opt/pennjets
cd /opt/pennjets

# Stop any existing containers
sudo docker-compose down 2>/dev/null || true

# Deploy the application
echo "Building and starting PennJets application..."
sudo docker-compose up -d --build

# Check if container is running
if sudo docker-compose ps | grep -q "Up"; then
    echo "✅ PennJets deployed successfully!"
    echo "🌐 Your website is now live at http://pennjets.com"
    
    # Show container status
    sudo docker-compose ps
    
    # Show logs
    echo "📋 Recent logs:"
    sudo docker-compose logs --tail=20
else
    echo "❌ Deployment failed. Check logs:"
    sudo docker-compose logs
fi

echo "🔧 To manage your deployment:"
echo "  - View logs: sudo docker-compose logs"
echo "  - Restart: sudo docker-compose restart"
echo "  - Stop: sudo docker-compose down"
echo "  - Update: sudo docker-compose up -d --build"