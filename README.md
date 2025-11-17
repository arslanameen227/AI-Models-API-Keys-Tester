# AI Toolkit

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)

A versatile, configurable, and powerful suite of AI-powered tools designed for developers, content creators, and AI enthusiasts. This application provides a unified interface for various generative AI tasks, all powered by a flexible backend that defaults to **Pollinations AI**.



## ✨ Features

The AI Toolkit is a single-page application that includes a collection of powerful, independent tools:

*   **Dashboard**: A welcoming overview of the toolkit and its capabilities.
*   **API Key Verifier**: Securely test and validate API keys for various AI providers. A successfully validated key is used **for the current session only** to power all other tools.
*   **Admin Panel**: A password-protected area (`admin`/`password`) to configure the toolkit:
    *   **Site Settings**: Customize the site title and description.
    *   **Model Management**: Add, edit, or remove AI providers. Configure validation methods (prefix-based or real API endpoint).
*   **Prompt Playground**: A simple interface to experiment with text prompts and see raw model output.
*   **Chat Interface**: A conversational AI with memory for multi-turn dialogues.
*   **Image Generator**: Create stunning images from text descriptions.
*   **Text Summarizer**: Condense long articles or documents into key points.
*   **JSON Generator**: Describe a data structure in plain English and get a valid, formatted JSON object.
*   **Language Translator**: Translate text between a dozen common languages.
*   **Code Generator**: Generate code snippets in various programming languages from natural language.
*   **Content Rewriter**: Paraphrase and rephrase text to get new variations.
*   **Sentiment Analysis**: Analyze text to determine if its sentiment is positive, negative, or neutral.
*   **Keyword Extractor**: Pull out the most important keywords from a block of text.

## 🚀 How It Works

### Session-Based API Key
The toolkit is designed with security and convenience in mind. To use the AI tools, a user must first go to the **API Key Verifier** and successfully validate a key for an active provider (e.g., Pollinations AI).

This key is then stored in React Context for the **current browser session only**. It is **never persisted** in `localStorage` or sent to a server for storage, ensuring the user's key remains private. This session key is then used by the `aiService` to make requests for all other tools.

### Extensible Provider System
The Admin Panel allows administrators to configure which AI providers are available. Each provider can be set up with:
*   A **mock validation** method (checking an API key prefix).
*   A **real validation** method (making a live API call to a specific URL).

This makes the toolkit highly adaptable to different AI services beyond the pre-configured examples. The core AI logic in `aiService.ts` is currently wired to a hypothetical **Pollinations AI** API but can be modified to support any provider.

## 🛠️ Technology Stack

*   **Frontend**: [React](https://react.dev/) 19 (using hooks and context for state management)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first design system.
*   **Icons**: [Lucide React](https://lucide.dev/) for a clean and consistent icon set.
*   **API Communication**: Native `fetch` API.

## 📦 Getting Started

This project is a static web application and does not require a build step or a complex server setup.

### Prerequisites
*   A modern web browser.
*   A local web server to serve the files (optional, but recommended to avoid CORS issues if you add certain features).

### Running the Application

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-toolkit.git
    cd ai-toolkit
    ```

2.  **Serve the files:**
    You can use any simple static file server. If you have Node.js installed, you can use `serve`:
    ```bash
    # Install serve globally if you don't have it
    npm install -g serve

    # Serve the current directory
    serve .
    ```
    Alternatively, if you have Python installed:
    ```bash
    # Python 3
    python -m http.server
    ```
3.  **Open the application:**
    Navigate to the URL provided by your server (e.g., `http://localhost:3000`) in your web browser.

## 🔧 Extensibility

### Adding a New Tool
1.  Create your new tool component in the `/pages` directory.
2.  Import the component and a [Lucide icon](https://lucide.dev/icons/) into `/data/tools.ts`.
3.  Add a new `Tool` object to the `tools` array. The application's sidebar and routing will update automatically.

### Adding a New Provider
1.  Log in to the **Admin Panel** (default: `admin` / `password`).
2.  Navigate to **Model Management**.
3.  Click "Add New Provider" and fill in the details. Use the existing providers as a template.
4.  If the provider needs custom logic in the `aiService.ts`, you can extend the service accordingly.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
