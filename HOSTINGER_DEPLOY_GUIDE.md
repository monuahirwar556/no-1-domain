# 🚀 Dukanrant Bid - Hostinger Deployment Guide

Aapke project ka complete, latest aur pre-tested deployment package ready hai:
📁 **File:** `DUKANRANT_HOSTINGER_DEPLOY.zip` (Project root folder me available hai)

> [!IMPORTANT]
> **🛡️ Zero Data Loss on Redeployment (Safe Re-deploy):**  
> Is ZIP file se live `dev.db` aur `.env` ko hata diya gaya hai. Iska fayda ye hai ki jab bhi aap Hostinger par nayi ZIP upload karke **Extract** karenge, **Hostinger par chal rahe purane customers, claims (₹50 claim) aur payments kabhi delete ya overwrite nahi honge!**

---

## 📌 Hostinger me Deployment ke 2 Tarike:

---

### Tarika 1: Hostinger Cloud / Business Web Hosting (hPanel Node.js)
*(Agar aapke Hostinger hPanel me "Node.js" ka option hai)*

1. **File Upload karein:**
   - Hostinger hPanel login karein aur **File Manager** open karein.
   - Apne domain ke folder (e.g. `public_html` ya `domains/yourdomain.com/public_html`) me jayein.
   - `DUKANRANT_HOSTINGER_DEPLOY.zip` ko upload karein aur **Extract** (Unzip) karein.

2. **Node.js Setup karein:**
   - hPanel ke search bar me **Node.js** search karein aur open karein.
   - **Create Application** par click karein:
     - **Node.js Version:** `18.x` ya `20.x`
     - **Application Root:** `public_html` (jis folder me files extract ki hain)
     - **Application Startup File:** `server.js`
   - **Save** par click karein.

3. **Dependencies Install karein:**
   - Node.js panel me **"NPM Install"** button par click karein ya **SSH/Terminal** open karke run karein:
     ```bash
     npm install --production
     npx prisma generate
     ```

4. **Environment Variables (.env) configure karein:**
   - File Manager me `.env` file open karein aur ye lines apne domain ke hisaab se update karein:
     ```env
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_URL="https://yourdomain.com"
     NEXT_PUBLIC_APP_URL="https://yourdomain.com"
     NEXTAUTH_SECRET="kuch-bhi-strong-random-key"
     
     # Razorpay Live Keys (agar payment live karna ho)
     RAZORPAY_KEY_ID="rzp_live_..."
     RAZORPAY_KEY_SECRET="..."
     NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
     ```

5. **Restart / Start Application:**
   - Node.js panel me jakar **Start Application** ya **Restart** click karein.
   - Website live ho jayegi!

---

### Tarika 2: Hostinger VPS (Ubuntu / Debian Server)
*(Sabse fast, best aur reliable tarika)*

1. **VPS par SSH connect karein:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Node.js, PM2 aur Nginx install karein (agar pehle se nahi hai):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx unzip
   sudo npm install -g pm2
   ```

3. **Project folder banakar Zip extract karein:**
   ```bash
   mkdir -p /var/www/dukanrant
   cd /var/www/dukanrant
   # DUKANRANT_HOSTINGER_DEPLOY.zip ko yahan upload karein (via SCP/FileZilla ya hPanel File Manager)
   unzip DUKANRANT_HOSTINGER_DEPLOY.zip
   ```

4. **Install & Database setup:**
   ```bash
   npm install --production
   npx prisma generate
   npx prisma db push
   ```

5. **PM2 ke sath start karein:**
   ```bash
   pm2 start server.js --name "dukanrant"
   pm2 save
   pm2 startup
   ```

6. **Nginx Reverse Proxy setup karein (`/etc/nginx/sites-available/default`):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Save karein aur Nginx reload karein:
   ```bash
   sudo systemctl reload nginx
   ```
   (SSL ke liye: `sudo certbot --nginx -d yourdomain.com`)

---

## 🛡️ महत्वपूर्ण: भविष्य में कोड अपडेट करने पर डेटा कैसे सुरक्षित रखें?
जब आपकी वेबसाइट लाइव हो जाए और असली ग्राहक (Customers), पेमेंट्स (Payments) और विज़िटर्स (Traffic) आने लगें:
1. भविष्य में जब भी आप वेबसाइट के डिज़ाइन या कोड में कोई नया बदलाव करें, तो सर्वर की मौजूदा `dev.db` फाइल को **डिलीट या रिप्लेस मत करें**!
2. नया कोड अनज़िप करते समय यदि `dev.db` को ओवरराइट करने का पूछे, तो `No` चुनें ताकि आपका पुराना लाइव डेटा जस-का-तस रहे।
3. सर्वर पर जब भी `server.js` स्टार्ट होता है, यह अपने आप `backups/dev_db_backup_latest.db` में लाइव डेटा का बैकअप बना लेता है।
4. कभी भी सर्वर पर बैकअप लेना हो तो टर्मिनल में यह कमांड चलाएं:
   ```bash
   node scripts/backup_db.js
   ```

---

### ⚠️ Note (Basic Shared Hosting):
Agar aapke paas basic PHP Shared Hosting hai jisme Node.js ka option nahi milta, toh Next.js ka full backend/database (Prisma + Razorpay + Auth) run karne ke liye aap:
- Ya toh **Hostinger VPS** use kar sakte hain,
- Ya frontend ko **Vercel** par free me deploy kar sakte hain aur domain Hostinger se connect kar sakte hain!
