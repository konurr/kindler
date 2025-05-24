const fs = require("fs");
const puppeteer = require("puppeteer");
const AuthManager = require("./lib/AuthManager");
const BookScraper = require("./lib/BookScraper");
const { SELECTORS, CONFIG } = require("./config/constants");

class KindleScraper {
	constructor(config) {
		this.config = config;
		this.browser = null;
		this.page = null;
		this.auth = null;
		this.scraper = null;
	}

	async init() {
		this.browser = await puppeteer.launch({ headless: !this.config.debug });
		this.page = await this.browser.newPage();
		this.auth = new AuthManager(this.page);
		this.scraper = new BookScraper(this.page, this.config.debug);
	}

	async scrape() {
		try {
			// Handle authentication
			await this.auth.loadCookies();
			await this.auth.login({
				email: this.config.email,
				password: this.config.password,
			});

			// Get total books
			const totalBooks = await this.scraper.getTotalBooks();
			const allHighlights = [];

			// Navigate to library and retrieve book list once
			// Check if already logged in to avoid unnecessary reloads
			const isLoggedIn = await this.auth.isLoggedIn();
			if (!isLoggedIn) {
				await this.page.goto(CONFIG.LOGIN_URL, { waitUntil: "networkidle2" });
				await this.page.waitForSelector(SELECTORS.BOOK_LIST);
			}
			const books = await this.page.$$(SELECTORS.BOOK_LIST);

			// Iterate through books
			for (let i = 0; i < totalBooks; i++) {
				console.log(`📖 Opening book ${i + 1}/${totalBooks}`);

				if (!books[i]) {
					console.warn(`⚠️ Book ${i + 1} not found—skipping.`);
					continue;
				}

				// Get book metadata
				const bookMeta = await this.scraper.getBookMetadata(books[i]);

				// Navigate to book's highlights
				const clicked = await this.scraper.clickBookLink(
					books[i],
					i,
					totalBooks
				);
				if (!clicked) continue;

				try {
					const highlights = await this.scraper.getHighlights();
					allHighlights.push({ ...bookMeta, highlights });
				} catch (err) {
					console.warn(
						`⚠️ Error scraping highlights for book ${i + 1}: ${err.message}`
					);
				}
			}

			// Save results
			if (this.config.debug) {
				console.log("🐛 Full result:", JSON.stringify(allHighlights, null, 2));
			}

			fs.writeFileSync(
				CONFIG.OUTPUT_PATH,
				JSON.stringify(allHighlights, null, 2),
				"utf-8"
			);
			console.log("💾 highlights.json saved.");
		} finally {
			await this.cleanup();
		}
	}

	async cleanup() {
		if (this.browser) {
			await this.browser.close();
		}
	}
}

module.exports = KindleScraper;
