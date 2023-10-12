const watermarker = {
    bind: function (el, binding) {
        const value = binding.value;
        const {text, color} = value;

        let canvas = document.createElement('canvas');
        el.appendChild(canvas);
        canvas.width = 200;
        canvas.height = 150;
        canvas.style.display = 'none';

        let context = can.getContext('2d');
        context.rotate((-20 * Math.PI) / 180);
        context.font = '16px Microsoft JhengHei';
        context.fillStyle = color || 'rgba(180, 180, 180, 0.3)';
        context.textAlign = 'left';
        context.textBaseline = 'Middle';
        context.fillText(text, canvas.width / 10, canvas.height / 2);

        el.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
    },
};
