// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getTabInfo") {
    sendResponse({
      url: window.location.href,
      title: document.title,
    });
  }
});
