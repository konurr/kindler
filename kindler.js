require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const COOKIES_PATH = "./cookies.json";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Load cookies if available
  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Loaded cookies from file.");
  }

  // Go to Kindle notebook
  await page.goto("https://read.amazon.com/notebook", {
    waitUntil: "networkidle2",
  });

  // If login is needed
  if (page.url().includes("signin")) {
    console.log("🔐 Not logged in, logging in...");
    await page.waitForSelector("#ap_email", { visible: true });
    await page.type("#ap_email", EMAIL);
    await page.click("#continue");

    await page.waitForSelector("#ap_password", { visible: true });
    await page.type("#ap_password", PASSWORD);
    await page.click("#signInSubmit");

    console.log("⏸ Complete 2FA manually...");
    await page.waitForSelector(".kp-notebook-library-each-book", {
      timeout: 0,
    });

    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log("💾 Session cookies saved.");
  } else {
    console.log("✅ Already logged in.");
  }

  // Get number of books
  await page.waitForSelector(".kp-notebook-library-each-book");
  const totalBooks = await page.$$eval(
    ".kp-notebook-library-each-book",
    (books) => books.length,
  );

  const allHighlights = [];

  for (let i = 0; i < totalBooks; i++) {
    console.log(`📖 Opening book ${i + 1}/${totalBooks}`);

    await page.goto("https://read.amazon.com/notebook", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector(".kp-notebook-library-each-book");

    const books = await page.$$(".kp-notebook-library-each-book");
    if (!books[i]) {
      console.warn(`⚠️ Book ${i + 1} not found. Skipping.`);
      continue;
    }

    // ✅ Extract title and author from the library view
    const bookMeta = await books[i].evaluate((book) => {
      const titleEl = book.querySelector("h2.kp-notebook-searchable");
      const authorEl = book.querySelector("p.kp-notebook-searchable");
      let fullTitle = titleEl?.innerText.trim() || "Untitled";
      let [title, subtitle] = fullTitle.split(/[:—-]/).map((s) => s.trim());
      const author =
        authorEl?.innerText.replace(/^By:\s*/, "").trim() || "Unknown";
      return { title, subtitle, author };
    });

    try {
      const clickable = await books[i].$("a.a-link-normal.a-text-normal");
      if (!clickable) {
        const outer = await books[i].evaluate((el) => el.outerHTML);
        console.warn(
          `⚠️ Could not find <a> to click in book ${i + 1}. HTML:\n${outer}`,
        );
        continue;
      }

      await clickable.evaluate((el) => {
        el.scrollIntoView({ behavior: "instant", block: "center" });
      });
      await page.waitForFunction(
        (el) => {
          const rect = el.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth)
          );
        },
        {},
        clickable,
      );
      await page.evaluate((el) => el.click(), clickable);
    } catch (err) {
      console.warn(`⚠️ Could not click book ${i + 1}: ${err.message}`);
      continue;
    }

    // 📚 Extract highlights only
    try {
      await page.waitForSelector(".kp-notebook-highlight", { timeout: 10000 });

      const highlights = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".kp-notebook-highlight"))
          .map((h) => h.innerText.trim())
          .filter(Boolean);
      });

      allHighlights.push({ ...bookMeta, highlights });
    } catch (err) {
      console.warn(`⚠️ Error scraping book ${i + 1}:`, err.message);
    }
  }

  console.log(JSON.stringify(allHighlights, null, 2));
  fs.writeFileSync(
    "highlights.json",
    JSON.stringify(allHighlights, null, 2),
    "utf-8",
  );
  console.log("💾 highlights.json saved.");
  await browser.close();
})();
