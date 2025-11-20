# 🔗 PennJets Website Webhook Setup Guide

**Last Updated:** 2025-11-19
**Purpose:** Configure webhooks to route contact form leads to specific brokers in CRM

---

## 📋 OVERVIEW

This guide shows how to set up webhooks in the CRM so that:
- Main contact form leads go to admin
- Blog post leads go to the specific broker who wrote the article
- All leads are tracked, organized, and assigned automatically

---

## 🎯 STEP 1: CREATE WEBHOOKS IN CRM

### Login to CRM:
- **URL:** https://crm.pennjets.com
- **Email:** admin@pennjets.com
- **Role:** ADMIN required

### Navigate to Webhooks:
Go to: **Settings** → **Webhooks** → **New Webhook**

---

## 🔧 STEP 2: CREATE WEBHOOKS FOR EACH BROKER

You need to create **6 webhooks** total:

### Webhook 1: Main Contact Form
- **Name:** `PennJets Main Contact Form`
- **URL:** `https://example.com/placeholder` (not used for incoming)
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** admin@pennjets.com (or whoever handles general inquiries)
- **Copy the Webhook ID** (e.g., `cm3abc123...`)

### Webhook 2: Joe Pennella Blog Forms
- **Name:** `Joe Pennella - Blog Contact Forms`
- **URL:** `https://example.com/placeholder`
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** joe@pennjets.com
- **Copy the Webhook ID**

### Webhook 3: Steven Smyth Blog Forms
- **Name:** `Steven Smyth - Blog Contact Forms`
- **URL:** `https://example.com/placeholder`
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** steven@pennjets.com
- **Copy the Webhook ID**

### Webhook 4: Charles Brennan Blog Forms
- **Name:** `Charles Brennan - Blog Contact Forms`
- **URL:** `https://example.com/placeholder`
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** charles@pennjets.com
- **Copy the Webhook ID**

### Webhook 5: James Wofford Blog Forms
- **Name:** `James Wofford - Blog Contact Forms`
- **URL:** `https://example.com/placeholder`
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** jameswofford@pennjets.com
- **Copy the Webhook ID**

### Webhook 6: Joe Delisio Blog Forms
- **Name:** `Joe Delisio - Blog Contact Forms`
- **URL:** `https://example.com/placeholder`
- **Events:** Select `lead.created`
- **Status:** Active ✓
- **Assigned To:** joedelisio@pennjets.com
- **Copy the Webhook ID**

---

## 🌐 STEP 3: UPDATE WEBSITE ENVIRONMENT VARIABLES

### Edit `.env` file in PennJets-Development-2.0:

```bash
# CRM API Configuration
VITE_CRM_API_URL=https://crm.pennjets.com

# Main contact form webhook
VITE_CONTACT_WEBHOOK_ID=cm3abc123...  # Replace with Webhook 1 ID

# Individual broker webhooks for blog forms
VITE_WEBHOOK_JOE_PENNELLA=cm3xyz456...     # Replace with Webhook 2 ID
VITE_WEBHOOK_STEVEN_SMYTH=cm3def789...     # Replace with Webhook 3 ID
VITE_WEBHOOK_CHARLES_BRENNAN=cm3ghi012...  # Replace with Webhook 4 ID
VITE_WEBHOOK_JAMES_WOFFORD=cm3jkl345...    # Replace with Webhook 5 ID
VITE_WEBHOOK_JOE_DELISIO=cm3mno678...      # Replace with Webhook 6 ID
```

**IMPORTANT:** Replace each `cm3...` with the actual Webhook ID you copied from the CRM!

---

## 🚀 STEP 4: REBUILD AND DEPLOY

### 1. Rebuild the website:
```bash
cd PennJets-Development-2.0
npm run build
```

### 2. Deploy to production:
```bash
# Follow your normal deployment process
# The build output in `dist/` needs to be deployed to www.pennjets.com
```

---

## ✅ STEP 5: TEST THE WEBHOOKS

### Test Main Contact Form:
1. Go to: https://www.pennjets.com/contact
2. Fill out the form with test data
3. Submit
4. Check CRM → Leads
5. Verify lead appears and is assigned to admin@pennjets.com

