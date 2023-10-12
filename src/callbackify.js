function callbackify(fn) {
    return function () {
        const args = Array.prototype.slice.call(arguments);
        const len = args.length;
        const callback = args[len - 1];

        if (typeof callback !== 'function') {
            const result = fn.apply(null, args);

            return Promise.resolve(result);
        }
        let rest = args.slice(0, len - 1);
        const result = fn.apply(null, rest);

        callback(result);
    };
}

// function test(a) {
//     console.log(a);
//     return 1 + a;
// }

// let testCPify = cpify(test);

// testCPify(2, function (res) {
//     console.log(res);
// });
