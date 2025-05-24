# Kindler 📖🔍

A Node.js tool to automatically scrape and export your Kindle highlights and notes from Kindle Notebook.

## Features

- 📚 Automatically scrapes all books in your Kindle library for book title, author, highlights and notes.
- 🔐 Handles Amazon login (with 2FA support)
  - Currently requires manual 2FA
- 🍪 Saves session cookies to avoid frequent re-logins
- 📝 Exports highlights to JSON format
- 🐛 Debug mode for troubleshooting

## Prerequisites

- Node.js
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
    "asin": "EXAMPLEASIN1",
    "title": "The Great Gatsby",
    "subtitle": null,
    "author": "F. Scott Fitzgerald",
    "coverImage": "https://example.com/gatsby.jpg",
    "dateAdded": "Monday January 1, 2024",
    "highlights": [
      {
        "quote": "So we beat on, boats against the current, borne back ceaselessly into the past.",
        "color": "Yellow",
        "location": "123",
        "note": ""
      },
      {
        "quote": "He smiled understandingly—much more than understandingly. It was one of those rare smiles with a quality of eternal reassurance in it, that you may come across four or five times in life.",
        "color": "Yellow",
        "location": "45",
        "note": ""
      }
    ]
  }
]
```
