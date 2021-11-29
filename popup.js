let hostName = document.getElementById("domain");
this.topdomains = [];

const testCert = {"isvalidCertificate":false,"message":"domain and certificate are different","expiry":"2030-05-31","daysLeft":3105,"issuer":"testexample","certDetails":{"name":"\/C=US\/ST=California\/L=test\/O=testexample\/OU=testexample\/CN=testexp","subject":{"C":"US","ST":"California","L":"test","O":"testexample","OU":"testexample","CN":"testexp"},"hash":"eedfd45a","issuer":{"C":"US","ST":"California","L":"test","O":"testexample","OU":"testexample","CN":"testexp"},"version":2,"serialNumber":"0x42F781AB6E8C5F9E1588CD7860EB4F820573ECDF","serialNumberHex":"42F781AB6E8C5F9E1588CD7860EB4F820573ECDF","validFrom":"200602054149Z","validTo":"300531054149Z","validFrom_time_t":1591076509,"validTo_time_t":1906436509,"signatureTypeSN":"RSA-SHA256","signatureTypeLN":"sha256WithRSAEncryption","signatureTypeNID":668,"purposes":{"1":[true,true,"sslclient"],"2":[true,true,"sslserver"],"3":[true,true,"nssslserver"],"4":[true,true,"smimesign"],"5":[true,true,"smimeencrypt"],"6":[true,true,"crlsign"],"7":[true,true,"any"],"8":[true,true,"ocsphelper"],"9":[false,true,"timestampsign"]},"extensions":{"subjectKeyIdentifier":"D8:FC:C5:55:93:E0:87:A3:9A:83:5B:E0:08:BE:95:2E:40:F7:4A:F2","authorityKeyIdentifier":"keyid:D8:FC:C5:55:93:E0:87:A3:9A:83:5B:E0:08:BE:95:2E:40:F7:4A:F2\n","basicConstraints":"CA:TRUE"},"validLeft":3105},"error":false};

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

this.fetchDomains = (res) => {
  result = fetch("./topdomains.json")
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

getDomainCertificate = (hostName) => {
  /*
  const certIssuer = testCert.issuer ? testCert.issuer : 'Unknown';
  const certValid = testCert.isvalidCertificate ? 'Yes': 'No';
  const certMessage = testCert.message ? testCert.message : 'N/A';
  certificateIssuer.innerHTML = certIssuer;
  certificateValid.innerHTML = certValid;
  certificateMessage.innerHTML = certMessage;
  */

  fetch(`https://check-ssl.p.rapidapi.com/sslcheck?domain=${hostName}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "check-ssl.p.rapidapi.com",
      "x-rapidapi-key": "7d697db50emshc47e26981d29824p113f47jsnd89673103d4f"
    }
  })
  .then(response => response.body)
  .then(rb => {
    const reader = rb.getReader()
    console.log(rb);
    console.log(reader);
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
      console.log(result);
      const certificate = JSON.parse(result);
      console.log(certificate);
      const certIssuer = certificate.issuer ? certificate.issuer : 'Unknown';
      const certValid = certificate.isvalidCertificate ? 'Yes': 'No';
      const certMessage = certificate.message ? certificate.message : 'N/A';
      certificateIssuer.innerHTML = certIssuer;
      certificateValid.innerHTML = certValid;
      certificateMessage.innerHTML = certMessage;
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
  })
  .then(() => {
    // Do things with result
    getDomainCertificate(hostName);
  });
});

// like page did mount
var opt_extraInfoSpec = [];
chrome.webRequest.onCompleted.addListener(this.fetchDomains,
  {urls: [   "<all_urls>" ] },
  ["responseHeaders"]
);
