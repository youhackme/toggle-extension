/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */


chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

  chrome.runtime.sendMessage({id: 'test', tab: tabs[0]}, function (response) {
    if (typeof response.data == 'undefined') {
      $('.container__wrapper').removeClass('overlay');
      renderStatus('We were unable to find this url in cache. ');
    } else {
      $('.container__wrapper').removeClass('overlay')
        .html(response.data);
    }

  });

});

function getCurrentTabUrl (callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {

    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function renderStatus (statusText) {

  $('#status').html(statusText);

}

$(document).ready(function () {

  getCurrentTabUrl(function (url) {

    // Put the image URL in Google search.
    renderStatus('Analyzing ' + url);

  });
});


