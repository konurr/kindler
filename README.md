# Kindler 📖🔍

A Node.js tool to automatically scrape and export your Kindle highlights and notes from Amazon's Kindle Cloud Reader.

## Features

- 📚 Automatically scrapes all books in your Kindle library
- 🔐 Handles Amazon login (with 2FA support)
  - Requires manual 2FA for now (you will need to enter the 2FA code sent to your device during login; ensure your device is accessible and check spam/junk folders if you don't receive the code)
- 🍪 Saves session cookies to avoid frequent re-logins
- 📝 Exports highlights to JSON format
- 🐛 Debug mode for troubleshooting

## Prerequisites

- Node.js (>= 14.0.0)
- Amazon account with Kindle books
- Kindle highlights/notes to export

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with your credentials:
```properties
EMAIL=your.email@example.com
PASSWORD=your-password
DEBUG=false
```

## Usage

Run the script:

```bash
npm start
```

For debug mode (shows browser automation and additional logging):

```bash
npm run debug
```

The script will:

1. Log into your Amazon account (may require 2FA)
2. Stores session cookie which can be used to login next time
3. Navigate through your Kindle library
4. Extract highlights from each book
5. Save results to `highlights.json`

## Output

The script generates a `highlights.json` file containing an array of books with their highlights:

```json
[
  {
    "title": "Book Title",
    "subtitle": "Book Subtitle",
    "author": "Author Name",
    "highlights": [
      "Highlight 1",
      "Highlight 2"
    ]
  }
]
```
