// popup.js

// Function to open a link in a new tab
function openLinkInNewTab(url) {
  chrome.tabs.create({ url, active: true });
}

// Function to display open tab URLs for the focused window
function displayOpenTabsForFocusedWindow() {
  chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
    const listContainer = document.getElementById("tabList");

    // Clear previous entries
    listContainer.innerHTML = "";

    // Display the URLs for the focused window in the popup
    const windowTitle = currentWindow.title || "Current Window";

    // Create a heading for the focused window
    const windowHeading = document.createElement("h3");
    windowHeading.textContent = windowTitle;
    listContainer.appendChild(windowHeading);

    // Create a list for the focused window
    const windowList = document.createElement("ul");

    currentWindow.tabs.forEach((tab) => {
      // Exclude specific URLs like "about:blank" and "chrome://newtab/"
      if (tab.url && tab.url !== "about:blank" && tab.url !== "chrome://newtab/") {
        const listItem = document.createElement("li");
        listItem.textContent = tab.url;

        // Make the list item clickable
        listItem.addEventListener("click", () => {
          openLinkInNewTab(tab.url);
        });

        windowList.appendChild(listItem);
      }
    });

    listContainer.appendChild(windowList);
  });
}

// Call the function when the popup is opened
document.addEventListener("DOMContentLoaded", displayOpenTabsForFocusedWindow);
