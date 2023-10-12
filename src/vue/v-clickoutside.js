const clickoutside = {
    bind: function (el, binding) {
        el.$handler = function (e) {
            el.contains(e.target) && binding.value();
        };

        document.addEventListener('click', el.$handler, false);
    },
    unbind: function (el) {
        document.addEventListener('click', el.$handler, false);
    },
};
