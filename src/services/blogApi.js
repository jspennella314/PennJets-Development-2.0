// Blog API Service
// Handles all communication with PennForce CRM blog endpoints

const CRM_API_URL = import.meta.env.VITE_CRM_API_URL || 'http://localhost:3001';
const FORM_SECRET = import.meta.env.VITE_CONTACT_FORM_SECRET || '';

export const blogApi = {
  /**
   * Get all published blog posts
   * @returns {Promise<Array>} Array of blog posts
   */
  async getPosts() {
    try {
      const response = await fetch(`${CRM_API_URL}/api/public/blog`);

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
   * Submit contact form for specific blog author
   * @param {string} authorId - Author's user ID
   * @param {Object} formData - Contact form data
   * @param {string} articleSlug - Article slug for attribution
   * @returns {Promise<Object>} Response data
   */
  async submitContactForm(authorId, formData, articleSlug) {
    try {
      const response = await fetch(
        `${CRM_API_URL}/api/webhooks/blog-contact/${authorId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-form-secret': FORM_SECRET,
          },
          body: JSON.stringify({
            ...formData,
            articleSlug,
            source: `Blog - ${articleSlug}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      return data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
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

    // Extract category from keywords (first keyword becomes category)
    const category = post.keywords && post.keywords.length > 0
      ? post.keywords[0]
      : 'Aviation';

    // Use keywords as tags
    const tags = post.keywords || [];

    // Enhance author data with defaults
    const author = {
      id: post.author.id,
      name: post.author.name || 'PennJets Team',
      email: post.author.email || 'info@pennjets.com',
      title: 'Aviation Consultant',
      bio: `Aviation expert at PennJets, dedicated to providing insights and guidance on private aviation.`,
      avatar: null, // No avatar in CRM yet
    };

    return {
      ...post,
      category,
      tags,
      readTimeMinutes,
      author,
    };
  },
};
