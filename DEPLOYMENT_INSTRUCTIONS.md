# PennJets Deployment Instructions

## 🚨 URGENT: DNS Issue Resolution

Your DNS is correctly configured and pointing to **167.71.184.95** (Digital Ocean droplet), but the website isn't deployed yet. Here's the complete solution:

## Current DNS Status ✅
- **Domain**: pennjets.com → 167.71.184.95 (Digital Ocean)
- **Email**: Google Workspace (smtp.google.com) ✅
- **Nameservers**: Google Cloud DNS ✅

## Deployment Options

### Option 1: Deploy to Digital Ocean (RECOMMENDED)

1. **Upload files to your droplet (167.71.184.95)**:
   ```bash
   # On your Digital Ocean droplet, run:
   cd /opt
   sudo git clone <your-repo-url> pennjets
   cd pennjets
   
   # Or upload these files via SCP/SFTP:
   # - docker-compose.yml
   # - Dockerfile  
   # - nginx.conf
   # - dist/ folder (built React app)
   ```

2. **Run the deployment script**:
   ```bash
   sudo chmod +x deploy.sh
   sudo ./deploy.sh
   ```

### Option 2: Manual Docker Deployment

```bash
# On your Digital Ocean droplet:
sudo docker build -t pennjets-app .
sudo docker run -d -p 80:80 --name pennjets pennjets-app
```

### Option 3: Static File Deployment

```bash
# Copy the dist/ folder contents to:
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

## Expected Results

Once deployed, visitors to:
- **pennjets.com** → Your React app on Digital Ocean ✅
- **email@pennjets.com** → Google Workspace ✅

## Troubleshooting

**If website still doesn't load after deployment:**

1. Check firewall:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   ```

2. Check nginx status:
   ```bash
   sudo systemctl status nginx
   ```

3. Check Docker container:
   ```bash
   sudo docker ps
   sudo docker logs <container-id>
   ```

## Security Recommendations

1. **Enable HTTPS** with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d pennjets.com -d www.pennjets.com
   ```

2. **Update nginx.conf** to redirect HTTP to HTTPS after SSL setup

## Next Steps

1. Deploy to Digital Ocean using one of the methods above
2. Test website accessibility 
3. Set up SSL certificate
4. Configure Google Analytics (mentioned in README)
5. Set up contact form backend if needed

Your DNS propagation is NOT the issue - it's working perfectly. You just need to deploy the application to make it accessible.