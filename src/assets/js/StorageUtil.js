var localUtil = {
    get: function (key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(key);
        } else {
            console.info('不支持localStorage存储');
            return null;
        }
    },
    set: function (key, val) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, val);
            return true;
        } else {
            console.info('不支持localStorage存储');
            return false;
        }
    },
    clean: function () {
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
            return true;
        } else {
            console.info('不支持localStorage存储');
            return false;
        }
    },
    remove: function () {
        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem(key);
            return true;
        } else {
            console.info('不支持localStorage存储');
            return false;
        }
    }
}

var sessionUtil = {
    get: function (key) {
        if (typeof(Storage) !== "undefined") {
            return sessionStorage.getItem(key);
        } else {
            console.info('不支持sessionStorage存储');
            return null;
        }
    },
    set: function (key, val) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem(key, val);
            return true;
        } else {
            console.info('不支持sessionStorage存储');
            return false;
        }
    },
    clean: function () {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.clear();
            return true;
        } else {
            console.info('不支持sessionStorage存储');
            return false;
        }
    },
    remove: function () {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.removeItem(key);
            return true;
        } else {
            console.info('不支持sessionStorage存储');
            return false;
        }
    }
}