chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

  var url = tabs[0].url;

  if (!url.match(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/igm)) {
    $('.container__wrapper').removeClass('overlay');
    renderStatus('<p class="muted">Not so fast. Please enter a valid URL.</p>');

  } else {
    chrome.runtime.sendMessage({id: 'fetch_technologies', tab: tabs[0]}, function (response) {

      renderStatus('Analyzing ' + tabs[0].url);

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
  }

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