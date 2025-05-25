const fs = require("fs");
const puppeteer = require("puppeteer");
const AuthManager = require("./lib/AuthManager");
const BookScraper = require("./lib/BookScraper");
const { SELECTORS, CONFIG } = require("./config/constants");
const cliProgress = require("cli-progress");

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
		const startTime = Date.now();
		let totalHighlights = 0;
		const progressBar = new cliProgress.SingleBar({
			format: 'Scraping |{bar}| {percentage}% | {value}/{total} books',
			barCompleteChar: '\u2588',
			barIncompleteChar: '-',
			hideCursor: true
		});
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

			progressBar.start(totalBooks, 0);

			// Iterate through books
			for (let i = 0; i < totalBooks; i++) {
				if (!books[i]) {
					console.warn(`⚠️ Book ${i + 1} not found—skipping.`);
					progressBar.increment();
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
				if (!clicked) {
					progressBar.increment();
					continue;
				}

				try {
					const highlights = await this.scraper.getHighlights();
					allHighlights.push({ ...bookMeta, highlights });
					totalHighlights += highlights.length;
				} catch (err) {
					console.warn(
						`⚠️ Error scraping highlights for book ${i + 1}: ${err.message}`
					);
				}
				progressBar.increment();
			}

			progressBar.stop();

			// Save results
			if (this.config.debug) {
				console.log("🐛 Full result:", JSON.stringify(allHighlights, null, 2));
			}

			fs.writeFileSync(
				CONFIG.OUTPUT_PATH,
				JSON.stringify(allHighlights, null, 2),
				"utf-8"
			);
			
			const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
			console.log("\n--- Summary ---");
			console.log(`Total books processed: ${totalBooks} 📚`);
			console.log(`Total highlights processed: ${totalHighlights} ✍️`);
			console.log(`Elapsed time: ${elapsed} seconds ⏱️`);
			console.log("All highlights saved to highlights.json 💾");
		} finally {
			progressBar.stop();
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
