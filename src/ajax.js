// var class2type = {};
// var toString = class2type.toString;

// var types = [
//     'Boolean',
//     'Number',
//     'String',
//     'Function',
//     'Array',
//     'Date',
//     'RegExp',
//     'Object',
//     'Error',
// ];

// for (var i = 0; i < types.length; i++) {
//     var name = types[i];
//     class2type['[object ' + name + ']'] = name.toLowerCase();
// }

// function type(obj) {
//     return obj == null
//         ? String(obj)
//         : class2type[toString.call(obj)] || 'object';
// }

// function isFunction(fn) {
//     return type(fn) === 'function';
// }

let jsonpID = +new Date();
let document = window.document;
let key;
let name;
let rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
let scriptTypeRE = /^(?:text|application)\/javascript/i;
let xmlTypeRE = /^(?:text|application)\/xml/i;
let jsonType = 'application/json';
let htmlType = 'text/html';
let blankRE = /^\s*$/;
let originAnchor = document.createElement('a');

originAnchor.href = window.location.href;

function ajaxBeforeSend(xhr, settings) {
    let context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false) {
        return false;
    }
}

function ajaxSuccess(data, xhr, settings) {
    let context = settings.context;
    let status = 'success';
    settings.success.call(context, data, status, xhr);

    ajaxComplete(status, xhr, settings);
}

function ajaxError(error, type, xhr, settings) {
    let context = settings.context;
    settings.error.call(context, xhr, type, error);

    ajaxComplete(type, xhr, settings);
}

function ajaxComplete(status, xhr, settings) {
    let context = settings.context;
    settings.complete.call(context, xhr, status);

    ajaxStop(settings);
}

function ajaxDataFilter(data, type, settings) {
    if (settings.dataFilter == empty) {
        return data;
    }
    let context = settings.context;

    return settings.dataFilter.call(context, data, type);
}

function empty() {}

function ajaxJSOP(options) {
    let _callbackName = options.jsonpCallback;
    let callbackName = (isFunction(_callbackName) ? _callbackName() : _callbackName) || '_ajax_' + jsonpID++;
    let script = document.createElement('script');
    let originalCallback = window[callbackName];
    let responseData;
    let abort = function (errorType) {
        loaderOrErrorHandler(errorType || 'abort');
    };
    let xhr = {
        abort: abort,
    };
    let abortTimeout;

    function loaderOrErrorHandler(e, errorType) {
        clearTimeout(abortTimeout);
        script.onload = script.onerror = null;
        script.parentNode.removeChild(script);

        if (e.type == 'error' || !responseData) {
            ajaxError(null, errorType || 'error', xhr, options);
        } else {
            ajaxSuccess(responseData[0], xhr, options);
        }

        window[callbackName] = originalCallback;

        if (responseData && isFunction(originalCallback)) {
            originalCallback(responseData[0]);
        }
        originalCallback = responseData = undefined;
    }

    if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort');
        return xhr;
    }

    window[callbackName] = function () {
        responseData = arguments;
    };

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
    document.head.appendChild(script);

    if (options.timeout > 0) {
        abortTimeout = setTimeout(function () {
            abort('timeout');
        }, options.timeout);
    }

    return xhr;
}

let ajaxSettings = {
    type: 'GET',
    beforeSend: empty,
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    xhr: function () {
        return new window.XMLHttpRequest();
    },
    accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: jsonType,
        xml: 'application/xml, text/xml',
        html: htmlType,
        text: 'text/plain',
    },
    crossDomain: false,
    timeout: 0,
    processData: true,
    cache: true,
    dataFilter: empty,
};

function mimeToDataType(mime) {
    if (mime) {
        mime = mime.split(';', 2)[0];
    }

    if (mime) {
        if (mime == htmlType) {
            return 'html';
        } else if (mime == jsonType) {
            return 'json';
        } else if (scriptTypeRE.test(mime)) {
            return 'script';
        } else if (xmlTypeRE.test(mime)) {
            return 'xml';
        }
    }

    return 'text';
}

function appendQuery(url, query) {
    if (query == '') {
        return url;
    }

    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

function serialize(params, obj) {
    for (let name in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, name)) {
            params.add(name, obj[name]);
        }
    }
}

