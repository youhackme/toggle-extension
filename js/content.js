/**
 * Created by Hyder on 10/09/2017.
 */


// Get environment variable
var environmentVars = '';

for (i in window) {
  environmentVars += i + ' ';
}

// Get Page html
var html = document.documentElement.outerHTML;

var data = {
  html: html,
  environment: environmentVars,
  headers: ''
};

chrome.runtime.sendMessage({id: 'soft_analyse_app', subject: data});