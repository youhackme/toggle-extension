var headersCache = {};
var data = {};
var result = {};
var rawData = {};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-106621395-1']);
_gaq.push(['_trackPageview']);

function parseUrl (url) {

  return encodeURIComponent(url);

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
        headersCache[url].status = request.statusCode;
      });

    }

  }
}, {urls: ['http://*/*', 'https://*/*'], types: ['main_frame']}, ['responseHeaders']);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  switch (request.id) {
    case 'soft_analyse_app':
      console.log('Soft analyzing..');
      var url = parseUrl(sender.tab.url);

      rawData[url] = {
        html: request.subject.data.html,
        environment: request.subject.data.environment,
        headers: headersCache[url],
        url: url,
        status: headersCache[url].status
      };

      if (headersCache[url].status == '200' || headersCache[url].status == '304') {
        // Are you already present in data store?
        if (typeof result[url] == 'undefined') {
          console.log('saving in datastore');

          $.post(DOMAIN_NAME + '/scanv2', rawData[url])
            .done(function (data) {
              result[url] = data;
            });

        } else {
          console.log('Already present in datastore');
        }
      } else {
        console.log('HTTP status is not 200 or 304. It is ' + headersCache[url].status);
      }

      break;
    case 'fetch_technologies':
      var url = parseUrl(request.tab.url);
      sendResponse({data: result[url]});
      break;
    case 'hard_analyse_app':
      console.log('hard analysing..');
      var url = parseUrl(request.tab.url);
      // This means user triggered plugin before soft analysis was completed
      var data = {url: url};

      //Well soft analysis did triggered! yaay!
      if (typeof rawData[url] !== 'undefined') {
        data = rawData[url];
      }

      $.post(DOMAIN_NAME + '/scanv2', data)
        .done(function (data) {
          result[url] = data;
          sendResponse({data: data});
        });

      // SendResponse is now asynchronous
      return true;
      break;

  }
});
