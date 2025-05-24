const fs = require("fs");
const { SELECTORS, CONFIG } = require("../config/constants");

class AuthManager {
	constructor(page) {
		this.page = page;
	}

	async loadCookies() {
		if (fs.existsSync(CONFIG.COOKIES_PATH)) {
			const cookies = JSON.parse(fs.readFileSync(CONFIG.COOKIES_PATH, "utf8"));
			await this.page.setCookie(...cookies);
			console.log("✅ Loaded cookies from file.");
			return true;
		}
		return false;
	}

	async login(credentials) {
		const { email, password } = credentials;

		await this.page.goto(CONFIG.LOGIN_URL, { waitUntil: "networkidle2" });

		if (!this.page.url().includes("signin")) {
			console.log("✅ Already logged in.");
			return true;
		}

		console.log("🔐 Logging in...");
		await this.page.type(SELECTORS.LOGIN.EMAIL, email);
		await this.page.click(SELECTORS.LOGIN.CONTINUE);
		await this.page.type(SELECTORS.LOGIN.PASSWORD, password);
		await this.page.click(SELECTORS.LOGIN.SUBMIT);

		console.log("⏸ Complete 2FA manually...");
		// Indefinite timeout is intentional to allow manual 2FA completion.
		await this.page.waitForSelector(SELECTORS.BOOK_LIST, { timeout: 0 });

		await this.saveCookies();
		return true;
	}

	async saveCookies() {
		const cookies = await this.page.cookies();
		fs.writeFileSync(CONFIG.COOKIES_PATH, JSON.stringify(cookies, null, 2));
		console.log("💾 Session cookies saved.");
	}

	async isLoggedIn() {
		try {
			// First check if we're currently on the notebook page
			if (this.page.url() === CONFIG.LOGIN_URL) {
				// Try to find the book list element which is only visible when logged in
				const bookList = await this.page.$(SELECTORS.BOOK_LIST);
				return bookList !== null;
			}

			// If we're not on the notebook page, navigate there
			await this.page.goto(CONFIG.LOGIN_URL, { waitUntil: "networkidle2" });
			
			// If we're redirected to signin, we're not logged in
			if (this.page.url().includes("signin")) {
				return false;
			}

			// Double check for book list element
			const bookList = await this.page.$(SELECTORS.BOOK_LIST);
			return bookList !== null;
		} catch (error) {
			console.warn("⚠️ Error checking login status:", error.message);
			return false;
		}
	}
}

module.exports = AuthManager;
