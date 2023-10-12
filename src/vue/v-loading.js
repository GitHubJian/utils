const loading = {
    bind: function (el, binding) {
        if (binding.value) {
            el.style.visibility = 'visible';
        } else {
            el.style.visibility = 'hidden';
        }
    },
    update: function (el, binding) {
        if (binding.value) {
            el.style.visibility = 'visible';
        } else {
            el.style.visibility = 'hidden';
        }
    },
};
