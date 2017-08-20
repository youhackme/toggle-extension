/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

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

  document.getElementById('status').textContent = statusText;

}

document.addEventListener('DOMContentLoaded', function () {

  getCurrentTabUrl(function (url) {

    // Put the image URL in Google search.
    renderStatus('Analyzing ' + url);

    $.ajax({
      url: 'http://toggle.app/site/http://bridge86.qodeinteractive.com/'
    }).done(function (data) {
      console.log(data.application);
      // Put the image URL in Google search.
      var data = JSON.parse(data);

      var technologiestList = '';

      $.each(data.technologies.applications, function (key, application) {

        technologiestList = technologiestList +'<li> <a class="button" target="_blank" href="' + application.website + '"> <img class="app-icon" src="' + application.icon + '">' + application.name + ' </a> </li>';

      });

      $('ul#technologies').html(technologiestList);

      renderStatus('completed');
    }).always(function () {
      console.log('complete');
    });

  });
});


