function offset(el) {
    let top;
    for (top = el.offsetTop; el.offsetParent; ) {
        el = el.offsetParent;
        if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
            top += el.offsetTop;
        } else {
            top += el.offsetTop + el.clientTop;
        }
    }

    return {
        top: top,
    };
}

function checkInView(el, i) {
    try {
        let innerHeight = window.innerHeight;
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        let clientHeight = el.clientHeight ? el.clientHeight : el.parentNode.clientHeight;
        let top = offset(el).top;

        return (
            (top >= scrollTop && top <= scrollTop + innerHeight) ||
            (top < scrollTop && top + clientHeight > scrollTop && top + clientHeight < scrollTop + innerHeight)
        );
    } catch (e) {
        console.error('ImageLazy Error at [' + i + ']');

        return false;
    }
}

function throttle(func, wait, options) {
    let timeout;
    let context;
    let args;
    let result;
    let previous = 0;
    if (!options) {
        options = {};
    }

    const later = function () {
        previous = options.leading === false ? 0 : +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            content = args = null;
        }
    };

    const throttled = function () {
        const now = +new Date();
        if (!previous && options.leading === false) {
            previous = now;
        }

        const remaining = wait - (now - previous);
        context = this;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }

        return result;
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}

function ImageLazy(selector, placeholder) {
    this.selector = selector || 'image-lazy';
    this.placeholder = placeholder;

    window.addEventListener('scroll', throttle(this.traversal, 100));
}

ImageLazy.prototype.traversal = function () {
    let that = this;

    setTimeout(function () {
        let els = document.querySelector('.' + this.selector);

        for (let i = 0; i < els.length; i++) {
            var el = els[i];

            if (checkInView(el, i)) {
                setTimeout(function () {
                    that._show(el);
                }, 0);
            }
        }
    }, 0);
};

ImageLazy.prototype._show = function (el) {
    let that = this;
    let originSrc = el.getAttribute('data-src');

    el.addEventListener('load', function () {
        el.className = el.className.replace(that.selector);
    });

    el.addEventListener('error', function () {
        el.className = el.className.replace(that.selector);

        el.setAttribute('src', that.placeholder);
    });

    el.setAttribute('src', originSrc);
};

ImageLazy.createInstance = function (selector, placeholder) {
    return new ImageLazy(selector, placeholder);
};
