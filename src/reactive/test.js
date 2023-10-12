const Ctx = require('.');

const obj = {
    data: function () {
        return {
            a: 1,
            c: 'x',
        };
    },
    watch: {
        a(newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log('set a = ' + newVal);
            }
        },
    },
    computed: {
        fullname: function () {
            return this.a + '1';
        },
    },
    render: function () {
        let ctx = this;
        console.log(ctx.a);
        console.log(ctx.c);
        console.log(ctx.fullname);

        setTimeout(function () {
            ctx.a = 2;
        });
    },
};

new Ctx(obj).$mount();
