const copy = {
    bind: function (el, binding) {
        el.$value = binding.value;

        el.handler = function () {
            if (!el.$value) {
                return;
            }

            const textarea = document.createElement('textarea');
            textarea.readOnly = 'readonly';
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            textarea.value = el.$value;
            document.body.appendChild(textarea);

            textarea.select();
            const result = document.execCommand('Copy');

            if (result) {
                console.log('复制成功');
            }

            document.body.removeChild(textarea);
        };
    },

    componentUpdated(el, binding) {
        el.$value = binding.value;
    },

    unbind(el) {
        el.removeEventListener('click', el.handler);
    },
};
