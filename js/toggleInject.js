(function () {

  var nativeWindowObjects = [
    'stop', 'open', 'alert', 'confirm', 'prompt', 'print', 'requestAnimationFrame', 'cancelAnimationFrame',
    'requestIdleCallback', 'cancelIdleCallback', 'captureEvents', 'releaseEvents', 'getComputedStyle', 'matchMedia',
    'moveTo', 'moveBy', 'resizeTo', 'resizeBy', 'getSelection', 'find', 'getMatchedCSSRules',
    'webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', 'btoa', 'atob', 'setTimeout',
    'clearTimeout', 'setInterval', 'clearInterval', 'createImageBitmap', 'scroll', 'scrollTo', 'postMessage',
    'blur', 'scrollBy', 'focus', 'close', 'fetch', 'webkitRequestFileSystem', 'webkitResolveLocalFileSystemURL',
    'openDatabase', 'chrome', 'environmentVars', 'frames', 'self', 'window', 'parent', 'opener', 'top', 'length',
    'closed', 'location', 'document', 'origin', 'name', 'history', 'locationbar', 'menubar', 'personalbar', 'scrollbars',
    'statusbar', 'toolbar', 'status', 'frameElement', 'navigator', 'applicationCache', 'external', 'screen', 'innerWidth',
    'innerHeight', 'scrollX', 'pageXOffset', 'scrollY', 'pageYOffset', 'screenX', 'screenY', 'outerWidth', 'outerHeight',
    'devicePixelRatio', 'clientInformation', 'screenLeft', 'screenTop', 'defaultStatus', 'defaultstatus', 'styleMedia',
    'onanimationend', 'onanimationiteration', 'onanimationstart', 'onsearch', 'ontransitionend', 'onwebkitanimationend',
    'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkittransitionend', 'onwheel', 'isSecureContext',
    'onabort', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu',
    'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop',
    'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress',
    'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave',
    'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying',
    'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow',
    'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onbeforeunload',
    'onhashchange', 'onlanguagechange', 'onmessage', 'onmessageerror', 'onoffline', 'ononline', 'onpagehide',
    'onpageshow', 'onpopstate', 'onrejectionhandled', 'onstorage', 'onunhandledrejection', 'onunload', 'performance',
    'onauxclick', 'customElements', 'ongotpointercapture', 'onlostpointercapture', 'onpointercancel', 'onpointerdown',
    'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'crypto',
    'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'indexedDB', 'webkitStorageInfo',
    'sessionStorage', 'localStorage', 'caches', 'speechSynthesis', 'TEMPORARY', 'PERSISTENT', 'addEventListener',
    'removeEventListener', 'dispatchEvent'];

  try {
    var i, environmentVars = '', e = document.createEvent('Events');

    e.initEvent('toggleEvent', true, false);

    for (i in window) {

      if (!nativeWindowObjects.includes(i)) {
        environmentVars += i + ' ';
      }

    }

    document.getElementById('toggleData').appendChild(document.createComment(environmentVars));
    document.getElementById('toggleData').dispatchEvent(e);
  } catch (e) {
    // Fail quietly
  }
}());