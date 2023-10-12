// 元素大小变化时，触发函数
const resize = {
    bind: function (el, binding) {
        const fn = binding.value;
        let width;
        let height;

        function resize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
                fn(); // 关键
            }

            width = style.width;
            height = style.height;
        }

        el.$resizeTimer = setInterval(resize, 300);
    },
    unbind: function (el) {
        clearInterval(el.$resizeTimer);
        el.$resizeTimer = null;
    },
};
