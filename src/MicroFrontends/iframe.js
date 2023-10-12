function patchIframeHistory(iframeWindow, appHostPath, mainHostPath) {
    const history = iframeWindow.history;
    const rawHistoryPushState = history.pushState;
    const rawHistoryReplaceState = history.replaceState;
    history.pushState = function (data, title, url) {
        const baseUrl =
            mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
        const mainUrl = getAbsolutePath(url && url.replace(appHostPath, ''), baseUrl);
        const ignoreFlag = url === undefined;

        rawHistoryPushState.call(history, data, title, ignoreFlag ? undefined : mainUrl);
        if (ignoreFlag) return;

        updateBase(iframeWindow, appHostPath, mainHostPath);
        syncUrlToWindow(iframeWindow);
    };

    history.replaceState = function (data, title, url) {
        const baseUrl =
            mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
        const mainUrl = getAbsolutePath(url && url.replace(appHostPath, ''), baseUrl);
        const ignoreFlag = url === undefined;

        rawHistoryReplaceState.call(history, data, title, ignoreFlag ? undefined : mainUrl);
        if (ignoreFlag) return;

        updateBase(iframeWindow, appHostPath, mainHostPath);
        syncUrlToWindow(iframeWindow);
    };
}

function createIframe(sandbox, attrs, mainHostPath, appHostPath, appRoutePath) {
    const iframe = window.document.createElement('iframe');
    const attrs = {
        src: mainHostPath,
        style: 'display: none',
        ...attrs,
        name: sandbox.id,
    };
    setAttrsToElement(iframe, attrs);
    window.document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    patchIframeVariable(iframeWindow, sandbox, appHostPath);
    sandbox.iframeReady = stopIframeLoading(iframeWindow).then(() => {});
}
