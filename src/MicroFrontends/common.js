exports.appWindowAddEventListenerEvents = [
    'hashchange',
    'popstate',
    'DOMContentLoaded',
    'load',
    'beforeunload',
    'unload',
    'message',
];

exports.rawElementAppendChild = HTMLElement.prototype.appendChild;
exports.rawWindowAddEventListener = window.addEventListener;
exports.rawWindowRemoveEventListener = window.removeEventListener;
exports.rawDocumentQuerySelector = Document.prototype.querySelector;
