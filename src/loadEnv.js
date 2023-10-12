const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function loadEnv(mode, options) {
    const {cwd} = Object.assign({}, {cwd: process.cwd()}, options || {});

    const basePath = path.resolve(cwd, `.env${mode ? `.${mode}` : ''}`);
    const localPath = `${basePath}.local`;

    const load = envPath => {
        try {
            const env = dotenv.config({
                path: envPath,
                debug: process.env.DEBUG,
            });
            dotenvExpand(env);
        } catch (err) {
            if (err.toString().indexOf('ENOENT') < 0) {
                console.error(err);
            }
        }
    };

    load(localPath);
    load(basePath);

    if (mode) {
        const shouldForceDefaultEnv = process.env.LOAD_ENV_TEST;

        const defaultNodeEnv = mode === 'production' || mode === 'test' ? mode : 'development';

        if (shouldForceDefaultEnv || process.env.NODE_ENV == null) {
            process.env.NODE_ENV = defaultNodeEnv;
        }
    }
}

module.exports = function (mode, options) {
    if (isObject(mode)) {
        options = mode;
        mode = '';
    }

    // load mode .env
    if (mode) {
        loadEnv(mode, options);
    }
    // load base .env
    loadEnv('', options);
};
