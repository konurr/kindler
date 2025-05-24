# Usage Guide 📘

This guide explains how to run Kindler and what to expect during the process.

## Running Kindler 🏃🏻‍♂️

Once you have [installed and configured Kindler](./01-getting-started.md), you can run it using npm scripts defined in the `package.json` file.

### Standard Mode

To run the scraper in standard mode, open your terminal in the project's root directory and execute:

```bash
npm start
```

**What to Expect:**

1. **Login Attempt:** Kindler will attempt to log into your Amazon account using the credentials provided in your `.env` file.
   - A browser window (controlled by Puppeteer) may or may not be visible depending on the `DEBUG` setting.
2. **2FA/OTP Prompt (if applicable):**
   - If your Amazon account has Two-Factor Authentication (2FA) enabled, or if Amazon requires additional verification, Kindler will pause and prompt you in the terminal to enter the One-Time Password (OTP) sent to your registered device (phone/email).
   - **You must manually enter this code in the terminal where Kindler is running.**
   - Check your SMS, authenticator app, or email (including spam/junk folders) for the OTP.
3. **Session Cookie:** Upon successful login, Kindler saves a session cookie. This helps in avoiding repeated logins and 2FA prompts in subsequent runs.
4. **Navigating Kindle Library:** The script will navigate to your Kindle Notebook page (read.amazon.com/notebook or the equivalent for your Amazon region).
5. **Scraping Highlights:** Kindler will iterate through each book in your library listed on the Notebook page. For each book, it will:
   - Extract the book title and author.
   - Extract all highlights and notes associated with that book.
6. **Saving Results:** All extracted data is compiled into a single JSON file.
   - The output file is named `highlights.json` and is saved in the root directory of the project.
   - If `highlights.json` already exists, it will be overwritten with the new data.
7. **Completion:** Once all books have been processed, the script will indicate completion in the terminal.

### Debug Mode

For troubleshooting or to see the browser automation in action, you can run Kindler in debug mode:

```bash
npm run debug
```

Alternatively, if you want to always run in debug mode, make sure your `.env` has `DEBUG=true`.

**Differences in Debug Mode:**

- **Visible Browser:** The Puppeteer-controlled browser window will always be visible, allowing you to observe the navigation and scraping process.
- **Additional Logging:** More detailed logs will be printed to the terminal, which can be helpful for diagnosing issues.
- The `DEBUG` flag in your `.env` file should also be set to `true` for full debug output, though `npm run debug` will achieve debug mode without the need to edit your config file.

## Output File 📁

The primary output of Kindler is the `highlights.json` file. For a detailed explanation of its structure, please refer to the [Output Format documentation](./04-output-format.md).

## Common Scenarios ⭐

- **First Run:** Expect to be prompted for 2FA/OTP.
- **Subsequent Runs:** If the session cookie is still valid, Kindler might log in directly without requiring 2FA. However, Amazon session cookies can expire, or Amazon might require re-verification periodically.
- **No Highlights:** If you have no highlights or notes for a particular book, or if your Kindle library is empty on the Notebook page, the `highlights` array for that book or the entire output array might be empty.
- **Interruptions:** If the script is interrupted (e.g., by pressing `Ctrl+C` or due to an error), the `highlights.json` file might be incomplete or not created. You will need to run the script again.

Refer to the [Troubleshooting Guide](./05-troubleshooting.md) if you encounter any issues.
