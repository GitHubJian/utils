const debounce = {
    inserted: function (el, binding) {
        let timer;

        el.$handler = function () {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                binding.value();
            }, 1000);
        };

        el.addEventListener('keyup', el.$handler);
    },
    unbind: function (el) {
        el.removeEventListener('keyup', el.$handler);
    },
};
