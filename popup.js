let hostName = document.getElementById("domain");
this.topdomains = [];

const testCert = {"isvalidCertificate":false,"message":"domain and certificate are different","expiry":"2030-05-31","daysLeft":3105,"issuer":"testexample","certDetails":{"name":"\/C=US\/ST=California\/L=test\/O=testexample\/OU=testexample\/CN=testexp","subject":{"C":"US","ST":"California","L":"test","O":"testexample","OU":"testexample","CN":"testexp"},"hash":"eedfd45a","issuer":{"C":"US","ST":"California","L":"test","O":"testexample","OU":"testexample","CN":"testexp"},"version":2,"serialNumber":"0x42F781AB6E8C5F9E1588CD7860EB4F820573ECDF","serialNumberHex":"42F781AB6E8C5F9E1588CD7860EB4F820573ECDF","validFrom":"200602054149Z","validTo":"300531054149Z","validFrom_time_t":1591076509,"validTo_time_t":1906436509,"signatureTypeSN":"RSA-SHA256","signatureTypeLN":"sha256WithRSAEncryption","signatureTypeNID":668,"purposes":{"1":[true,true,"sslclient"],"2":[true,true,"sslserver"],"3":[true,true,"nssslserver"],"4":[true,true,"smimesign"],"5":[true,true,"smimeencrypt"],"6":[true,true,"crlsign"],"7":[true,true,"any"],"8":[true,true,"ocsphelper"],"9":[false,true,"timestampsign"]},"extensions":{"subjectKeyIdentifier":"D8:FC:C5:55:93:E0:87:A3:9A:83:5B:E0:08:BE:95:2E:40:F7:4A:F2","authorityKeyIdentifier":"keyid:D8:FC:C5:55:93:E0:87:A3:9A:83:5B:E0:08:BE:95:2E:40:F7:4A:F2\n","basicConstraints":"CA:TRUE"},"validLeft":3105},"error":false};
const testLocation = {"continent":"North America","country":"United States","zipCode":null,"accuracyRadius":1000,"flag":"https://ipworld.info/static/flags/us.png","city":null,"timezone":"America/Chicago","latitude":37.751,"countryGeoNameId":6252001,"gmt":"(GMT-10:00) Hawaii Time","network":"151.101.0.0/16","currencyName":"US Dollar","countryNativeName":"United States","stateGeoNameId":null,"phoneCode":"+1","state":null,"continentCode":"NA","longitude":-97.822,"currencyNamePlural":"US dollars","cityGeoNameId":null,"languages":"en","numOfCities":19562,"org":"FASTLY","ip":"patriots.com","currencySymbol":"$","currencySymbolNative":"$","isEU":"No","countryTLD":".us","countryCapital":"Washington","metroCode":null,"continentGeoNameId":6255149,"stateCode":null,"countryISO2":"US","numOfStates":66,"countryISO3":"USA","currencyCode":"USD","asNo":54113,"status":200}

document.addEventListener("click", function(e) {
  if (e.target.id === "closeButton") {
    window.close();
  }
});

getHostName = (tabs) => {
  const activeTab = tabs[0];
  const url = activeTab.url;
  const urlStart = url.indexOf("://")+3;

  let host = "";
  let hostArray = [];
  
  for (i = urlStart; i < url.length; i++) {
    if (url.charAt(i) != '/') {
      host = host + "" + url.charAt(i);
    } else {
      break;
    }
  }

  hostArray = host.split(".");
  
  if (hostArray.length === 3) {
    // has prefix
    host = `${hostArray[1]}.${hostArray[2]}`
  }

  return host;
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
  let decodedHost = '';
  
 // specialChars.innerHTML = decodedHost;
  if (hostName.match(/^xn--/)) {
    hasPunycode = true;
    punyCode.innerHTML = 'Has Punycode';
    punyCodeGrade.classList.add("alert");
    decodedHost = punycode.toUnicode(hostName);

    specialChars.innerHTML = `${decodedHost} (<span class="alert">${isDomainAscii(decodedHost)}</span>)`;
    specialCharsGrade.classList.add("alert");
  } else {
    punyCode.innerHTML = 'No';
  }

  return hasPunycode;
}

