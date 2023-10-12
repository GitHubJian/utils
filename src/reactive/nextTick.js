const callbacks = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

let timerFunc;

if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
    };
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

function nextTick(cb, ctx) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                console.log('Error in nextTick', e);
            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });

    if (!pending) {
        pending = true;
        timerFunc();
    }

    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
}
exports.nextTick = nextTick;
