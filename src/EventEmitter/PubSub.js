// 发布订阅

function PubSub() {
    this.topics = {};
    this.uid = -1;
}

PubSub.prototype.subscribe = function subscribe(topic, callback, once) {
    const topics = this.topics;
    const token = (this.uid += 1);

    if (typeof callback !== 'function') {
        throw new TypeError('This callback must be a function');
    }

    if (!topics[topic]) {
        topics[topic] = [];
    }

    const obj = {
        token,
        callback,
        once: !!once,
    };

    topics[topic].push(obj);

    return token;
};

PubSub.prototype.subscribeOnce = function subscribeOnce(topic, callback) {
    return this.subscribe(topic, callback, true);
};

PubSub.prototype.publish = function publish(topic) {
    const topics = this.topics;
    const subscribers = topics[topic] ? [...topics[topic]] : [];
    const data = Array.prototype.slice.call(arguments, 1);

    for (let i = 0, len = subscribers.length; i < len; i++) {
        const currentSubscriber = subscribers[i];
        const token = currentSubscriber.token;

        currentSubscriber.callback(data, {name: topic, token: token});

        if (currentSubscriber.once === true) {
            this.unsubscribe(token);
        }
    }
};

PubSub.prototype.unsubscribe = function unsubscribe(topic) {
    const topics = this.topics;
    let tf = false;

    for (const key in topics) {
        if (Object.prototype.hasOwnProperty.call(topic, key)) {
            if (topics[key]) {
                let len = topics[key].length;

                while (len) {
                    len -= 1;

                    if (topics[key][len].token === topic) {
                        topics[key].splice(len, 1);

                        if (topics[key].length === 0) {
                            delete topics[key];
                        }

                        return topic;
                    }

                    if (key === topic) {
                        topics[key].splice(len, 1);

                        if (topics[key].length === 0) {
                            delete topics[key];
                        }

                        tf = true;
                    }
                }

                if (tf === true) {
                    return topic;
                }
            }
        }
    }

    return false;
};

PubSub.prototype.unsubscribeAll = function unsubscribeAll() {
    this.topics = {};
    return this;
};

PubSub.prototype.hasSubscribers = function hasSubscribers(topic) {
    const topics = this.topics;

    if (topic == null) {
        for (let key in topics) {
            if (Object.prototype.hasOwnProperty.call(topics, key)) {
                return true;
            }
        }

        return false;
    }

    return Object.prototype.hasOwnProperty.call(topics, topic);
};

PubSub.prototype.subscribers = function subscribers() {
    const topics = this.topics;
    const res = {};
    for (let key in topics) {
        if (Object.prototype.hasOwnProperty.call(topics, key)) {
            res[key] = topics[key];
        }
    }

    return res;
};

PubSub.prototype.subscribersByTopic = function subscribersByTopic(topic) {
    return this.topics[topic] ? [...this.topics[topic]] : [];
};

PubSub.prototype.alias = function alias(options) {
    for (let key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key) && PubSub.prototype[key]) {
            PubSub.prototype[options[key]] = PubSub.prototype[key];
        }
    }

    return this;
};

PubSub.createInstance = function () {
    return new PubSub();
};
