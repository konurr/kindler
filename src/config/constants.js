/**
 * Selectors used for scraping Kindle highlights
 */
exports.SELECTORS = {
	BOOK_LIST: ".kp-notebook-library-each-book",
	HIGHLIGHT: ".kp-notebook-highlight",
	BOOK_TITLE: "h2.kp-notebook-searchable",
	BOOK_AUTHOR: "p.kp-notebook-searchable",
	BOOK_COVER: "img.kp-notebook-cover-image",
	BOOK_DATE: 'input[id^="kp-notebook-annotated-date-"]',
	BOOK_LINK: "a.a-link-normal.a-text-normal",
	HIGHLIGHT_TEXT: "#highlight",
	HIGHLIGHT_HEADER: "#annotationHighlightHeader",
	HIGHLIGHT_NOTE: ".kp-notebook-note",
	LOGIN: {
		EMAIL: "#ap_email",
		PASSWORD: "#ap_password",
		CONTINUE: "#continue",
		SUBMIT: "#signInSubmit",
	},
};

/**
 * Configuration constants
 */
exports.CONFIG = {
	LOGIN_URL: "https://read.amazon.com/notebook",
	COOKIES_PATH: "./cookies.json",
	OUTPUT_PATH: "./highlights.json",
	TIMEOUT: 10000,
};
