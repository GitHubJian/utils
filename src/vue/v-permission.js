function checkPermission(pid) {
    return new Promise(res => {
        setTimeout(() => {
            res(true);
        }, 1000);
    });
}

const showStyles = {
    visibility: 'visible',
};

const hideStyles = {
    visibility: 'hidden',
};

function setStyles(el, styles) {
    for (let key in styles) {
        if (Object.hasOwnProperty.call(styles, key)) {
            el.style[key] = styles[key];
        }
    }
}

const permission = {
    bind: function (el, binding) {
        let pid = binding.pid;

        if (pid) {
            checkPermission(pid).then(res => {
                if (res) {
                    setStyles(el, showStyles);
                } else {
                    setStyles(el, hideStyles);
                }
            });
        }
    },
};
