# Getting Started with Kindler

This guide will walk you through setting up and installing Kindler, a tool to scrape your Kindle highlights and notes.

## Prerequisites ✅

Before you begin, ensure you have the following installed and set up:

- **Node.js:** Version 14.0.0 or higher. You can download it from [nodejs.org](https://nodejs.org/).
- **npm:** Node Package Manager, which comes with Node.js.
- **Amazon Account:** You'll need an active Amazon account with Kindle books and highlights.
- **Git:** For cloning the repository (optional, you can also download the source code as a ZIP).

## Installation 📦

Follow these steps to install Kindler:

1. **Clone the Repository:**
   Open your terminal or command prompt and run:

   ```bash
   git clone <repository_url> kindler
   cd kindler
   ```

   (Replace `<repository_url>` with the actual URL of the Kindler repository.)
   Alternatively, download the source code ZIP file and extract it.

2. **Install Dependencies:**
   Navigate to the project's root directory (if you're not already there) and install the necessary Node.js packages:

   ```bash
   npm install
   ```

   This command will download and install all the libraries Kindler depends on, as defined in the `package.json` file.

3. **Set Up Environment Variables:**
   Kindler requires your Amazon credentials to log in and access your Kindle library. These are stored in a `.env` file.

   - Create a new file named `.env` in the root directory of the project.
   - Copy the contents from `.env.example` into your new `.env` file.
   - Open the `.env` file and fill in your details:

     ```properties
     EMAIL=your.amazon.email@example.com
     PASSWORD=your-amazon-password
     DEBUG=false
     ```

     - `EMAIL`: Your Amazon account email address.
     - `PASSWORD`: Your Amazon account password.
     - `DEBUG`: Set to `true` to enable debug mode (shows browser automation and more logs), or `false` to run normally.

   **Important Security Note:** The `.env` file contains sensitive credentials. Ensure this file is **never** committed to version control (it's already listed in `.gitignore` to help prevent this).

## Next Steps 👣

Once you've completed these steps, you're ready to run Kindler! Proceed to the [Usage Guide](./02-usage-guide.md) for instructions on how to start scraping your highlights.

## Troubleshooting Installation 🆘

- **Node.js/npm not found:** Ensure Node.js is correctly installed and its `bin` directory is in your system's PATH. You can check your installation by running `node -v` and `npm -v`.
- **Git not found:** If you don't have Git, you can download the project source as a ZIP file from the repository page.
- **Dependency installation errors:**
  - Ensure you have a stable internet connection.
  - Try deleting the `node_modules` folder and `package-lock.json` file, then run `npm install` again.
  - Check for any specific error messages, as they might indicate missing system libraries or permission issues.
