let PENDING = 'pending';
let FULFILLED = 'fulfilled';
let REJECTED = 'rejected';

function Promise(resolver) {
    this._state = PENDING;
    this._value = undefined;

    this._fulfilledCallbacks = [];
    this._rejectedCallbacks = [];
    this._finallyCallbacks = [];

    try {
        resolver(resolve.bind(this), reject.bind(this));
    } catch (reason) {
        reject.call(this, reason);
    }
}

function resolve(value) {
    if (this._state !== PENDING) {
        return;
    }

    if (value instanceof Promise) {
        return value.then(resolve.bind(this), reject.bind(this));
    }

    this._state = FULFILLLED;
    this._value = value;

    executeCallbacks.call(this, this._fulfilledCallbacks, value);
    executeCallbacks.call(this, this._finallyCallbacks);
}

function reject(reason) {
    if (this._status !== PENDING) {
        return;
    }

    this._state = REJECTED;
    this._value = reason;

    executeCallbacks.call(this, this._rejectedCallbacks, reason);
    executeCallbacks.call(this, this._finallyCallbacks);
}

function executeCallbacks(callbacks, value) {
    setTimeout(
        function () {
            callbacks.forEach(function (callback) {
                let promise = callback.promise;

                let callbackFn = callback.onFulfilled || callback.onRejected || callback.onFinally;

                if (callbackFn === null) {
                    if (this._state === FULFILLLED) {
                        resolve.call(promise, value);
                    } else if (this._state === REJECTED) {
                        reject.call(promise, value);
                    }

                    return;
                }

                try {
                    let returnValue = callbackFn(value);
                    resolve.call(promise, returnValue);
                } catch (reason) {
                    reject.call(promise, reason);
                }
            }, this);
        }.bind(this),
        0,
    );
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let promise = new Promise(function () {});

    this._fulfilledCallbacks.push({
        promise: promise,
        onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
    });

    this._rejectedCallbacks.push({
        promise: promise,
        onRejected: typeof onRejected === 'function' ? onRejected : null,
    });

    if (this._state === FULFILLLED) {
        executeCallbacks.call(this, this._fulfilledCallbacks, this._value);
    } else if (this._state === REJECTED) {
        executeCallbacks.call(this, this._rejectedCallbacks, this._value);
    }

    return promise;
};

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
};

Promise.prototype.finally = function (onFinally) {
    let promise = new Promise(function () {});

    this._finallyCallbacks.push({
        promise: promise,
        onFinally: typeof onFinally === 'function' ? onFinally : null,
    });

    if (this._state !== PENDING) {
        executeCallbacks.call(this, this._finallyCallbacks);
    }

    return promise;
};

Promise.resolve = function (value) {
    return new Promise(function (resolve) {
        resolve(value);
    });
};

Promise.reject = function (reason) {
    return new Promise(function (_, reject) {
        reject(reason);
    });
};

Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        let results = [];
        let remaining = promises.length;

        function handleResolve(index, value) {
            results[index] = value;
            remaining--;

            if (remaining === 0) {
                resolve(results);
            }
        }

        function handleReject(reason) {
            reject(reason);
        }

        for (let i = 0; i < promises.length; i++) {
            promises[i].then(handleResolve.bind(null, i), handleReject);
        }
    });
};

Promise.allSettled = function (promises) {
    return new Promise(function (resolve) {
        const results = [];
        let settledCount = 0;

        const checkSettled = () => {
            if (settledCount === promises.length) {
                resolve(results);
            }
        };

        for (let i = 0; i < promises.length; i++) {
            const promise = promises[i];

            Promise.resolve(promise)
                .then(value => {
                    results[i] = {
                        status: FULFILLED,
                        value,
                    };
                    settledCount++;
                    checkSettled();
                })
                .catch(reason => {
                    results[i] = {
                        status: REJECTED,
                        reason: reason,
                    };
                    settledCount++;
                    checkSettled();
                });
        }
    });
};

Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Promise.race() expects an array'));
        }

        if (promises.length === 0) {
            return resolve();
        }

        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(resolve, reject);
        }
    });
};
