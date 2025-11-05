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
      // Return mock data for development
      return this.getMockPosts();
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
      // Return mock data for development
      return this.getMockPost(slug);
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

  /**
   * Mock data for development/testing
   */
  getMockPosts() {
    return [
      {
        id: '1',
        slug: 'understanding-aircraft-depreciation-2025',
        title: 'Understanding Aircraft Depreciation in 2025',
        excerpt: 'Learn how the 100% bonus depreciation affects private jet ownership and what changes are coming in 2026.',
        content: '<p>Full article content here...</p>',
        featuredImage: '/images/premier-1a-exterior.jpg',
        author: {
          id: 'user1',
          name: 'Joseph Pennella',
          title: 'Managing Director',
          bio: 'Aviation enthusiast and founder of PennJets LLC, dedicated to making private aviation accessible.',
          avatar: '/images/Meet-The-Team/JOSEPH-PENNELLA.JPEG',
          email: 'joe@pennjets.com',
        },
        publishedAt: '2025-01-15T10:00:00Z',
        category: 'Tax & Finance',
        tags: ['Depreciation', 'Tax Benefits', 'Aircraft Ownership'],
        readTimeMinutes: 8,
      },
      {
        id: '2',
        slug: 'premier-1a-buyers-guide',
        title: 'Beechcraft Premier 1A: The Ultimate Buyer\'s Guide',
        excerpt: 'Everything you need to know about the Premier 1A - performance, costs, and why it\'s perfect for business aviation.',
        content: '<p>Full article content here...</p>',
        featuredImage: '/images/PREMIER-1A-FEATURED.jpg',
        author: {
          id: 'user2',
          name: 'James Wofford',
          title: 'Aviation Consultant',
          bio: 'Results-driven aviation consultant with expertise in aircraft sales and market analysis.',
          avatar: '/images/Meet-The-Team/james-wofford.jpg',
          email: 'jameswofford@pennjets.com',
        },
        publishedAt: '2025-01-10T14:30:00Z',
        category: 'Aircraft Reviews',
        tags: ['Premier 1A', 'Buyers Guide', 'Light Jets'],
        readTimeMinutes: 12,
      },
      {
        id: '3',
        slug: 'part-135-charter-vs-ownership',
        title: 'Part 135 Charter vs. Aircraft Ownership: Which is Right for You?',
        excerpt: 'Compare the costs and benefits of chartering versus owning your own aircraft.',
        content: '<p>Full article content here...</p>',
        featuredImage: '/images/hawker-800xp-exterior.jpg',
        author: {
          id: 'user3',
          name: 'Steven J Smyth',
          title: 'Partner Operator Liaison',
          bio: 'Over three decades of aviation expertise ensuring the highest standards of safety and service.',
          avatar: '/images/Meet-The-Team/steven-smyth.jpg',
          email: 'steven@pennjets.com',
        },
        publishedAt: '2025-01-05T09:15:00Z',
        category: 'Aviation Insights',
        tags: ['Part 135', 'Charter', 'Ownership'],
        readTimeMinutes: 10,
      },
    ];
  },

  /**
   * Get mock post by slug
   */
  getMockPost(slug) {
    const posts = this.getMockPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      throw new Error('Post not found');
    }

    // Add full content for detail page
    post.content = `
      <p>This is a comprehensive article about ${post.title}.</p>

      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <h2>Key Points</h2>
      <ul>
        <li>Important consideration number one</li>
        <li>Critical factor to understand</li>
        <li>Essential information for decision making</li>
      </ul>

      <h2>Expert Analysis</h2>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <blockquote>
        "Private aviation is not just about getting from point A to point B—it's about the freedom and efficiency it provides."
      </blockquote>

      <h2>Conclusion</h2>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    `;

    return post;
  },
};
