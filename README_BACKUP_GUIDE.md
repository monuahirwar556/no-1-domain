# 📦 NO. 1 DOMAIN — Complete Source Code Backup & Development Guide
**Platform:** NO. 1 DOMAIN (no1domain.in)  
**Powered by:** Dukanrant (Proprietor: MONU AHIRWAR)  
**Date of Backup:** October 2026  

---

## 🌟 यह क्या है? (What is this?)
यह आपकी पूरी वेबसाइट का **कंप्लीट ओरिजिनल सोर्स कोड (Complete Source Code)** है। 
आप इस ज़िप फाइल को हमेशा के लिए अपने **Google Drive** या कंप्यूटर में सुरक्षित (Backup) रख सकते हैं। 
भविष्य में जब भी आपको कोई बदलाव (Editing), नए फीचर्स जोड़ना, या नए सर्वर पर डिप्लॉय करना हो, आप इसे कभी भी उपयोग कर सकते हैं।

---

## 🛠️ जब भविष्य में कोई बदलाव करना हो तो कैसे चलाएं? (How to Run & Edit)

### Step 1: फाइल Unzip करें
ज़िप फाइल पर Right Click करें और **Extract All** (या 7-Zip / WinRAR) से किसी भी फोल्डर में निकालें।

### Step 2: VS Code / IDE में खोलें
फोल्डर को **Visual Studio Code**, Cursor या Antigravity में Open Folder करें।

### Step 3: Dependencies इनस्टॉल करें
टर्मिनल (Terminal) खोलें और यह कमांड चलाएं:
```bash
npm install
```

### Step 4: डेटाबेस सिंक करें (Database Sync)
डेटाबेस टेबल और स्कीमा को तैयार करने के लिए:
```bash
npx prisma generate
```

### Step 5: डेवलपमेंट सर्वर चालू करें (Run Locally)
वेबसाइट को अपने कंप्यूटर पर लाइव देखने के लिए:
```bash
npm run dev
```
अब अपने ब्राउज़र में खोलें:
👉 `http://localhost:3000`

---

## 📂 कौन-सी फाइल कहाँ है और क्या बदल सकते हैं? (Folder Structure)

| फ़ाइल / फ़ोल्डर | क्या काम करता है? |
|---|---|
| `src/app/page.tsx` | **मुख्य होमपेज** (लीडरबोर्ड, हेडर, बैनर, पेमेंट मोडल, भाषा) |
| `src/app/about/` | **About Business** पेज (कंपनी का विवरण) |
| `src/app/contact/` | **Contact Support** पेज (फोन, ईमेल, WhatsApp) |
| `src/app/rules/` | **Showcase Rules / दिशानिर्देश** पेज |
| `src/app/terms/` | **Terms of Service** (लीगल नियम) |
| `src/app/privacy/` | **Privacy Policy** (डेटा सुरक्षा) |
| `src/app/checkout/` | **डायरेक्ट चेकआउट पेज** (पेमेंट फ्लो) |
| `src/app/admin/` | **एडमिन कंट्रोल पैनल** (डोमेन अप्रूवल, सेटिंग्स, रीसेट) |
| `src/app/globals.css` | **पूरी वेबसाइट की स्टाइलिंग, लाइट/डार्क थीम कलर्स** |
| `src/context/ThemeContext.tsx` | **ग्लोबल लाइट और डार्क मोड इंजन** |
| `src/lib/categories.ts` | **कैटेगरी लिस्ट** (Ecommerce, Tech, Fashion, etc.) |
| `prisma/schema.prisma` | **डेटाबेस स्कीमा** (Listings, Users, Payments, Visits) |
| `.env` | **सीक्रेट कीज़** (Razorpay Key ID, Secret, NextAuth Secret) |

---

## 💳 Razorpay और UPI सेटिंग्स कैसे बदलें?

### 1. Razorpay Keys बदलना:
`.env` फाइल खोलें:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID="आपकी_लाइव_KEY_ID"
RAZORPAY_KEY_ID="आपकी_लाइव_KEY_ID"
RAZORPAY_KEY_SECRET="आपकी_लाइव_KEY_SECRET"
```

### 2. डायरेक्ट UPI ID बदलना:
आप इसे दो तरीकों से बदल सकते हैं:
1. एडमिन पैनल (`/admin`) -> **Settings** टैब में जाकर अपना UPI ID डालें और Save दबाएं।
2. या `.env` में `ADMIN_UPI_ID="your_upi@bank"` सेट करें।

---

## 🛡️ ग्राहक डेटा और विज़िटर सुरक्षा (Customer, Views & Visitor Data Protection)
- **ऑटोमैटिक परमानेंट सेविंग:** जब भी कोई नया ग्राहक वेबसाइट पर जुड़ता है (Customer/User), पेमेंट करता है, डोमेन लिस्ट करता है, या कोई विज़िटर वेबसाइट देखता है (Visits & Views) — यह सारा डेटा SQLite डेटाबेस (`dev.db`) में तुरंत और हमेशा के लिए सेव हो जाता है।
- **कोड बदलने पर डेटा सुरक्षित:** आगे से आप वेबसाइट के डिज़ाइन, रंग, फीचर्स या कोड में कुछ भी बदलाव करेंगे, आपके मौजूदा ग्राहकों, विज़िटर्स और पेमेंट्स पर **कोई असर नहीं पड़ेगा** (सिर्फ वेबसाइट का कोड अपडेट होगा, डेटा सुरक्षित रहेगा)।
- **ऑटोमैटिक बैकअप:** जब भी सर्वर चालू होता है, `server.js` डेटाबेस का सुरक्षित बैकअप `backups/dev_db_backup_latest.db` में बना देता है।
- **मैनुअल बैकअप कमांड:** किसी भी समय डेटाबेस का बैकअप लेने के लिए टर्मिनल में यह कमांड चलाएं:
  ```bash
  node scripts/backup_db.js
  ```

---

## 🚀 Hostinger / VPS पर डिप्लॉय करने के लिए
- पूरी गाइड `HOSTINGER_DEPLOY_GUIDE.md` फाइल में दी गई है।
- Node.js Version: **18.x या 20.x या 24.x**
- Startup File: `server.js`

---

**© 2026 dukanrant. All rights reserved. Monu Ahirwar.**
