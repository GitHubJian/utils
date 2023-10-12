function createStyle() {
    let style = document.createElement('style');
    style.textContent = `.fullscreen {
        position: fixed; 
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100% !important;
        height: 100% !important;
        z-index: 999999;
    }`;
}

function hasClass(el, classnames) {
    return el.className.match(new RegExp('(\\s|^)' + classnames + '(\\s|$)'));
}

function addClass(el, classnames) {
    if (!hasClass(el, classnames)) {
        el.className += ' ' + classnames;
    }
}

function removeClass(el, classnames) {
    if (hasClass(el, classnames)) {
        let reg = new RegExp('(\\s|^)' + classnames + '(\\s|$)');

        el.className = el.className.replace(reg, ' ');
    }
}

const fullscreen = {
    bind: function (el, binding) {
        if (!Vue.$fullscreen) {
            Vue.$fullscreen = true;
            createStyle();
        }

        el.$fullscreen = false;

        el.$handler = function () {
            if (!el.$fullscreen) {
                el.$fullscreen = true;
                addClass(el, 'fullscreen');
            } else {
                el.$fullscreen = false;
                removeClass(el, 'fullscreen');
            }
        };

        el.addEventListener('click', $el.$handler);
    },
    unbind: function (el) {
        el.removeEventListener('click', $el.$handler);
    },
};
