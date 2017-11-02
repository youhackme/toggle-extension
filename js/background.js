var headersCache = {};
var data = {};
var result = {};
var rawData = {};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-106621395-1']);
_gaq.push(['_trackPageview']);

var toggle = {

  log: function (data) {
    if (DEBUG) {
      console.log(data);
    }
  }

};

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
      toggle.log('Soft analyzing..');
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
          toggle.log('Saving ' + url + ' in datastore');
          result[url] = {};
          result[url].status = 'pending';
          $.post(DOMAIN_NAME + '/scanv2', rawData[url])
            .done(function (data) {
              result[url].data = data;
              result[url].status = 'sucess';
            });

        } else {
          toggle.log(url + ' Already present in datastore');
        }
      } else {
        toggle.log('HTTP status is not 200 or 304. It is ' + headersCache[url].status);
      }

      break;
    case 'fetch_technologies':
      var url = parseUrl(request.tab.url);
      if (typeof result[url] === 'undefined') {
        result[url] = {};
      }

      sendResponse({data: result[url].data});
      break;
    case 'hard_analyse_app':
      toggle.log('hard analysing..');
      var url = parseUrl(request.tab.url);
      // This means user triggered plugin before soft analysis was completed
      var data = {url: url};

      //Well soft analysis did triggered! yaay!
      // if (typeof rawData[url] !== 'undefined') {
      //   data = rawData[url];
      // }
      // Not sure why the above code is present.
      toggle.log('Current status of soft analysis before hard analysis');

      var totalCycles = 0;
      var analysisStatus = setInterval(checkIfSoftAnalysisCompleted, 1000);

    function checkIfSoftAnalysisCompleted () {
      totalCycles++;
      toggle.log(result[url].status);
      if (totalCycles > 15 || typeof result[url].status == 'undefined') {
        toggle.log('Well, result was not obtained within 7 seconds, we are going to fetch it ourselves.');
        clearInterval(analysisStatus);
        // Well, hard analysis is taking too much time,
        // Let's do a manual run instead
        $.post(DOMAIN_NAME + '/scanv2', data)
          .done(function (data) {
            result[url].data = data;
            sendResponse({data: data});
          });

      } else {
        if (result[url].status == 'sucess') {
          clearInterval(analysisStatus);
          toggle.log('Horray! No need to trigger another call to server now!');
          sendResponse({data: result[url].data});
        }
      }

    }

      // SendResponse is now asynchronous
      return true;
      break;

  }

  toggle.log(result);
});