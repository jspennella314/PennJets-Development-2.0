# 📝 CRM Webhook Creation - Step-by-Step Instructions

**Date:** 2025-11-19
**Purpose:** Create 6 webhooks in CRM for PennJets contact form routing

---

## 🎯 ACCESS THE WEBHOOKS PAGE

1. **Login to CRM:**
   - URL: https://crm.pennjets.com (or https://www.pennforce.pennjets.com)
   - Email: admin@pennjets.com
   - Password: [Your admin password]

2. **Navigate to Webhooks:**
   - Go to: **Settings** → **Webhooks**
   - Or direct URL: https://crm.pennjets.com/settings/webhooks

---

## ✅ CREATE WEBHOOK #1: MAIN CONTACT FORM

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `PennJets Main Contact Form`
- **URL:** `https://example.com/incoming-webhook` *(placeholder - not used for incoming webhooks)*
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### 🔴 IMPORTANT: COPY THE WEBHOOK ID
After creation, you'll see the webhook in the list. The webhook ID is displayed in the row.

**Copy this ID and paste it here:**
```
VITE_CONTACT_WEBHOOK_ID=___________________________
```

---

## ✅ CREATE WEBHOOK #2: JOE PENNELLA BLOG FORMS

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `Joe Pennella - Blog Contact Forms`
- **URL:** `https://example.com/incoming-webhook`
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### Copy the Webhook ID:
```
VITE_WEBHOOK_JOE_PENNELLA=___________________________
```

---

## ✅ CREATE WEBHOOK #3: STEVEN SMYTH BLOG FORMS

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `Steven Smyth - Blog Contact Forms`
- **URL:** `https://example.com/incoming-webhook`
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### Copy the Webhook ID:
```
VITE_WEBHOOK_STEVEN_SMYTH=___________________________
```

---

## ✅ CREATE WEBHOOK #4: CHARLES BRENNAN BLOG FORMS

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `Charles Brennan - Blog Contact Forms`
- **URL:** `https://example.com/incoming-webhook`
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### Copy the Webhook ID:
```
VITE_WEBHOOK_CHARLES_BRENNAN=___________________________
```

---

## ✅ CREATE WEBHOOK #5: JAMES WOFFORD BLOG FORMS

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `James Wofford - Blog Contact Forms`
- **URL:** `https://example.com/incoming-webhook`
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### Copy the Webhook ID:
```
VITE_WEBHOOK_JAMES_WOFFORD=___________________________
```

---

## ✅ CREATE WEBHOOK #6: JOE DELISIO BLOG FORMS

### Click "New Webhook" Button

### Fill in the form:
- **Name:** `Joe Delisio - Blog Contact Forms`
- **URL:** `https://example.com/incoming-webhook`
- **Events:** ☑️ Check `Lead Created`
- **Active:** ☑️ Checked

### Click "Create Webhook"

### Copy the Webhook ID:
```
VITE_WEBHOOK_JOE_DELISIO=___________________________
```

---

## 📋 NEXT STEP: UPDATE .ENV FILE

Once you have all 6 webhook IDs copied above, you need to update the `.env` file in the PennJets website:

### File Location:
```
C:\Users\jspen\OneDrive\Desktop\PennJets-Development-2.0\.env
```

### Replace these lines with your actual webhook IDs:

```bash
# Main contact form webhook
VITE_CONTACT_WEBHOOK_ID=cm3abc123example

# Individual broker webhooks for blog forms
VITE_WEBHOOK_JOE_PENNELLA=cm3def456example
VITE_WEBHOOK_STEVEN_SMYTH=cm3ghi789example
VITE_WEBHOOK_CHARLES_BRENNAN=cm3jkl012example
VITE_WEBHOOK_JAMES_WOFFORD=cm3mno345example
VITE_WEBHOOK_JOE_DELISIO=cm3pqr678example
```

---

## 🔍 HOW TO FIND THE WEBHOOK ID

The webhook ID is visible in the webhooks table. It's the unique identifier for each webhook.

**If you can't see it clearly:**

1. Click on the webhook row or "Edit" button
2. Look at the URL in your browser address bar
3. The ID is at the end: `https://crm.pennjets.com/settings/webhooks/{WEBHOOK_ID}`

**Example:**
```
https://crm.pennjets.com/settings/webhooks/cm3xyzabc123
                                               ↑
                                        This is the ID
```

---

## ✅ VERIFICATION CHECKLIST

Before proceeding, verify you have created:

- [ ] Webhook #1: PennJets Main Contact Form
- [ ] Webhook #2: Joe Pennella - Blog Contact Forms
- [ ] Webhook #3: Steven Smyth - Blog Contact Forms
- [ ] Webhook #4: Charles Brennan - Blog Contact Forms
- [ ] Webhook #5: James Wofford - Blog Contact Forms
- [ ] Webhook #6: Joe Delisio - Blog Contact Forms

All webhooks should show:
- ✅ Status: **Active** (green dot)
- ✅ Events: **lead.created**
- ✅ Last Triggered: **Never** (until tested)
- ✅ Failures: **0**

---

## 📞 NEED HELP?

**Can't find webhook IDs?**
- Hover over the webhook name - the ID might be in a tooltip
- Check the browser developer console (F12) → Network tab when loading the page
- The API response shows all webhook IDs

**Webhooks not saving?**
- Ensure you're logged in as ADMIN
- Check that at least one event is selected
- URL must start with https:// (even though it's just a placeholder)

---

## 🚀 AFTER WEBHOOK CREATION

Once you have all 6 webhook IDs:

1. ✅ Update `.env` file with real webhook IDs
2. ✅ Rebuild website: `npm run build`
3. ✅ Deploy to production
4. ✅ Test each form

**Next document:** See `WEBHOOK_SETUP_GUIDE.md` for deployment instructions

---

**READY TO CREATE WEBHOOKS?** Follow the steps above one by one!
