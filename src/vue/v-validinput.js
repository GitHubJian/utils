function trigger(el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}

const emoji = {
    bind: function (el) {
        let re = /[a-zA-Z0-9]/;

        el.$handler = function () {
            let val = el.value;
            el.value = val.replace(re, '');

            trigger(el, 'input');
        };

        el.addEventListener('keyup', el.$handler);
    },
    unbind: function (el) {
        el.removeEventListener('keyup', el.handler);
    },
};
