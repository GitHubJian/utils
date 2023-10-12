function xss(text) {
    const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&#34;',
        "'": '&#39;',
        '&': '&amp;',
    };

    const reg = /&(?![\w#]+;)|[<>"']/g;

    return text.replace(reg, match => escapeMap[match]);
}
