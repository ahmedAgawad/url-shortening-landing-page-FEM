// nav menu toggle for mobile
const hamburgerBtn = document.querySelector(".header__hamburgerBtn");
const nav = document.querySelector(".header__nav");

hamburgerBtn.addEventListener("click", () => {
	nav.classList.toggle("header__nav--open");
});

// shorten links functionality

// DOM elements
const shortForm = document.querySelector(".short__form");
const shortInput = document.querySelector(".short__input");
const shortError = document.querySelector(".short__error");
const shortSubmit = document.querySelector(".short__submit");
const shortLinks = document.querySelector(".short__links");

// Display links from localStorage
function displayStoreLinks() {
	const storedLinks = localStorage.getItem("links");
	if (storedLinks) {
		shortLinks.innerHTML = storedLinks;
		shortLinks.querySelectorAll(".short__copy").forEach((btn) => {
			btn.textContent = "Copy";
			btn.classList.remove("short__copy--copied");
			btn.addEventListener("click", copyLink);
		});
	}
};

displayStoreLinks();

// Submit button event
shortForm.addEventListener("submit", (e) => {
	e.preventDefault();

	if (shortInput.value === "") {
		shortError.textContent = "Please add a link";
		shortInput.classList.add("short__input--error");
	} else {
		shortInput.classList.remove("short__input--error");
		requestShortedLink(shortInput.value.toLowerCase());
		shortInput.value = "";
		shortInput.focus();
	}
});

// fetching Shortened URL
async function requestShortedLink  (linkToShort) {
	const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${linkToShort}`);
	const data = await response.json();

	if (data.ok) {
		addLinkBox(linkToShort, data.result.short_link);
	} else {
		shortError.textContent = "Please enter a valid URL";
		shortInput.classList.add("short__input--error");
	}
};

// Add the Shortened link as Box
function addLinkBox(originalLink, shortedLink) {
	const linkBox = `<div class="short__link">
							<p class="short__linkText">${originalLink}</p>

							<div class="short__cta">
								<a href="https://${shortedLink}" class="short__shortened" target="_blank">${shortedLink}</a>

								<button type="button" class="btn short__copy">Copy</button>
							</div>
						</div>`;
	shortLinks.insertAdjacentHTML("afterbegin", linkBox);

	shortLinks.querySelector(".short__copy").addEventListener("click", copyLink);

	localStorage.setItem("links", shortLinks.innerHTML);
};

// Copy a link onclick
function copyLink(evObj)  {
	const btn = evObj.target;
	const linkToCopy = evObj.target.parentElement.firstElementChild.textContent;
	navigator.clipboard.writeText(linkToCopy);
	btn.textContent = "Copied!";
	btn.classList.add("short__copy--copied");
};


