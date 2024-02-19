// background.js

let windowTabs = {};

chrome.windows.onRemoved.addListener((windowId) => {
  // Clean up the stack when a window is closed
  delete windowTabs[windowId];
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.windows.getCurrent({}, (currentWindow) => {
    const windowId = currentWindow.id;

    if (!windowTabs[windowId]) {
      windowTabs[windowId] = [];
    }

    const closedTab = { tabId, url: removeInfo.url, title: removeInfo.title };
    windowTabs[windowId].unshift(closedTab);

    if (windowTabs[windowId].length > 10) {
      windowTabs[windowId].pop(); // Keep only the last 10 closed tabs
    }
  });
});

// Function to get recently closed tabs for the current window
function getRecentlyClosedTabs(windowId) {
  return windowTabs[windowId] || [];
}

// Listen for messages from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getRecentlyClosedTabs") {
    chrome.windows.getCurrent({}, (currentWindow) => {
      const currentWindowId = currentWindow.id;
      const recentlyClosedTabs = getRecentlyClosedTabs(currentWindowId);
      // Make sure to filter out closed tabs with undefined URLs
      const filteredTabs = recentlyClosedTabs.filter((tab) => tab.url !== undefined);
      sendResponse({ recentlyClosedTabs: filteredTabs });
    });
  }
});
