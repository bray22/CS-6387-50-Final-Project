let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
/*
chrome.webRequest.onBeforeRequest.addListener(
  function(details) { return {cancel: true}; },
  {urls: ["*://www.evil.com/*"]},
  ["blocking"]
);

chrome.webRequest.onSendHeaders.addListener(() =>
 function(details) { return {cancel: true}; },
  {urls: ["*://www.evil.com/*"]},
  ["blocking"]
 {console.log('hesders sent')}
);
*/


console.log(chrome.webRequest.onHeadersReceived);
chrome.webRequest.onHeadersReceived.addListener(this._myFunction,
  {urls: [   "<all_urls>" ] }
);



