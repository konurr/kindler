# Troubleshooting Guide 🆘

This guide provides solutions to common issues you might encounter while using Kindler.

## General Troubleshooting Steps 👣

1. **Check Prerequisites:** Ensure you have the correct version of Node.js installed and that your Amazon account details are accurate in the `.env` file. See [Getting Started](./01-getting-started.md).
2. **Run in Debug Mode:** Execute `npm run debug` (or set `DEBUG=true` in `.env`). This will show the browser automation and provide more detailed logs, which can help pinpoint where the process is failing.
3. **Update Dependencies:** Occasionally, issues can be resolved by updating to the latest versions of the project's dependencies:

   ```bash
   npm update
   ```

   Or, for a fresh install of dependencies:

   ```bash
   rm -rf node_modules package-lock.json # or del node_modules package-lock.json on Windows
   npm install
   ```

4. **Examine Logs:** Carefully read any error messages printed in the terminal. They often provide clues about the problem.

## Common Issues and Solutions 🔧

- ### Login Failures

  - **Symptom:** The script exits with an error related to login, or you see messages like "Login failed," "Incorrect credentials."
  - **Solutions:**
    - **Verify Credentials:** Double-check your `EMAIL` and `PASSWORD` in the `.env` file. Try logging into Amazon manually in a regular browser with these credentials to ensure they are correct.
    - **CAPTCHAs:** Amazon might present a CAPTCHA during login. Kindler may not be able to solve these automatically. If you see a CAPTCHA in debug mode:
      - Try logging into Amazon in your regular browser from the same IP address. Sometimes this "clears" the CAPTCHA requirement for a while.
      - Kindler may allow you to enter the CAPTCHA manually in debug mode
      - Wait and try running Kindler again later.
    - **Account Lockout:** Repeated failed login attempts might temporarily lock your Amazon account. Wait for some time before trying again.

- ### 2FA/OTP (One-Time Password) Issues

  - **Symptom:** The script prompts for an OTP, but you don't receive it, or the entered OTP is rejected.
  - **Solutions:**
    - **Check Device/App:** Ensure your registered 2FA device (phone for SMS, authenticator app) is on and has a signal/connection.
    - **Check Spam/Junk:** OTP emails or messages can sometimes land in spam or junk folders.
    - **Correct OTP Entry:** Ensure you are entering the OTP correctly and promptly in the terminal where Kindler is running. OTPs are time-sensitive.
    - **Amazon Account Settings:** Verify your 2FA settings on your Amazon account.
    - **Regional Issues:** Ensure Kindler is attempting to log into the correct Amazon domain for your region if that's a factor.

- ### No Highlights Scraped / Empty `highlights.json`

  - **Symptom:** The `highlights.json` file is empty (`[]`) or missing highlights you expect to see.
  - **Solutions:**
    - **Check Kindle Notebook Online:** Manually visit [Amazon Kindle Notebook](https://read.amazon.com/notebook) (or your regional equivalent) in your browser. Verify that your books and highlights are visible there. Kindler scrapes from this page.
    - **Sync Your Kindle:** Ensure your Kindle device or app has synced its latest highlights to the Amazon cloud.
    - **Scraping Interruption:** If the script was interrupted, it might not have completed scraping. Run it again.
    - **Website Structure Changes:** Amazon occasionally updates its website structure. If this happens, the scraper's selectors might become outdated, preventing it from finding highlights. This would require an update to Kindler's code. Check the project's issue tracker for similar reports if you suspect this.

- ### Script Crashes or Hangs

  - **Symptom:** The script stops unexpectedly, freezes, or throws an unhandled error.
  - **Solutions:**
    - **Debug Mode:** Run in `npm run debug` to get more context.
    - **Outdated Dependencies:** See "General Troubleshooting Steps" for updating dependencies.
    - **Bug in Kindler:** It's possible you've encountered a bug. Check [this project's issue tracker](https://github.com/konurr/kindler/issues) on its repository. If the issue isn't listed, consider reporting it with detailed steps to reproduce, error messages, and your environment (OS, Node.js version, etc).

- ### "Puppeteer failed to launch browser" or similar errors

  - **Symptom:** Errors related to Puppeteer, Chromium, or browser launching.
  - **Solutions:**
    - **Missing Dependencies:** Puppeteer sometimes requires additional system libraries. The error message might indicate what's missing. Search online for the error message along with your OS.
    - **Permissions:** Ensure the script has permissions to execute and write files.
    - **Conflicting Software:** Antivirus or firewall software might interfere with Puppeteer. Try temporarily disabling them to test (at your own risk).

## Reporting Issues 🐛

If you cannot resolve an issue, consider reporting it to the project maintainers (e.g., by [creating an issue on the GitHub repository](https://github.com/konurr/kindler/issues) if applicable). Provide as much detail as possible:

- Steps to reproduce the issue.
- The full error message and stack trace.
- Your operating system and Node.js version (`node -v`).
- The version of Kindler you are using (if versioned).
- Relevant parts of your `.env` file (NEVER share your actual password).
