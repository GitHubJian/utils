exports.isConstructable = function (fn) {
    const has
};

function anchorElementGenerator(url) {
    const element = window.document.createElement('a');
    element.href = url;

    return element;
}

function getAnchorElementQueryMap(anchorElement) {
    const queryList = anchorElement.search.replace('?', '').split('&');
    const queryMap = {};
    queryList.forEach(query => {
        const [key, value] = query.split('=');
        if (key && value) {
            queryMap[key] = value;
        }
    });

    return queryMap;
}
