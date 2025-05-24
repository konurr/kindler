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
		await this.page.waitForSelector(SELECTORS.BOOK_LIST, { timeout: 0 });

		await this.saveCookies();
		return true;
	}

	async saveCookies() {
		const cookies = await this.page.cookies();
		fs.writeFileSync(CONFIG.COOKIES_PATH, JSON.stringify(cookies, null, 2));
		console.log("💾 Session cookies saved.");
	}
}

module.exports = AuthManager;
