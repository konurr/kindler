# Contributing to Kindler 🤝🏻

Thank you for your interest in contributing to Kindler! Any help in maintaining and adding features is greatly appreciated!

## How to Contribute ⭐

There are several ways you can contribute:

- **Reporting Bugs:** If you find a bug, please create an issue in the [project's issue tracker](https://github.com/konurr/kindler/issues). Include detailed steps to reproduce the bug, error messages, and any other relevant environment details.
- **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to discuss it.
- **Writing Documentation:** Good documentation is crucial. If you find areas that are unclear or missing, feel free to suggest improvements or submit pull requests with changes.
- **Submitting Code Changes:** If you'd like to contribute code, please follow the guidelines below.

## Code Contribution Guidelines 💻

1. **Fork the Repository:** Start by forking the main Kindler repository to your own account.
2. **Clone Your Fork:** Clone your forked repository to your local machine.

   ```bash
   git clone <your_fork_url>
   cd kindler
   ```

3. **Create a Branch:** Create a new branch for your changes. Choose a descriptive branch name (e.g., `fix/login-error` or `feature/export-to-csv`).

   ```bash
   git checkout -b your-branch-name
   ```

4. **Set Up Development Environment:**

   - Ensure you have Node.js (version specified in `README.md` or `package.json`) installed.
   - Install project dependencies:

     ```bash
     npm install
     ```

   - Set up your `.env` file as described in [Getting Started](./01-getting-started.md) for testing.

5. **Make Your Changes:**

   - Write clean, well-commented code.
   - Follow the existing coding style and conventions used in the project. The project uses Prettier for formatting.
   - Ensure your changes do not break existing functionality.
   - Test your changes thoroughly.

6. **Commit Your Changes:**

   - Write clear and concise commit messages. Adhere to the [Conventional Commits Spec](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary).

7. **Push to Your Fork:** Push your changes to your forked repository on GitHub.

   ```bash
   git push origin your-branch-name
   ```

8. **Submit a Pull Request (PR):**
   - Go to the original Kindler repository on GitHub.
   - You should see a prompt to create a pull request from your recently pushed branch.
   - Provide a clear title and description for your PR, explaining the changes you've made and why they are beneficial.
   - Reference any relevant issues (e.g., "Closes #123").
   - The project maintainers will review your PR. Be prepared to discuss your changes and make further adjustments if requested.

## Issue Tracker 🐛

Before starting work on a new feature or bug fix, check the project's issue tracker to see if someone else is already working on it or if it has been discussed.

## Questions? ❓

If you have questions about contributing, feel free to ask by creating an issue.

Thank you for helping make Kindler better!
