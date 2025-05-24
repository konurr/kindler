require("dotenv").config();
const KindleScraper = require("./KindleScraper");

const config = {
	email: process.env.EMAIL,
	password: process.env.PASSWORD,
	debug: String(process.env.DEBUG).toLowerCase() === "true",
};

(async () => {
	const scraper = new KindleScraper(config);

	try {
		await scraper.init();
		await scraper.scrape();
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
})();
