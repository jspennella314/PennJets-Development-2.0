// Blog API Service
// Handles all communication with PennForce CRM blog endpoints

import { displayTags } from '../utils/marketNotes';

const CRM_API_URL = import.meta.env.VITE_CRM_API_URL || 'https://www.pennforce.pennjets.com';

// Session-scoped id for the view beacon. Lives in sessionStorage only (cleared when
// the tab closes) so a re-fire within the same session updates the CRM row instead
// of creating a duplicate. Not personal data.
const VIEW_SESSION_KEY = 'pj_view_session';
function getViewSessionId() {
  try {
    let id = window.sessionStorage.getItem(VIEW_SESSION_KEY);
    if (!id) {
      id = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(VIEW_SESSION_KEY, id);
    }
    return id;
  } catch (e) {
    return undefined;
  }
}

export const blogApi = {
  /**
   * Get all published blog posts, optionally one category of them.
   *
   * `category` is the bare slug (e.g. "market-studies") and maps to the
   * CRM's strict ?category= filter (WO-1.16), which matches only the
   * keywords array. It replaced ?keyword=category:<slug>, a substring
   * search across title, excerpt and body that the index then had to
   * re-filter client-side. ?keyword= is still accepted here for a caller
   * that wants the search; nothing uses it today. WO-4.31.
   * @param {string} [category] - Category slug
   * @param {string} [keyword] - Free-text search
   * @returns {Promise<Array>} Array of blog posts
   */
  async getPosts(category, keyword) {
    try {
      const url = new URL(`${CRM_API_URL}/api/public/blog`);
      if (category) url.searchParams.set('category', category);
      if (keyword) url.searchParams.set('keyword', keyword);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      const posts = data.posts || [];

      // Transform posts to add missing fields
      return posts.map(post => this.transformPost(post));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Return empty array if API fails
      return [];
    }
  },

  /**
   * Get a single blog post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object>} Blog post object
   */
  async getPost(slug) {
    try {
      const response = await fetch(`${CRM_API_URL}/api/public/blog/${slug}`);

      if (!response.ok) {
        throw new Error('Blog post not found');
      }

      const post = await response.json();
      return this.transformPost(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  /**
   * Get webhook ID for specific author based on email
   * @param {string} authorEmail - Author's email address
   * @returns {string} Webhook ID for the author
   */
  getAuthorWebhookId(authorEmail) {
    const webhookMap = {
      'joe@pennjets.com': import.meta.env.VITE_WEBHOOK_JOE_PENNELLA,
    };

    // Fallback to main contact form webhook for other authors
    return webhookMap[authorEmail?.toLowerCase()] || import.meta.env.VITE_CONTACT_WEBHOOK_ID;
  },

  /**
   * Submit contact form for blog post - Routes to specific broker webhook
   * @param {string} authorId - Author's user ID (not used, kept for compatibility)
   * @param {Object} formData - Contact form data
   * @param {string} blogPostSlug - Article slug for attribution
   * @param {string} authorEmail - Author email to route to correct webhook
   * @returns {Promise<Object>} Response data
   */
  async submitContactForm(authorId, formData, blogPostSlug, authorEmail) {
    try {
      // Get the webhook ID for this specific author
      const webhookId = this.getAuthorWebhookId(authorEmail);

      if (!webhookId) {
        throw new Error('Webhook not configured for this author. Please contact support.');
      }

      const url = `${CRM_API_URL}/api/webhooks/incoming/${webhookId}`;
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        message: formData.message,
        blogPostSlug: blogPostSlug,
        pageUrl: window.location.href,
        // Add UTM parameters if available
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      };

      console.log('📤 Submitting to broker webhook:', url);
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));
      console.log('👤 Author email:', authorEmail);
      console.log('🔗 Webhook ID:', webhookId);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response statusText:', response.statusText);

      // Try to get the response text first
      const responseText = await response.text();
      console.log('📄 Response text:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok || !data.success) {
        console.error('❌ Response not OK:', response.status, data);
        throw new Error(data.error || `Server returned ${response.status}: ${JSON.stringify(data)}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Re-throw with more context
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - unable to reach the server. Please check your connection.');
      }
      throw error;
    }
  },

  /**
   * Submit a lead from a service page (charter, buy, sell, consulting,
   * PennShare) to the main
   * contact webhook. Same payload shape as the Contact page. Structured
   * fields are packed into `message` as labeled lines so the payload does
   * not change (CLAUDE.md, integration facts). Resolves with { success, leadId }.
   */
  async submitLead({ name, email, phone, company, service, message, blogPostSlug }) {
    const webhookId = import.meta.env.VITE_CONTACT_WEBHOOK_ID;
    if (!webhookId) {
      throw new Error('Webhook not configured. Please contact support.');
    }
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      service: service || undefined,
      message,
      blogPostSlug: blogPostSlug || undefined,
      pageUrl: window.location.href,
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
    };
    const response = await fetch(`${CRM_API_URL}/api/webhooks/incoming/${webhookId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Server returned ${response.status}`);
    }
    return data;
  },

  /**
   * View beacon. POST /api/public/blog/{slug}/view with the UTM parameters from the
   * current URL, the document referrer, and the session id. Fire-and-forget: it never
   * blocks rendering and never throws. Contract: CLAUDE.md "Integration facts".
   * @param {string} slug - Article slug
   */
  recordView(slug) {
    try {
      if (!slug || typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const payload = {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        referrer: document.referrer || undefined,
        sessionId: getViewSessionId(),
      };
      fetch(`${CRM_API_URL}/api/public/blog/${encodeURIComponent(slug)}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {
      // Never let the beacon affect the page.
    }
  },

  /**
   * Get author details from website team data based on email
   * @param {string} email - Author email
   * @returns {Object} Author details with name, title, bio, and avatar
   */
  getAuthorDetails(email) {
    const teamData = {
      'joe@pennjets.com': {
        name: 'Joseph Pennella',
        title: 'Founder and Principal Broker',
        bio: "Joseph Pennella founded Penn Jets LLC in 2025. He brokers whole-aircraft and fractional transactions, arranges charter through certificated operators, and advises owners on acquisition strategy. He publishes market studies on specific models and segments: how many airframes exist, how many are actually available, and what that means for a buyer's timeline.",
        avatar: '/images/Meet-The-Team/joseph-pennella-96.webp',
      },
    };

    return teamData[email?.toLowerCase()] || { name: null, title: null, bio: null, avatar: null };
  },

  /**
   * Transform CRM blog post to add missing fields expected by frontend
   * @param {Object} post - Raw post from CRM API
   * @returns {Object} Transformed post with all required fields
   */
  transformPost(post) {
    // Calculate estimated read time from content (average reading speed: 200 words/min)
    const readTimeMinutes = post.content
      ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
      : 5;

    // Category lives in the keywords array as "category:<slug>" and is read by
    // categoryFor() in utils/marketNotes. Keywords that are not categories are
    // shown as tags; the category keyword itself is not.
    const tags = displayTags(post);

    // Get author details from website team data (name, title, bio, and avatar)
    const authorDetails = this.getAuthorDetails(post.author.email);

    // This map is the gate on who is named on the site. CLAUDE.md, since
    // 2026-09-20: Joseph is the only person named. The CRM can carry any
    // author its CMS holds, including people who have left and the "Admin
    // User" service account that authors one published note today. The old
    // code fell through to post.author.name, so a name removed from the site
    // walked straight back onto it from the CRM. An author this map does not
    // know is now published under the house byline instead. Reassigning
    // authorship is Joseph's, in the CMS; this only controls what renders.
    // WO-4.24.
    const isPerson = authorDetails.name !== null;
    const author = {
      id: post.author.id,
      name: isPerson ? authorDetails.name : 'PennJets',
      isPerson,
      // The mailto under the byline, and what routes the article's lead form.
      // An unknown author routes to Joseph rather than to a departed person's
      // address or to nothing. Was info@pennjets.com, dead. WO-4.20, WO-4.24.
      email: isPerson ? post.author.email : 'joe@pennjets.com',
      // Null rather than a generic stand-in: the byline then renders nothing
      // at all instead of asserting a job title and a biography nobody wrote.
      title: isPerson ? authorDetails.title : null,
      bio: isPerson ? authorDetails.bio : null,
      // The house byline gets the logo rather than a one-letter monogram.
      // 5,289 bytes, already served as the JSON-LD publisher logo. WO-4.24.
      avatar: isPerson ? authorDetails.avatar : '/images/pennjets-logo-192.png',
    };

    return {
      ...post,
      tags,
      readTimeMinutes,
      author,
      // The composed credit for the featured image, from the CRM's public API:
      // null for an own photo or when nothing is recorded. Carried through as
      // is; the article builds the visible line from this object and never
      // rewrites it. featuredImage and safeImage are untouched. WO-4.27.
      imageAttribution: post.imageAttribution ?? null,
    };
  },
};
