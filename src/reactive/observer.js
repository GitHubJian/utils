const {Dep} = require('./dep');

class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();

        this.walk(value);
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
}

function observe(value) {
    let ob;

    ob = new Observer(value);

    return ob;
}
exports.observe = observe;

function defineReactive(obj, key, val) {
    const dep = new Dep();

    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }

    const getter = property && property.get;
    const setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
    }

    let childOb = observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                dep.depend();

                if (childOb) {
                    childOb.dep.depend();
                }
            }

            return value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }

            if (getter && !setter) {
                return;
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }

            childOb = observe(newVal);
            dep.notify();
        },
    });
}
exports.defineReactive = defineReactive;
