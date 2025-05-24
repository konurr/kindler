# Output Format Guide 📁

Kindler exports all scraped Kindle highlights and notes into a single JSON file named `highlights.json`. This file is created in the root directory of the project. If the file already exists from a previous run, it will be overwritten.

## File Structure 📝

The `highlights.json` file contains a single JSON array. Each element in this array is an object representing a book found in your Kindle Notebook.

```json
[
  // Book Object 1
  {
    "asin": "EXAMPLEASIN1",
    "title": "The Great Gatsby",
    "subtitle": null, // Can be a string if a subtitle exists, or null
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
  },
  // Book Object 2
  {
    "asin": "EXAMPLEASIN2",
    "title": "Sapiens",
    "subtitle": "A Brief History of Humankind",
    "author": "Yuval Noah Harari",
    "coverImage": "https://example.com/sapiens.jpg",
    "dateAdded": "Tuesday February 6, 2024",
    "highlights": [
      {
        "quote": "Culture tends to argue that it forbids only that which is unnatural.",
        "color": "Yellow",
        "location": "12",
        "note": ""
      },
      {
        "quote": "Money is the most universal and most efficient system of mutual trust ever devised.",
        "color": "Yellow",
        "location": "78",
        "note": ""
      }
    ]
  }
  // ... more book objects
]
```

## Book Object Details 📖

Each object in the main array has the following properties:

- ### `asin`

  - **Type:** `String`
  - **Description:** The Amazon Standard Identification Number (ASIN) of the book. This is a unique identifier for the book on Amazon.
  - **Example:** `"EXAMPLEASIN1"`

- ### `title`

  - **Type:** `String`
  - **Description:** The main title of the book as it appears in your Kindle Notebook.
  - **Example:** `"The Great Gatsby"`

- ### `subtitle`

  - **Type:** `String` or `null`
  - **Description:** The subtitle of the book, if one exists and is captured by the scraper. If no subtitle is found or applicable, this field will be `null`.
  - **Example:** `"A Brief History of Humankind"` or `null`

- ### `author`

  - **Type:** `String`
  - **Description:** The author(s) of the book.
  - **Example:** `"F. Scott Fitzgerald"`

- ### `coverImage`

  - **Type:** `String`
  - **Description:** A URL pointing to the cover image of the book.
  - **Example:** `"https://example.com/gatsby.jpg"`

- ### `dateAdded`

  - **Type:** `String`
  - **Description:** The date when the book was added to your Kindle library, in a human-readable format.
  - **Example:** `"Monday January 1, 2024"`

- ### `highlights`

  - **Type:** `Array` of `Object`
  - **Description:** An array containing all the highlights and notes extracted for this particular book. Each element in the array is an object representing a single highlight or note.

    - The order of highlights generally corresponds to their appearance in the book/notebook.
    - If a book has no highlights or notes, this array will be empty (`[]`).

  - **Highlight Object Properties:**

    - #### `quote`

      - **Type:** `String`
      - **Description:** The text of the highlight or note.
      - **Example:** `"So we beat on, boats against the current, borne back ceaselessly into the past."`

    - #### `color`

      - **Type:** `String`
      - **Description:** The color with which the highlight was made. This may correspond to the highlight color in the Kindle app.
      - **Example:** `"Yellow"`

    - #### `location`

      - **Type:** `String`
      - **Description:** The location in the book where the highlight or note was made. This is typically a page or location number.
      - **Example:** `"123"`

    - #### `note`

      - **Type:** `String`
      - **Description:** Any additional note associated with the highlight, if applicable. This may be empty.
      - **Example:** `""` (empty string)

## Empty Output ❌

- If no books with highlights are found in your Kindle Notebook, or if your library is empty, the `highlights.json` file will contain an empty array: `[]`.

## Encoding 🔒

The `highlights.json` file is encoded in UTF-8, which supports a wide range of characters.

## Using the Output 💡

The JSON format is widely compatible and can be easily parsed by various programming languages and tools. You can use this data for:

- Personal archiving and review.
- Importing into note-taking apps (e.g., Obsidian, Roam Research, Notion) with custom scripts.
- Data analysis of your reading habits.
- Building custom applications around your Kindle highlights.
