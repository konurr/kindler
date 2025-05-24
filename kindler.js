require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const DEBUG = String(process.env.DEBUG).toLowerCase() === "true";
const COOKIES_PATH = "./cookies.json";

;(async () => {
  const browser = await puppeteer.launch({ headless: !DEBUG });
  const page = await browser.newPage();

  // ─── Load cookies ─────────────────────────────────────────────
  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Loaded cookies from file.");
  }

  // ─── Navigate & login ────────────────────────────────────────
  await page.goto("https://read.amazon.com/notebook", { waitUntil: "networkidle2" });
  if (page.url().includes("signin")) {
    console.log("🔐 Logging in...");
    await page.type("#ap_email", EMAIL);
    await page.click("#continue");
    await page.type("#ap_password", PASSWORD);
    await page.click("#signInSubmit");
    console.log("⏸ Complete 2FA manually...");
    await page.waitForSelector(".kp-notebook-library-each-book", { timeout: 0 });
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(await page.cookies(), null, 2));
    console.log("💾 Session cookies saved.");
  } else {
    console.log("✅ Already logged in.");
  }

  // ─── Count books ──────────────────────────────────────────────
  await page.waitForSelector(".kp-notebook-library-each-book");
  const totalBooks = await page.$$eval(
    ".kp-notebook-library-each-book",
    (books) => books.length
  );

  const allHighlights = [];

  for (let i = 0; i < totalBooks; i++) {
    console.log(`📖 Opening book ${i + 1}/${totalBooks}`);

    // Go back to library and re-select
    await page.goto("https://read.amazon.com/notebook", { waitUntil: "networkidle2" });
    await page.waitForSelector(".kp-notebook-library-each-book");
    const books = await page.$$(".kp-notebook-library-each-book");
    if (!books[i]) {
      console.warn(`⚠️ Book ${i + 1} not found—skipping.`);
      continue;
    }

    // Extract book-level meta
    const bookMeta = await books[i].evaluate((book) => {
      const asin = book.id;
      const titleEl = book.querySelector("h2.kp-notebook-searchable");
      const authorEl = book.querySelector("p.kp-notebook-searchable");
      const imgEl = book.querySelector("img.kp-notebook-cover-image");
      const dateInput = book.querySelector(`input[id^="kp-notebook-annotated-date-"]`);

      const fullTitle = titleEl?.innerText.trim() || "Untitled";
      const [title, subtitle] = fullTitle.split(/[:—-]/).map((t) => t.trim());
      const author = authorEl?.innerText.replace(/^By:\s*/, "").trim() || "Unknown";
      const coverImage = imgEl?.src || null;
      const dateAdded = dateInput?.value.trim() || null;

      return { asin, title, subtitle, author, coverImage, dateAdded };
    });

    // Click into the book
    try {
      const link = await books[i].$("a.a-link-normal.a-text-normal");
      await link.evaluate((el) => el.scrollIntoView({ behavior: "instant", block: "center" }));
      await page.evaluate((el) => el.click(), link);
    } catch (err) {
      console.warn(`⚠️ Could not click book ${i + 1}: ${err.message}`);
      continue;
    }

    // ─── Extract highlights + metadata ────────────────────────────
    try {
      await page.waitForSelector(".kp-notebook-highlight", { timeout: 10000 });

      if (DEBUG) {
        const sample = await page.$$eval(
          ".kp-notebook-highlight",
          (els) => els.slice(0, 2).map((h) => h.parentElement.innerHTML)
        );
        console.log("🪲 Sample container HTML:", sample);
      }

      const highlights = await page.evaluate(() => {
        // collect all headers and all highlight blocks
        const headers = Array.from(document.querySelectorAll("#annotationHighlightHeader"));
        const notes   = Array.from(document.querySelectorAll(".kp-notebook-note"));
        const blocks  = Array.from(document.querySelectorAll(".kp-notebook-highlight"));

        return blocks.map((blk, idx) => {
          // text
          const quote = blk.querySelector("#highlight")?.innerText.trim() || "";

          // header metadata
          let color = null, location = null;
          const header = headers[idx];
          if (header) {
            const [cPart, locPart] = header.innerText.split("|").map((s) => s.trim());
            color = cPart.replace(/ highlight$/i, "") || null;
            const m = locPart.match(/Page:\s*(\d+)/i);
            location = m ? m[1] : null;
          }

          // your note
          const noteEl = notes[idx];
          const note = noteEl ? noteEl.innerText.replace(/^Note:\s*/, "").trim() : null;

          return { quote, color, location, note };
        })
        .filter((o) => o.quote.length);
      });

      allHighlights.push({ ...bookMeta, highlights });
    } catch (err) {
      console.warn(`⚠️ Error scraping highlights for book ${i + 1}: ${err.message}`);
    }
  }

  // Debug dump
  if (DEBUG) {
    console.log("🐛 Full result:", JSON.stringify(allHighlights, null, 2));
  }

  // Write out
  fs.writeFileSync("highlights.json", JSON.stringify(allHighlights, null, 2), "utf-8");
  console.log("💾 highlights.json saved.");

  await browser.close();
})();
