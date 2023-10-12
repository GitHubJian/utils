function isInstance(instance, clazz) {
    if (typeof instance !== 'object' || instance === null) {
        return false;
    }

    let proto = Object.getPrototypeOf(instance);
    while (true) {
        if (proto == null) {
            return false;
        }

        if (proto == clazz.prototype) {
            return true;
        }

        proto = Object.getPrototypeOf(proto);
    }
}
