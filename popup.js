// popup.js
function getWindowKey(windowId, key) {
	return `${windowId}_${key}`
}

function getExistingItems(windowId) {
	const key = getWindowKey(windowId, 'tabs')
	return JSON.parse(localStorage.getItem(key)) || []
}

function getRecentlyClosedItems(windowId) {
	const key = getWindowKey(windowId, 'recentlyClosed')
	return JSON.parse(localStorage.getItem(key)) || []
}

function setExistingItems(windowId, items) {
	const key = getWindowKey(windowId, 'tabs')
	localStorage.setItem(key, JSON.stringify(items))
}

function setRecentlyClosedItems(windowId, items) {
	const key = getWindowKey(windowId, 'recentlyClosed')
	localStorage.setItem(key, JSON.stringify(items))
}

// Function to open a link in a new tab
function openLinkInNewTab(url) {
	chrome.tabs.create({ url, active: true })
}

// Function to display open tab URLs for the focused window
function displayOpenTabsForFocusedWindow() {
	chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
		const windowId = currentWindow.id

		const listContainer = document.getElementById('tabList')
		const recentlyClosedContainer =
			document.getElementById('recentlyClosedList')

		// Clear previous entries
		listContainer.innerHTML = ''
		recentlyClosedContainer.innerHTML = ''

		// Create a list for the focused window
		const windowList = document.createElement('ul')
		const recentlyClosedList = document.createElement('ul')

		const existingItems = getExistingItems(windowId)
		const recentlyClosedItems = getRecentlyClosedItems(windowId)

		// Get the URLs of currently open tabs
		const openTabURLs = currentWindow.tabs
			.filter(
				(tab) =>
					tab.url &&
					tab.url !== 'about:blank' &&
					tab.url !== 'chrome://newtab/',
			)
			.map((tab) => tab.url)

		// Find URLs that were previously stored but are not in openTabURLs
		const closedTabs = existingItems.filter(
			(url) => !openTabURLs.includes(url),
		)

		// Update recentlyClosedItems with the closedTabs
		setRecentlyClosedItems(windowId, recentlyClosedItems.concat(closedTabs))

		// Update existingItems with the openTabURLs
		setExistingItems(windowId, openTabURLs)

		// Display the open tabs in the popup
		openTabURLs.forEach((url) => {
			const listItem = document.createElement('li')
			listItem.textContent = url

			// Make the list item clickable
			listItem.addEventListener('click', () => {
				openLinkInNewTab(url)
			})

			windowList.appendChild(listItem)
		})

		// Display the recently closed tabs in the popup
		recentlyClosedItems.forEach((url) => {
			const listItem = document.createElement('li')
			listItem.textContent = url

			// Make the list item clickable
			listItem.addEventListener('click', () => {
				openLinkInNewTab(url)
			})

			recentlyClosedList.appendChild(listItem)
		})

		listContainer.appendChild(windowList)
		recentlyClosedContainer.appendChild(recentlyClosedList)
	})
}

// Call the function when the popup is opened
document.addEventListener('DOMContentLoaded', displayOpenTabsForFocusedWindow)
