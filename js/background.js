var headersCache = {};
var data = {};
var result = {};
var rawData = {};

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

    var url = parseUrl(request.url);

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

  switch (request.id) {
    case 'soft_analyse_app':
      console.log('Soft analyzing..');
      var url = parseUrl(sender.tab.url);
      url = url.canonical;

      rawData[url] = {
        html: request.subject.data.html,
        environment: request.subject.data.environment,
        headers: headersCache[url],
        url: url
      };

      // Are you already present in data store?

      if (typeof result[url] == 'undefined') {
        console.log('saving in datastore');

        $.post('http://toggle.app/scan', rawData[url])
          .done(function (data) {
            result[url] = data;
          });

      } else {
        console.log('Already present in datastore');
      }

      break;
    case 'fetch_technologies':
      var url = parseUrl(request.tab.url);
      url = url.canonical;
      sendResponse({data: result[url]});
      break;
    case 'hard_analyse_app':
      console.log('hard analysing..');
      var url = parseUrl(request.tab.url);
      url = url.canonical;

      // This means user triggered plugin before soft analysis was completed
      var data = {url: url};

      //Well soft analysis did triggered! yaay!
      if (typeof rawData[url] !== 'undefined') {
        data = rawData[url];
      }

      $.post('http://toggle.app/scan', data)
        .done(function (data) {
          result[url] = data;
          sendResponse({data: data});
        });

      // SendResponse is now asynchronous
      return true;
      break;

  }
});
