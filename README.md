# PennJets Development 2.0

A modern aviation brokerage website built with React, Vite, and Tailwind CSS. This project provides a complete solution for luxury aircraft sales, acquisitions, charter services, and management.

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

### Digital Ocean Deployment

#### Option 1: Docker Deployment

1. **Build and deploy with Docker**
   ```bash
   # Build the Docker image
   docker build -t pennjets-app .
   
   # Run the container
   docker run -p 80:80 pennjets-app
   ```

2. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

#### Option 2: Static Site Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your Digital Ocean Droplet or use Digital Ocean Spaces for static hosting

3. **Configure Nginx** (if using a Droplet)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Digital Ocean App Platform

1. **Create a new app** in Digital Ocean App Platform
2. **Connect your repository**
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
VITE_APP_NAME=PennJets
VITE_API_URL=https://api.pennjets.com
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

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