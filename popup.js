//const data = require('./topdomains.json');

// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let hostName = document.getElementById("domain");

//console.log(data);
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

this._myFunction = (res) => {
 // console.log(res);
 return res;
}

getHostName = (tabs) => {
  const activeTab = tabs[0];
  const url = activeTab.url;
  const urlStart = url.indexOf("://")+3;
  let host = "";
  
  for (i = urlStart; i < url.length; i++) {
    if (url.charAt(i) != '/') {
      host = host + "" + url.charAt(i);
    } else {
      break;
    }
  }
  return host;
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  console.log(getHostName(tabs));
  domain.innerHTML = getHostName(tabs);
});

chrome.topSites.get(
  function(res) {
    console.log(res);
  }
)

fetch("https://check-ssl.p.rapidapi.com/sslcheck?domain=www.benray.com", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "check-ssl.p.rapidapi.com",
		"x-rapidapi-key": "7d697db50emshc47e26981d29824p113f47jsnd89673103d4f"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});

// like page did mount
var opt_extraInfoSpec = [];
console.log(chrome.webRequest.onHeadersReceived);
chrome.webRequest.onCompleted.addListener(this._myFunction,
  {urls: [   "<all_urls>" ] },
  ["responseHeaders"]
);


//let tab = chrome.tabs.query({ active: true, currentWindow: true });


// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
//   console.log('page checnged');
// });




// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    //document.body.style.backgroundColor = color;
    console.log('show color');
  });
}