compareHostWithTopDomains = (hostName, domains) => {
  let levenshteinDistance = 0;
  let safe = true;
  const hostNameNoCom = hostName.split(".");
  let myArray = [];


  domains.forEach(element => {
    myArray = element.split(".");

    levenshteinDistance = getLevenshteinDistance(myArray[0], hostNameNoCom[0]);

    if (levenshteinDistance > 0 && levenshteinDistance < 3) {
      const warning = `${hostName} is like ${element}`; 
      similar.innerHTML = warning;
      similarGrade.classList.add("warning");
      safe = false;
      return;
    }
    if (levenshteinDistance === 0) {
      const message = 'Top 1000 popular domain &#128079;';
      similar.innerHTML = message;
      return;
    } 
    
  });
}

isDomainAscii = (hostName) => {
  let unicodeCharacters = [];
  for(var i=0;i<hostName.length;i++){
    if(hostName.charCodeAt(i)>127){
      unicodeCharacters.push(`&#${hostName.charCodeAt(i)}`);
    }
  }
  return unicodeCharacters.join();
}

getDomainLocation = (hostName) => {
  const test = false;
  if (test) {
    const location = testLocation.country;
    const networkAddress = testLocation.network;
    const availableLanguages = testLocation.languages;
    country.innerHTML = location;
    networkAddr.innerHTML = networkAddress;
    languages.innerHTML = availableLanguages;

  } else {

    fetch(`https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation?ip=${hostname}&apikey=873dbe322aea47f89dcf729dcc8f60e8`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com",
        "x-rapidapi-key": "7d697db50emshc47e26981d29824p113f47jsnd89673103d4f"
      }
    })
    .then(response => response.body)
    .then(rb => {
      const reader = rb.getReader();

      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then( ({done, value}) => {
              // If there is no more data to read
              if (done) {
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
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
      const DNSData = JSON.parse(result);
      const location = `<div>${DNSData.country}</div><div><img class="flag" src="${DNSData.flag}"></div>`;
      const networkAddress = DNSData.network;
      const availableLanguages = DNSData.languages;
      country.innerHTML = location;
      networkAddr.innerHTML = networkAddress;
      languages.innerHTML = availableLanguages;
    });
  }
}

getCertificateTest = () => {
  const certIssuer = testCert.issuer ? testCert.issuer : 'Unknown';
  const certValid = testCert.isvalidCertificate ? 'Yes': 'No';
  const certMessage = testCert.message ? testCert.message : 'N/A';
  certificateIssuer.innerHTML = certIssuer;
  certificateValid.innerHTML = certValid;
  certificateMessage.innerHTML = certMessage;
  if (certMessage === "domain and certificate are different") {
    certificateMessageGrade.classList.add("warning");
  }

  if (certValid === "No") {
    certificateValidGrade.classList.add("alert");
  }
}

getDomainCertificate = (hostName) => {
  const test = true;
  if (test) {
    getCertificateTest();
  } else {
    const certIssuer = 'Unknown';
    const certValid =  'Yes';
    const certMessage = 'N/A';

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
      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then( ({done, value}) => {
              // If there is no more data to read
              if (done) {
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
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
      const certificate = JSON.parse(result);
      const certIssuer = certificate.issuer ? certificate.issuer : 'Unknown';
      const certValid = certificate.isvalidCertificate ? 'Yes': 'No';
      const certMessage = certificate.message ? certificate.message : 'N/A';
      certificateIssuer.innerHTML = certIssuer;
      certificateValid.innerHTML = certValid;
      certificateMessage.innerHTML = certMessage;

      if (certMessage === "domain and certificate are different") {
        certificateMessageGrade.classList.add("warning");
      }

      if (certValid === "No") {
        certificateValidGrade.classList.add("alert");
      }
    });
  }
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  const hostName = getHostName(tabs).replace("www.", "");
  domain.innerHTML = hostName;
  const result = getTopDomains();
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
            
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            // Check chunks by logging to the console
           
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
    this.topdomains = domainObject.topdomains;
    compareHostWithTopDomains(hostName, domainObject.topdomains);
  })
  .then(result => {
    // Do things with result
    domainHasPunycode(hostName);
  })
  .then(() => {
    // Do things with result
    getDomainCertificate(hostName);
  })
  .then(() => {
    // Do things with result
    getDomainLocation(hostName);
  });
});