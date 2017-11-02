chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

  chrome.runtime.sendMessage({id: 'fetch_technologies', tab: tabs[0]}, function (response) {
    renderStatus('Analyzing ' + tabs[0].url + '. Hang tight..');

    if (typeof response.data == 'undefined') {
      $('.container__wrapper').addClass('overlay');
      // Well, result was not cached in our datastore
      // Lets find it on server
      fetchResultFromServer(tabs[0]);

    } else {
      setTimeout(function () {
        $('.container__wrapper')
          .removeClass('overlay')
          .html(response.data);
      }, 1000);

    }
  });

});

function fetchResultFromServer (tabs) {
  chrome.runtime.sendMessage({id: 'hard_analyse_app', tab: tabs}, function (response) {

    if (typeof response.data == 'undefined') {
      renderStatus('We were unable to fetch result. ');
    } else {
      setTimeout(function () {
        $('.container__wrapper').removeClass('overlay')
          .html(response.data);
      }, 1000);

    }
  });
}

function renderStatus (statusText) {

  $('#status').html(statusText);

}

// function getCurrentTabUrl (callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };
//
//   chrome.tabs.query(queryInfo, function (tabs) {
//
//     var tab = tabs[0];
//
//     var url = tab.url;
//
//     callback(url);
//   });
// }

// $(document).ready(function () {
//
//   getCurrentTabUrl(function (url) {
//
//     // Put the image URL in Google search.
//     renderStatus('Analyzing ' + url);
//
//   });
// });


