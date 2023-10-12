// 第一步
Vue.prototype.$xss = function xss(text) {};

// 第二步
config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap(options => {
        options.compilerOptions = options.compilerOptions || {};

        options.compilerOptions.directives = options.compilerOptions.directives || {};

        options.compilerOptions.directives.html = function (el, dir) {
            if (dir.value) {
                (el.props || (el.props = [])).push({
                    name: 'innerHTML',
                    value: `($xss && $xss(_s(${dir.value}))) || _s(${dir.value})`,
                });
            }
        };
    });
