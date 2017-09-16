/**
 * Created by Hyder on 10/09/2017.
 */

/** global: chrome */


var html = document.documentElement.outerHTML;
// Get environment variable
var environmentVars = '';

try {

  var container = document.createElement('toggleData');

  container.setAttribute('id', 'toggleData');
  container.setAttribute('style', 'display: none');

  var script = document.createElement('script');

  script.setAttribute('id', 'toggleEnvDetection');
  script.setAttribute('src', chrome.extension.getURL('js/toggleInject.js'));

  container.addEventListener('toggleEvent', (event => {
    environmentVars = event.target.childNodes[0].nodeValue;

    document.documentElement.removeChild(container);
    document.documentElement.removeChild(script);

// Get Page html
    var html = document.documentElement.outerHTML;

    var data = {
      html: html,
      environment: environmentVars
    };

    //   chrome.runtime.sendMessage({id: 'soft_analyse_app', subject: data});

    chrome.runtime.sendMessage({
      id: 'soft_analyse_app',
      subject: {data},
      source: 'content.js'
    });
  }), true);

  document.documentElement.appendChild(container);
  document.documentElement.appendChild(script);
} catch (e) {
  log(e);
}





