// Node 风格的 promiseify
function promiseify(fn) {
    return function () {
        return new Promise(function (resolve, reject) {
            fn(...args, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}
