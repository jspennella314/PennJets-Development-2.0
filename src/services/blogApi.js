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
   * Submit contact form for blog post
   * @param {string} authorId - Author's user ID (not used, kept for compatibility)
   * @param {Object} formData - Contact form data
   * @param {string} blogPostSlug - Article slug for attribution
   * @returns {Promise<Object>} Response data
   */
  async submitContactForm(authorId, formData, blogPostSlug) {
    try {
      const response = await fetch(
        'https://pennforce-crm-development-beta2-4.vercel.app/api/webhooks/blog-contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-form-secret': FORM_SECRET,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            company: formData.company || undefined,
            message: formData.message,
            blogPostSlug: blogPostSlug, // REQUIRED field
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
   * Get author details from website team data based on email
   * @param {string} email - Author email
   * @returns {Object} Author details with name, title, bio, and avatar
   */
  getAuthorDetails(email) {
    const teamData = {
      'joe@pennjets.com': {
        name: 'Joseph Pennella',
        title: 'Managing Director',
        bio: 'Aviation enthusiast and founder of PennJets LLC, dedicated to making private aviation accessible, profitable, and hassle-free. With a passion for deal-making and client success, Joseph brings innovative approaches to aircraft brokerage and fractional ownership.',
        avatar: '/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG',
      },
      'steven@pennjets.com': {
        name: 'Steven J Smyth',
        title: 'Partner Operator Liaison',
        bio: 'Partner Operator Liaison and Captain at KLM Aviation, established in 1991. Brings over three decades of aviation expertise to the PennJets partnership network. Coordinates with Part 135 certified operators to ensure the highest standards of safety, compliance, and service for PennJets clients.',
        avatar: '/images/Meet-The-Team/steven-smyth.jpg',
      },
      'charles@pennjets.com': {
        name: 'Charles Brennan',
        title: 'Chief Technology Officer',
        bio: 'Chief Technology Officer driving digital innovation and technological advancement at PennJets. Specializes in aviation technology integration, digital platforms, and modernizing private aviation operations through cutting-edge solutions and strategic technology implementation.',
        avatar: '/images/Meet-The-Team/CHARLES-BRENNAN.JPEG',
      },
      'jameswofford@pennjets.com': {
        name: 'James Wofford',
        title: 'Aviation Consultant',
        bio: 'James Wofford is a results-driven leader with a foundation in Aviation Management from Auburn University and a proven track record in sales, operations, and project leadership. With experience managing multimillion-dollar initiatives and leading cross-functional teams across industries—from aviation and energy efficiency to healthcare consulting—James combines strategic planning and data-driven decision-making to drive efficiency and growth. Known for his ability to streamline operations and enhance client satisfaction, he brings a disciplined, aviation-inspired approach to leadership and performance optimization.',
        avatar: '/images/Meet-The-Team/james-wofford.jpg',
      },
      'joedelisio@pennjets.com': {
        name: 'Joe Delisio',
        title: 'Aviation Consultant',
        bio: 'Experienced aviation consultant focused on helping clients navigate aircraft acquisitions and sales. Joe provides personalized service and strategic guidance throughout the entire transaction process.',
        avatar: '/images/Meet-The-Team/joe-delisio.jpg',
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

    // Extract category from keywords (first keyword becomes category)
    const category = post.keywords && post.keywords.length > 0
      ? post.keywords[0]
      : 'Aviation';

    // Use keywords as tags
    const tags = post.keywords || [];

    // Get author details from website team data (name, title, bio, and avatar)
    const authorDetails = this.getAuthorDetails(post.author.email);

    // Enhance author data with defaults, prioritizing website team data
    const author = {
      id: post.author.id,
      name: authorDetails.name || post.author.name || 'PennJets Team',
      email: post.author.email || 'info@pennjets.com',
      title: authorDetails.title || post.author.title || 'Aviation Consultant',
      bio: authorDetails.bio || post.author.bio || `Aviation expert at PennJets, dedicated to providing insights and guidance on private aviation.`,
      avatar: authorDetails.avatar,
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
