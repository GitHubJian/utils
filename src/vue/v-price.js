function toPrice(num) {
    num += '';
    let pairs = num.split('.');
    let x1 = pairs[0];
    let x2 = pairs.length > 1 ? '.' + pairs[1] : '';

    let re = /(\d)(?=(\d{3})+$)/g;
    x1 = x1.replace(re, function ($1) {
        return $1 + ',';
    });

    return x1 + x2;
}

const price = {
    update(el, binding) {
        const {value} = binding;
        if (!value) {
            return '0.0';
        }

        el.innerText = toPrice(value);
    },
};
