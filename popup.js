// popup.js
document.getElementById('saveButton').addEventListener('click', function () {
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    // Save the list of tabs to storage or perform desired actions
    console.log(tabs);
  });
});