### Test Blog Author Forms:
1. Go to any blog post (e.g., https://www.pennjets.com/blog/jet-charter-vs-ownership-making-the-right-choice)
2. Scroll to "Contact [Author Name]" form
3. Fill out the form with test data
4. Submit
5. Check CRM → Leads
6. Verify lead appears and is assigned to the blog post author

---

## 🔍 HOW IT WORKS

### Main Contact Form Flow:
```
User fills out /contact form
    ↓
POST to https://crm.pennjets.com/api/webhooks/incoming/{VITE_CONTACT_WEBHOOK_ID}
    ↓
CRM creates lead in correct organization
    ↓
Lead assigned to admin@pennjets.com
    ↓
Notification sent to admin
```

### Blog Contact Form Flow:
```
User fills out blog article contact form
    ↓
Website checks article.author.email
    ↓
Looks up webhook ID for that author
    ↓
POST to https://crm.pennjets.com/api/webhooks/incoming/{AUTHOR_WEBHOOK_ID}
    ↓
CRM creates lead in correct organization
    ↓
Lead assigned to specific broker (article author)
    ↓
Notification sent to broker
```

---

## 🔐 SECURITY

- **No Secrets Required:** Webhook ID serves as authentication
- **Organization Isolation:** Each webhook tied to ONE organization
- **CORS Enabled:** Forms work from www.pennjets.com
- **Activity Logging:** All submissions logged in CRM
- **Webhook Delivery Logs:** Track success/failure in CRM Settings → Webhooks

---

## 📊 MONITORING

### View Webhook Activity:
1. Login to CRM
2. Go to: Settings → Webhooks
3. Click on a webhook to see:
   - Last triggered time
   - Failure count
   - Delivery logs

### View Lead Reports:
1. Go to: Leads module
2. Filter by Source: "PennJets.com" or "Blog - [title]"
3. Group by Assigned To to see broker distribution

---

## 🚨 TROUBLESHOOTING

### Error: "Webhook not configured"
**Cause:** Missing webhook ID in .env
**Fix:** Check that all VITE_WEBHOOK_* variables are set in .env and rebuild

### Error: "Webhook not found"
**Cause:** Wrong webhook ID or webhook deleted in CRM
**Fix:** Create new webhook in CRM, update .env, rebuild

### Error: "Webhook is inactive"
**Cause:** Webhook was deactivated in CRM
**Fix:** Go to Settings → Webhooks → Activate

### Lead not appearing:
**Check:**
1. Is webhook active in CRM?
2. Check browser console for errors
3. Check CRM webhook logs: Settings → Webhooks → [Your Webhook] → View Logs
4. Verify .env has correct webhook IDs
5. Ensure website was rebuilt after .env changes

---

## 📞 SUPPORT

**Issues or Questions?**
Contact: joe@pennjets.com

**CRM Access:**
https://crm.pennjets.com
admin@pennjets.com

---

## 📝 QUICK REFERENCE

**Webhook Endpoint Format:**
```
POST https://crm.pennjets.com/api/webhooks/incoming/[WEBHOOK_ID]
```

**Main Contact Form:**
- File: `src/components/pages/Contact/Contact.jsx`
- Env Var: `VITE_CONTACT_WEBHOOK_ID`

**Blog Author Forms:**
- File: `src/services/blogApi.js`
- Env Vars: `VITE_WEBHOOK_JOE_PENNELLA`, `VITE_WEBHOOK_STEVEN_SMYTH`, etc.

**Author Email → Webhook Mapping:**
```javascript
joe@pennjets.com          → VITE_WEBHOOK_JOE_PENNELLA
steven@pennjets.com       → VITE_WEBHOOK_STEVEN_SMYTH
charles@pennjets.com      → VITE_WEBHOOK_CHARLES_BRENNAN
jameswofford@pennjets.com → VITE_WEBHOOK_JAMES_WOFFORD
joedelisio@pennjets.com   → VITE_WEBHOOK_JOE_DELISIO
```

---

**END OF SETUP GUIDE**
