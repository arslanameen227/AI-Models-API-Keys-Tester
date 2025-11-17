# AI Website Framework 3.0: Backend-Powered Edition

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Symfony](https://img.shields.io/badge/Symfony-Backend-black?logo=symfony)](https://symfony.com/)

An all-in-one, enterprise-grade AI framework for building, managing, and optimizing modern websites, now architected to connect to a real backend (e.g., Symfony). This platform features a robust API-driven data layer, a dynamic theming system, full content management, and a powerful plugin system for ultimate extensibility.

## ✨ Core Features

*   **Real Backend Integration**: The frontend is now a pure client application that communicates with a backend via a RESTful API. The entire data layer has been re-engineered to be asynchronous and persistent.
*   **Token-Based Authentication**: Secure JWT-based authentication flow. The frontend sends credentials, receives a token, and uses it for all authenticated requests.
*   **Complete Plugin System**:
    *   **Admin UI**: Install, uninstall, activate, and deactivate plugins directly from the Admin Panel.
    *   **Dynamic Functionality**: The frontend is **plugin-aware**. Active plugins can dynamically add new tools to the sidebar, create new pages, and extend the framework's capabilities without requiring frontend code changes.
*   **Full CMS**: A central, password-protected Admin Panel for all website management.
    *   **Full CRUD**: Create, Read, Update, and Delete blog posts and custom pages through a rich modal editor.
    *   **AI-Powered Content**: Generate entire articles, SEO metadata, and summaries with a single click by leveraging the backend's connection to AI providers.
*   **Dynamic Theming & Navigation**:
    *   Themes, colors, and navigation menus are now fetched from the backend, allowing them to be managed dynamically.
*   **Extensible AI Tools**: Includes a suite of standalone tools like the Prompt Playground, Image Generator, and more, all powered by API calls to the backend.

## 🚀 How It Works

### Client-Server Architecture
This project is now the **frontend** part of a client-server application. It is designed to work with any backend that exposes a compatible REST API. All data—from posts and pages to users and plugin states—is fetched from and persisted to the backend via the centralized `apiService`.

### Plugin System
The framework's extensibility comes from its plugin system. The backend provides an endpoint (`/api/plugins`) that lists available plugins and their states. When a plugin is active, the backend's API response includes metadata about the features it provides (e.g., a new tool for the sidebar). The React frontend reads this metadata and dynamically renders the new functionality in the UI, making the application incredibly modular.

### API-Based AI Integration
Instead of the frontend making direct calls to AI providers, it now sends requests to the backend (e.g., `/api/ai/generate-text`). The backend is responsible for securely managing AI provider API keys and communicating with the AI services. This is a more secure and scalable architecture.

## 🛠️ Technology Stack & Requirements

*   **Frontend**: [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: React Context API
*   **Backend (Required)**: A backend server that provides a compatible REST API. This could be built with [Symfony](https://symfony.com/), Laravel, Node.js, or any other framework.

### Required API Endpoints
Your backend must expose endpoints for authentication, data management, and the plugin system. Examples:
*   `POST /api/login_check` (for authentication)
*   `GET /api/settings`, `GET /api/posts`, `POST /api/posts`, `PUT /api/posts/{id}`
*   `GET /api/plugins`, `POST /api/plugins/{id}/install`, `POST /api/plugins/{id}/activate`
*   `POST /api/ai/generate-text`

## 📦 Getting Started

1.  **Set up your backend server**: Ensure your Symfony (or other) backend is running and exposing the required API endpoints.
2.  **Configure API Base URL**: In `/src/services/apiService.ts`, update the `API_BASE_URL` to point to your backend server.
3.  **Serve the frontend**:
    *   Use any simple static file server (e.g., `npx serve .`).
    *   Navigate to the provided URL (e.g., `http://localhost:3000`).

4.  **Login**: Access the Admin Panel with credentials managed by your backend's user system.

## 🔧 Customization & Extensibility

### Creating a Plugin
1.  **Backend**: Create the plugin logic in your Symfony backend, including any new API endpoints it requires.
2.  **Register the Plugin**: Add the plugin to the list returned by your `/api/plugins` endpoint.
3.  **Define Features**: In the plugin's metadata from the API, specify the features it adds (e.g., `addsTool`, `addsAdminTab`). The frontend will automatically detect and render them.

### Changing AI Providers
All AI provider logic and key management should now be handled exclusively on the **backend**. The frontend simply makes requests to your backend's AI endpoints.

## 📄 License

This project is licensed under the MIT License.