var headersCache = {};
var data = {};
var result = {};

function parseUrl (url) {
  var a = document.createElement('a');

  a.href = url;

  a.canonical = a.protocol + '//' + a.host + a.pathname;

  return a;
}

// Capture response headers
chrome.webRequest.onCompleted.addListener(function (request) {

  var responseHeaders = {};

  if (request.responseHeaders) {
    var url = request.url;

    request.responseHeaders.forEach(function (header) {
      responseHeaders[header.name.toLowerCase()] = header.value || '' + header.binaryValue;
    });

    if (headersCache.length > 50) {
      headersCache = {};
    }

    if (/text\/html/.test(responseHeaders['content-type'])) {
      if (headersCache[url] === undefined) {
        headersCache[url] = {};
      }

      Object.keys(responseHeaders).forEach(function (header) {
        headersCache[url][header] = responseHeaders[header];
      });

    }

  }
}, {urls: ['http://*/*', 'https://*/*'], types: ['main_frame']}, ['responseHeaders']);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(request, sender);

  if (request.id == 'analyse_app') {
    var url = parseUrl(sender.tab.url);
    url = url.canonical;

    $.ajax({
      url: 'https://alpha.toggle.me/scan?url=' + url
    }).done(function (data) {

      result[url] = data;

    });

  } else if (request.id === 'test') {
    var url = parseUrl(request.tab.url);
    url = url.canonical;

    sendResponse({data: result[url]});
  }

});
