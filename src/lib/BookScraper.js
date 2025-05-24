const { SELECTORS, CONFIG } = require("../config/constants");

class BookScraper {
	constructor(page, debug = false) {
		this.page = page;
		this.debug = debug;
	}

	async getTotalBooks() {
		await this.page.waitForSelector(SELECTORS.BOOK_LIST);
		return this.page.$$eval(SELECTORS.BOOK_LIST, (books) => books.length);
	}

	async getBookMetadata(bookElement) {
		return bookElement.evaluate((book, selectors) => {
			const asin = book.id;
			const titleEl = book.querySelector(selectors.BOOK_TITLE);
			const authorEl = book.querySelector(selectors.BOOK_AUTHOR);
			const imgEl = book.querySelector(selectors.BOOK_COVER);
			const dateInput = book.querySelector(selectors.BOOK_DATE);

			const fullTitle = titleEl?.innerText.trim() || "Untitled";
			const [title, subtitle] = fullTitle.split(/[:—-]/).map((t) => t.trim());
			const author =
				authorEl?.innerText.replace(/^By:\s*/, "").trim() || "Unknown";
			const coverImage = imgEl?.src || null;
			const dateAdded = dateInput?.value.trim() || null;

			return { asin, title, subtitle, author, coverImage, dateAdded };
		}, SELECTORS);
	}

	async clickBookLink(bookElement, index, total) {
		try {
			const link = await bookElement.$(SELECTORS.BOOK_LINK);
			await link.evaluate((el) =>
				el.scrollIntoView({ behavior: "instant", block: "center" })
			);
			await this.page.evaluate((el) => el.click(), link);
			return true;
		} catch (err) {
			console.warn(
				`⚠️ Could not click book ${index + 1}/${total}: ${err.message}`
			);
			return false;
		}
	}

	async getHighlights() {
		await this.page.waitForSelector(SELECTORS.HIGHLIGHT, {
			timeout: CONFIG.TIMEOUT,
		});

		if (this.debug) {
			const sample = await this.page.$$eval(SELECTORS.HIGHLIGHT, (els) =>
				els.slice(0, 2).map((h) => h.parentElement.innerHTML)
			);
			console.log("🪲 Sample container HTML:", sample);
		}

		return this.page.evaluate((selectors) => {
			const headers = Array.from(
				document.querySelectorAll(selectors.HIGHLIGHT_HEADER)
			);
			const notes = Array.from(document.querySelectorAll(selectors.HIGHLIGHT_NOTE));
			const blocks = Array.from(
				document.querySelectorAll(selectors.HIGHLIGHT)
			);

			return blocks
				.map((blk, idx) => {
					const quote = blk.querySelector(selectors.HIGHLIGHT_TEXT)?.innerText.trim() || "";

					let color = null,
						location = null;
					const header = headers[idx];
					if (header) {
						const [cPart, locPart] = header.innerText
							.split("|")
							.map((s) => s.trim());
						color = cPart.replace(/ highlight$/i, "") || null;
						const m = locPart.match(/Page:\s*(\d+)/i);
						location = m ? m[1] : null;
					}

					const noteEl = notes[idx];
					const note = noteEl
						? noteEl.innerText.replace(/^Note:\s*/, "").trim()
						: null;

					return { quote, color, location, note };
				})
				.filter((o) => o.quote.length);
		}, SELECTORS);
	}
}

module.exports = BookScraper;
