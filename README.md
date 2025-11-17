# AI Website Framework

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)

An all-in-one, AI-powered framework for building, managing, and optimizing modern websites. This platform combines a powerful suite of generative AI tools with a full-featured Content Management System (CMS), enabling users to create dynamic pages, write blog posts, manage files, and automate SEO with unprecedented ease. The entire backend is powered by a flexible AI service layer, defaulting to **Pollinations AI**.

## ✨ Features

This framework is a comprehensive solution for web creation and management:

*   **Full CMS**: A central, password-protected Admin Panel (`admin`/`password`) is the heart of your website.
*   **AI-Powered Blog Engine**:
    *   Create, edit, and manage blog posts with a rich text editor.
    *   **One-Click Content Creation**: Use AI to generate entire articles, catchy titles, or concise summaries.
    *   A public-facing blog page automatically lists all published articles.
*   **Dynamic Page Builder**:
    *   Build and manage custom pages (e.g., "About Us", "Contact").
    *   Published pages are automatically added to the main site navigation.
*   **Automatic SEO**:
    *   Each page and post includes a dedicated SEO panel.
    *   Use AI to **generate optimized meta titles and descriptions** to boost search engine rankings.
*   **File Manager**: A central hub to view and manage all your site's media assets.
*   **Light/Dark Mode**: A sleek theme toggle allows users to choose their preferred viewing experience.
*   **Extensible AI Tools**: Includes the original suite of standalone tools like the Prompt Playground, Image Generator, Translator, and more.
*   **Dynamic Navigation**: The sidebar automatically updates to include links to all your newly published pages.
*   **Modern UI/UX**: A clean, responsive interface enhanced with smooth animations and transitions.

## 🚀 How It Works

### Integrated Content & AI
The framework operates on a unified data model managed through React Context. All content—blog posts, pages, files, and settings—is stored and accessed from a central `SettingsContext`, making the application fast and self-contained.

### AI-Assisted Workflow
Generative AI is deeply integrated into the content creation process. When an admin creates a new blog post or page, they have access to buttons that call the `aiService`. This service sends tailored prompts to the configured AI provider (e.g., Pollinations AI) to generate high-quality text for titles, content, or SEO metadata, which is then populated directly into the CMS fields.

### Session-Based API Key
Security is paramount. To power the AI features, a user must first validate a key in the **API Key Verifier**. This key is stored for the **current session only** and is never persisted, ensuring user privacy.

## 🛠️ Technology Stack

*   **Frontend**: [React](https://react.dev/) 19 (using hooks and context for state management)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom theme supporting light/dark modes.
*   **Icons**: [Lucide React](https://lucide.dev/) for a clean and consistent icon set.
*   **API Communication**: Native `fetch` API.
*   **State Management**: React Context API for a self-contained, serverless architecture.

## 📦 Getting Started

This project is a static web application and does not require a build step or a complex server setup.

### Running the Application

1.  **Serve the files:** Use any simple static file server.
    *   With Node.js: `npx serve .`
    *   With Python: `python -m http.server`

2.  **Open the application:** Navigate to the URL provided by your server (e.g., `http://localhost:3000`).

## 🔧 Customization & Extensibility

### Adding a New Tool
1.  Create a new tool component in the `/pages` directory.
2.  Import the component and a [Lucide icon](https://lucide.dev/icons/) into `/data/tools.ts`.
3.  Add a new `Tool` object to the `tools` array. The sidebar will update automatically.

### Configuring AI Providers
1.  Log in to the **Admin Panel** (default: `admin` / `password`).
2.  Go to **Model Management** to add, edit, or remove AI providers.
3.  To change the core AI logic, modify the functions in `services/aiService.ts` to connect to your desired provider's API.

## 📄 License

This project is licensed under the MIT License.
