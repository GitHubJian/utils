const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value => (value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2);

const backtop = {
    bind: function (el, binding) {
        const {visibilityHeight} = binding.value;
        const container = document;
        const elm = document.documentElement;

        el.$handler = () => {
            const beginTime = Date.now();
            const beginValue = elm.scrollTop;
            const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
            const frameFunc = () => {
                const progress = (Date.now() - beginTime) / 500;
                if (progress < 1) {
                    elm.scrollTop = beginValue * (1 - easeInOutCubic(progress));
                    rAF(frameFunc);
                } else {
                    elm.scrollTop = 0;
                }
            };

            rAF(frameFunc);
        };

        el.addEventListener('click', el.$handler);

        el.$container = container;
        el.$elm = elm;
        el.$scrollHandler = function () {
            const scrollTop = elm.scrollTop;

            if (scrollTop > visibilityHeight) {
                el.style.visibility = 'unset';
            } else {
                el.style.visibility = 'hidden';
            }
        };
        container.addEventListener('scroll', el.$scrollHandler);
        el.$scrollHandler();
    },
    unbind(el) {
        el.$container.removeEventListener('scroll', el.$scrollHandler);
        el.removeEventListener('click', el.$handler);
    },
};
