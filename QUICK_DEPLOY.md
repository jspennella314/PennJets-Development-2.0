# 🚀 QUICK DEPLOYMENT TO DIGITAL OCEAN

**Your Website:** www.pennjets.com → 167.71.184.95 (Digital Ocean)

---

## ⚡ FASTEST METHOD: SCP Upload

### Step 1: Upload the dist/ folder to your droplet

```bash
# From your Windows machine (PowerShell or WSL):
scp -r "C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0\dist\*" root@167.71.184.95:/var/www/html/
```

**Or if you have a specific user:**
```bash
scp -r "C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0\dist\*" your-user@167.71.184.95:/home/your-user/
```

### Step 2: SSH into your droplet and move files

```bash
ssh root@167.71.184.95
# Once logged in:
sudo cp -r /home/your-user/* /var/www/html/
sudo systemctl restart nginx
```

---

## 🐳 ALTERNATIVE: Docker Deployment

### Step 1: Upload entire project

```bash
scp -r "C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0" root@167.71.184.95:/opt/pennjets
```

### Step 2: SSH and run deployment script

```bash
ssh root@167.71.184.95
cd /opt/pennjets
sudo chmod +x deploy.sh
sudo ./deploy.sh
```

---

## 💻 ALTERNATIVE: Use FTP/SFTP Client

1. **Download FileZilla or WinSCP**
2. **Connect to:**
   - Host: `167.71.184.95`
   - Port: `22` (SFTP)
   - Username: `root` (or your user)
   - Password: Your droplet password/key

3. **Upload:**
   - Local: `C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0\dist\*`
   - Remote: `/var/www/html/`

4. **SSH in and restart nginx:**
   ```bash
   ssh root@167.71.184.95
   sudo systemctl restart nginx
   ```

---

## ✅ VERIFY DEPLOYMENT

After deploying, test:

1. **Website loads:** https://www.pennjets.com
2. **Contact form works:** https://www.pennjets.com/contact
3. **Submit test form** → Should see success message
4. **Check CRM:** https://www.pennforce.pennjets.com → Leads

---

## 🔑 IF YOU DON'T HAVE SSH ACCESS

You'll need to either:
1. Find your Digital Ocean credentials (check email/password manager)
2. Reset droplet password from Digital Ocean dashboard
3. Use Digital Ocean Console (web-based terminal)

**Digital Ocean Dashboard:** https://cloud.digitalocean.com/

---

## 🚨 QUICK TEST - Is Server Running?

```bash
# From your Windows machine:
ping 167.71.184.95
curl -I http://167.71.184.95
```

If ping works but curl doesn't, the server is up but nginx isn't serving files.

---

## 📝 WHAT'S IN THE NEW BUILD

The `dist/` folder contains:
- ✅ Fixed webhook URL (www.pennforce.pennjets.com)
- ✅ All 3 webhook IDs configured
- ✅ Contact form pointing to correct CRM
- ✅ Blog forms for Joe & James

**File size:** ~400KB total
**Build time:** 4.06 seconds

---

## 🎯 NEED HELP?

If you can't access the droplet:
1. Check Digital Ocean dashboard for access
2. Reset root password
3. Use Digital Ocean web console
4. Contact me with SSH credentials and I can deploy via script

**The webhook endpoint works - just needs the new website files deployed!**
