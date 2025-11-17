import { SiteSettings } from '../types';

export const initialSettings: SiteSettings = {
  siteTitle: 'AI Framework',
  siteDescription: 'A powerful suite of AI tools and a full CMS to build modern websites.',
  providers: [
    {
      id: 'POLLINATIONS',
      name: 'Pollinations AI',
      logo: 'https://i.imgur.com/AFb2k3k.png',
      placeholder: 'Enter your Pollinations AI API key',
      validationUrl: 'https://api.pollinations.ai/v1/user',
      authHeader: 'Authorization',
      authScheme: 'Bearer',
    },
    // Other providers...
  ],
  blogPosts: [
    {
      id: 'post-1',
      slug: 'the-rise-of-generative-ai',
      title: 'The Rise of Generative AI',
      content: '## Understanding the AI Revolution\n\nGenerative AI is transforming industries by creating new content, from text and images to code and music. This post explores the core concepts behind this technology and its potential impact on our future.\n\n*   **Large Language Models (LLMs):** The powerhouse behind text generation.\n*   **Diffusion Models:** The magic for creating stunning images.\n\nStay tuned for a deeper dive into specific models!',
      author: 'Admin',
      publishedDate: new Date().toISOString(),
      status: 'published',
      seo: {
        title: 'The Rise of Generative AI | AI Framework Blog',
        description: 'Explore the revolution of generative AI, from LLMs to diffusion models, and understand its impact on the future of technology and creativity.',
      },
    },
  ],
  pages: [
    {
      id: 'page-1',
      slug: 'about-us',
      title: 'About Us',
      content: '## Our Mission\n\nWe are dedicated to making the power of artificial intelligence accessible to everyone. Our framework provides the tools and infrastructure to build, manage, and deploy AI-powered web applications with ease.',
      status: 'published',
      seo: {
        title: 'About Us | AI Framework',
        description: 'Learn about our mission to democratize artificial intelligence and empower creators and developers with our advanced AI Website Framework.',
      },
    },
  ],
  files: [
    {
      id: 'file-1',
      name: 'AI Brain Wallpaper.jpg',
      url: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=2070',
      type: 'image',
      uploadedDate: new Date().toISOString(),
    },
  ],
};