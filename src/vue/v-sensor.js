// 埋点
const sensor = {
    bind: function (el, binding) {
        const value = binding.value;
        const modifiers = binding.modifiers;

        el.addEventListener('click', function () {});
    },
};