function param(obj) {
    let params = [];
    params.add = function (key, value) {
        this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
}

function serializeData(options) {
    if (options.processData && options.data && type(options.data) != 'string') {
        options.data = param(options.data);
    }

    if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
        options.url = appendQuery(options.url, options.data);
        options.data = undefined;
    }
}

function ajax(options) {
    let settings = Object.assign({}, options || {});
    let urlAnchor;
    let hashIndex;

    for (key in ajaxSettings) {
        if (settings[key] === undefined) {
            settings[key] = ajaxSettings[key];
        }
    }

    if (!settings.crossDomain) {
        urlAnchor = document.createElement('a');
        urlAnchor.href = settings.url;
        urlAnchor.href = urlAnchor.href;
        settings.crossDomain =
            originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
    }

    if (!settings.url) {
        settings.url = window.location.toString();
    }

    if ((hashIndex = settings.url.indexOf('#')) > -1) {
        settings.url = settings.url.slice(0, hashIndex);
    }

    serializeData(settings);

    let dataType = settings.dataType;
    let hasPlaceholder = /\?.+=\?/.test(settings.url);

    if (hasPlaceholder) {
        dataType = 'jsonp';
    }

    if (
        settings.cache === false ||
        ((!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType))
    ) {
        settings.url = appendQuery(settings.url, '_=' + new Date().getTime());
    }

    if ('jsonp' == dataType) {
        if (!hasPlaceholder) {
            settings.url = appendQuery(
                settings.url,
                settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?',
            );
        }

        return ajaxJSONP(settings);
    }

    let mime = settings.accepts[dataType];
    let headers = {};
    let setHeader = function (name, value) {
        headers[name.toLowerCase()] = [name, value];
    };
    let protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
    let xhr = settings.xhr();
    let nativeSetHeader = xhr.setRequestHeader;
    let abortTimeout;

    if (!settings.crossDomain) {
        setHeader('X-Requested-With', 'XMLHttpRequest');
    }

    setHeader('Accept', mime || '*/*');

    if ((mime = settings.mimeType || mime)) {
        if (mime.indexOf(',') > -1) {
            mime = mime.split(',', 2)[0];
        }

        xhr.overrideMimeType && xhr.overrideMimeType(mime);
    }

    if (
        settings.contentType ||
        (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')
    ) {
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
    }

    if (settings.headers) {
        for (name in settings.headers) {
            setHeader(name, settings.headers[name]);
        }
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty;
            clearTimeout(abortTimeout);

            let result;
            let error = false;

            if (
                (xhr.status >= 200 && xhr.status < 300) ||
                xhr.status == 304 ||
                (xhr.status == 0 && protocol == 'file:')
            ) {
                dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));

                if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') {
                    result = xhr.response;
                } else {
                    result = xhr.responseText;

                    try {
                        result = ajaxDataFilter(result, dataType, settings);
                        if (dataType == 'script') {
                            (1, eval)(result);
                        } else if (dataType == 'xml') {
                            result = xhr.responseXML;
                        } else if (dataType == 'json') {
                            result = blankRE.test(result) ? null : window.JSON.parse(result);
                        }
                    } catch (e) {
                        error = e;
                    }

                    if (error) {
                        return ajaxError(error, 'parsererror', xhr, settings);
                    }
                }

                ajaxSuccess(result, xhr, settings);
            } else {
                ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
            }
        }
    };

    if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort();
        ajaxError(null, 'abort', xhr, settings);

        return xhr;
    }

    if (settings.xhrFields) {
        for (name in settings.xhrFields) {
            xhr[name] = settings.xhrFields[name];
        }
    }

    let async = 'async' in settings ? settings.async : true;
    xhr.open(settings.type, settings.url, async, settings.username, settings.password);

    for (name in headers) {
        nativeSetHeader.apply(xhr, headers[name]);
    }

    if (settings.timeout > 0) {
        abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty;
            xhr.abort();
            ajaxError(null, 'timeout', xhr, settings);
        }, settings.timeout);
    }

    xhr.send(settings.data ? settings.data : null);

    return xhr;
}
