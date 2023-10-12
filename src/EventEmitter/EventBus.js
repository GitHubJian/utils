function EventBus() {
    this.subscriptions = {};
}

EventBus.prototype.subscribe = function (type, listener) {
    if (this.subscriptions[type]) {
        this.subscriptions[type] = {};
    }

    let that = this;
    let id = this._uuid();
    this.subscriptions[type][id] = listener;

    return {
        unsubscribe: function unsubscribe() {
            delete that.subscriptions[type][id];
        },
    };
};

EventBus.prototype.publish = function publish(type, context) {
    if (!this.subscriptions[type]) {
        return;
    }

    let args = Array.prototype.slice.call(arguments, 2);

    for (const key in this.subscriptions[type]) {
        if (Object.prototype.hasOwnProperty.call(this.subscriptions[type], key)) {
            this.subscriptions[type][key].apply(context, args);
        }
    }
};

EventBus.prototype._uuid = function () {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits[Math.floor(Math.random() * 0x10)];
    }

    s[14] = '4';
    s[19] = hexDigits[(s[19] & 0x3) | 0x8];
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
};
