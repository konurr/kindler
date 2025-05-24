# Configuration Guide 🔧

Kindler uses environment variables for configuration. These variables are stored in a `.env` file located in the root directory of the project.

## Creating the `.env` File ♻️

If you haven't already, create a `.env` file by copying the `.env.example` file:

```bash
cp .env.example .env
```

Then, open the `.env` file in a text editor and modify the values as needed.

### Environment Variables

The following variables can be configured in the `.env` file:

| Variable   | Description                                                                                                                                                  | Example                       | Required | Notes                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `EMAIL`    | Amazon account email address to log into your Kindle Notebook.                                                                                               | `EMAIL=your.name@example.com` | Yes      |                                                                                                                                 |
| `PASSWORD` | Amazon account password used together with `EMAIL` for login.                                                                                                | `PASSWORD=YourAmazonP@ssw0rd` | Yes      | Keep secure and do not commit to version control.                                                                               |
| `DEBUG`    | Enables/disables debug mode. For `true`, Puppeteer runs in non-headless (visible) mode with verbose logging; `false` uses headless mode with less verbosity. | `DEBUG=false`                 |          | Accepted values: `true` or `false` (case-insensitive). Default is false (if undefined). Using `npm run debug` overrides config. |

### Example `.env` File Content

```properties
EMAIL=jane.doe@email.com
PASSWORD=mysecretpassword123
DEBUG=false
```

## Security Best Practices 🔐

- **Never commit your `.env` file to Git or any other version control system.** The `.gitignore` file is pre-configured to ignore `.env` files, but always double-check.
- Store your `.env` file securely, especially if working in a shared environment.
