# Technical Overview 📖

This document provides a high-level technical overview of the Kindler application, its main components, and how they interact. This is intended for developers or AI assistants who want to understand the codebase or contribute to its development.

## Core Technologies 🚀

- **Node.js:** The runtime environment for the application.
- **Puppeteer:** A Node library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. Puppeteer is used for browser automation to:
  - Log into Amazon.
  - Navigate to the Kindle Notebook page.
  - Extract book details and highlights from the web page.
- **dotenv:** A module to load environment variables from a `.env` file into `process.env`.

## Project Structure Overview 🌳

```text
kindler/
├── docs/                     # Documentation files
├── src/                      # Source code
│   ├── index.js              # Main entry point of the application
│   ├── KindleScraper.js      # Core class orchestrating the scraping process
│   ├── config/
│   │   └── constants.js      # Application constants (e.g., URLs, selectors)
│   ├── lib/
│   │   ├── AuthManager.js    # Handles Amazon authentication and session management
│   │   └── BookScraper.js    # Responsible for scraping individual book details and highlights
│   └── utils/                # Utility functions (if any, e.g., file helpers, logging)
├── .env.example              # Example environment file
├── .gitignore
├── package.json              # Project metadata and dependencies
├── package-lock.json
└── README.md
```

## Key Components and Workflow 🧩

1. **`src/index.js` (Entry Point):**

   - Loads environment variables from `.env` using `dotenv`.
   - Initializes `KindleScraper` with the configuration (credentials, debug mode).
   - Calls the main methods of `KindleScraper` to start the process (`init`, `scrape`).
   - Handles top-level error catching.

2. **`src/KindleScraper.js` (Orchestrator):**

   - **`constructor(config)`:** Initializes with user config (email, password, debug settings).
   - **`async init()`:**
     - Initializes Puppeteer (launches browser instance).
     - Creates an instance of `AuthManager`.
     - Calls `AuthManager.login()` to handle Amazon login and 2FA.
   - **`async scrape()`:**
     - Navigates to the Kindle Notebook URL (from `config/constants.js`).
     - Identifies all books listed on the Notebook page.
     - For each book:
       - Creates an instance of `BookScraper`.
       - Calls methods on `BookScraper` to extract title, author, and highlights for that specific book from its section on the page.
     - Aggregates all scraped book data.
     - Saves the aggregated data to `highlights.json`.
   - **`async close()`:** Closes the Puppeteer browser instance.

3. **`src/lib/AuthManager.js` (Authentication):**

   - **`constructor(page, credentials)`:** Takes a Puppeteer page instance and user credentials.
   - **`async login()`:**
     - Navigates to the Amazon login page.
     - Fills in email and password fields.
     - Handles potential 2FA/OTP prompts by waiting for user input from the console.
     - Manages session cookies (loading existing ones, saving new ones) to attempt to bypass repeated logins.
     - Uses selectors from `config/constants.js` to interact with login form elements.

4. **`src/lib/BookScraper.js` (Book Data Extraction):**

   - **`constructor(page, bookElement)`:** Takes a Puppeteer page instance and a Puppeteer element handle representing a single book's container on the Notebook page.
   - **`async getTitle()`:** Extracts the book title from the `bookElement`.
   - **`async getAuthor()`:** Extracts the book author from the `bookElement`.
   - **`async getHighlights()`:** Extracts all highlight texts associated with the book from the `bookElement`. This might involve clicking "show more" buttons if highlights are paginated or collapsed.
   - Uses selectors from `config/constants.js` to find specific data points within a book's HTML structure.

5. **`src/config/constants.js` (Configuration Data):**
   - Stores static configuration data like:
     - Amazon URLs (login page, notebook page).
     - CSS selectors used by Puppeteer to find elements on web pages (e.g., login form fields, book titles, highlight texts, buttons).
     - Cookie file path.
   - Centralizing selectors here makes them easier to update if Amazon changes its website structure.

## Data Flow 🌊

1. User runs `npm start` or `npm run debug`.
2. `index.js` reads `.env`, creates `KindleScraper`.
3. `KindleScraper.init()` launches Puppeteer and `AuthManager.login()` handles authentication.
   - User may be prompted for 2FA in the console.
   - Session cookies are loaded/saved.
4. `KindleScraper.scrape()` navigates to Kindle Notebook.
5. For each book found on the page:
   - `BookScraper` instance is used to extract title, author, highlights.
6. All data is collected by `KindleScraper`.
7. `KindleScraper` writes data to `highlights.json`.
8. `KindleScraper.close()` shuts down Puppeteer.

## Potential Areas for Future Development 💡

- Check the project's issue tracker for feature requests
- Check the [Project Roadmap document](./08-project-roadmap.md)
