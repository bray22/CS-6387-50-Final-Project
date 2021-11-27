

// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
let hostName = document.getElementById("domain");
this.topdomains = [];

//console.log(data);
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

this._myFunction = (res) => {
  result = fetch("./topdomains.json")
  //await fetch("./topdomains.json")
   // .then(response => {
  // return response.json();
  //})
  .then(response => {
    return response;
 });
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

  if (host.indexOf('www.')) {
    host.replace("www.", "");
  }

  return host;
}

getTopDomains = async () => {
  result = await fetch("./topdomains.json");
 
  return result;
}


getLevenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

domainHasPunycode = (hostName) => {
  let hasPunycode = false;

  if (hostName.match(/^xn--/)) {
    hasPunycode = true;
    punycode.innerHTML = 'Has Punycode';
    punycode.style.color = 'red';
  } else {
    punycode.innerHTML = 'No';
    punycode.style.color = 'green';
  }

  return hasPunycode;
}

compareHostWithTopDomains = (hostName, domains) => {
  let levenshteinDistance = 0;
  let safe = true;
  domains.forEach(element => {
    levenshteinDistance = getLevenshteinDistance(element, hostName);

    if (levenshteinDistance > 0 && levenshteinDistance < 3) {
      const warning = `${hostName} is like ${element}`; 
      similar.innerHTML = warning;
      similar.style.color = 'red';
      safe = false;
      return;
    }
    if (levenshteinDistance === 0) {
    const message = 'This is a very popular domain';
      similar.innerHTML = message;
      similar.style.color = 'green';
      return;
    } 
    
  });
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  const hostName = getHostName(tabs).replace("www.", "");
  domain.innerHTML = hostName;
  let ress = {}
  const result = getTopDomains();
  console.log(result);
  result.then(response => response.body)
  .then(rb => {
    const reader = rb.getReader()

    return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then( ({done, value}) => {
            // If there is no more data to read
            if (done) {
              console.log('done', done);
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            // Check chunks by logging to the console
            console.log(done, value);
            push();
          })
        }
        push();
      }
    });
  })  
  .then(stream => {
    // Respond with our stream
    return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
  })
  .then(result => {
    // Do things with result
    domainObject = JSON.parse(result);
    //console.log(domainObject.topdomains);
    this.topdomains = domainObject.topdomains;
    console.log(this.topdomains);
    compareHostWithTopDomains(hostName, domainObject.topdomains);
  })
  .then(result => {
    // Do things with result
    domainHasPunycode(hostName);
    console.log("YES");
  });
});


/*
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
*/
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

