/**
 * Http Request
 *
 * @typedef {Object} options
 * @property {string} url 请求的 URL
 * @property {string} method 请求的 方法
 * @property {object} data 请求数据
 * @property {string} dataType 返回数据类型
 *
 * @returns {Promise<Response>}
 */

export default function httpRequest(options) {
    const {url, method, data, dataType} = options;

    return fetch(url, {
        body: data,
        method: method,
    }).then(function (httpResponse) {
        const httpStatusCode = httpResponse.status;

        if (httpStatusCode.startsWith('4', 0) || httpStatusCode.startsWith('5', 0)) {
            return Promise.reject(httpResponse);
        }

        if (dataType === 'JSON') {
            return httpResponse.json();
        } else if (dataType === 'BLOB') {
            return httpResponse.blob();
        } else if (dataType === 'FORM-DATA') {
            return httpResponse.formData();
        } else if (dataType === 'TEXT') {
            return httpResponse.text();
        } else if (dataType === 'ARRAY-BUFFER') {
            return httpResponse.arrayBuffer();
        }
        return httpResponse;
    });
}
