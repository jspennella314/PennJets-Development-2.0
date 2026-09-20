# PennJets Development 2.0

The public website for Penn Jets LLC (private aviation sales and consulting), built with React, Vite, and Tailwind CSS. Leads and blog content flow through the PennForce CRM; see CLAUDE.md for the integration contract and working rules.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and modern JavaScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags, structured data, and search engine friendly
- **Aircraft Listings**: Advanced filtering and search capabilities
- **Contact Forms**: Integrated inquiry and contact forms
- **Blog System**: Insights and industry news section
- **Performance Optimized**: Fast loading with optimized assets

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

## 🛠 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PennJets-Development-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🏗 Project Structure

```
PennJets-Development-2.0/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── pages/        # Page components
│   │   └── features/     # Feature-specific components
│   ├── data/             # Mock data and constants
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── assets/           # Images and other assets
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md            # Project documentation
```

## 🎨 Customization

### Branding
- Update logo and colors in `tailwind.config.js`
- Replace placeholder images in `/public` directory
- Modify company information in components

### Content
- Update aircraft data in `src/data/aircraftData.js`
- Modify team information in About page
- Update contact information throughout the site

### Styling
- Primary colors can be changed in `tailwind.config.js`
- Global styles are in `src/index.css`
- Component-specific styles use Tailwind classes

## 🚢 Deployment

The site deploys to **GitHub Pages** automatically on every push to `main`
(`.github/workflows/deploy.yml`): install, `vite build`, copy `public/CNAME`,
publish `dist/` to the `gh-pages` branch. The custom domain is
`www.pennjets.com` (the apex redirects to `www`).

- There is no preview environment. Review changes locally on a `site/<topic>`
  branch with `npx vite --port 5173`; Joseph merges and deploys.
- Build-time environment (`VITE_CRM_API_URL` and the webhook IDs) is set in
  the workflow, not in GitHub Pages settings.
- Deep links work through `public/404.html`, which redirects to `/?/path`
  and is decoded by the script in `index.html` before React mounts. Query
  strings (including `utm_*`) survive that hop.

## 🔧 Configuration

### Google Workspace Integration

To integrate with Google Workspace for contact forms:

1. Set up a Google Apps Script or use a service like Formspree
2. Update form submission handlers in Contact components
3. Configure SMTP settings for email notifications

### Google Maps Integration

1. Get a Google Maps API key
2. Add the API key to your environment variables
3. Update the Contact page to use the real Google Maps embed

### SEO Configuration

- Update `src/utils/seo.js` with your domain and business information
- Add your Google Analytics tracking ID
- Configure Google Search Console
- Update Open Graph images in the `public` directory

## 📱 Responsive Design

The website is fully responsive and tested on:
- Desktop (1920px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔍 SEO Features

- Meta tags for all pages
- Structured data for aircraft listings
- Sitemap generation ready
- Open Graph and Twitter Card support
- Semantic HTML structure

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to PennJets. All rights reserved.

## 🆘 Support

For technical support or questions about deployment:
- Check the troubleshooting section below
- Create an issue in the repository
- Contact the development team

## 🔧 Troubleshooting

### Common Issues

**Build fails with memory errors**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS=\"--max-old-space-size=4096\"
npm run build
```

**Development server won't start**
- Check if port 3000 is available
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility

**Images not loading**
- Ensure images are in the `public` directory
- Check image paths in components
- Verify image formats are supported

**Deployment issues**
- Check build logs for errors
- Verify environment variables are set
- Ensure all dependencies are installed

## 🚀 Performance Optimization

The application includes several performance optimizations:
- Code splitting with React Router
- Lazy loading of images
- Minified CSS and JavaScript
- Gzip compression (in nginx config)
- Cached static assets

## 🔒 Security

Security features implemented:
- Content Security Policy headers
- XSS protection
- HTTPS redirect ready
- Input validation on forms
- Secure headers in nginx configuration

---

Built with ❤️ for PennJets Aviation Brokerage