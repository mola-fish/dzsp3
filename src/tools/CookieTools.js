
class CookieTools {
    static setCookie (name, value, expiresDay) {
        const expiresTime = new Date();
        expiresTime.setDate(expiresTime.getDate() + expiresDay);
        const expireCookie = name + '=' + this.stringToBase(value) + ';expires=' + expiresTime.toUTCString();
        document.cookie = expireCookie;
    }

    static getCookie (name) {
        if (document.cookie.length === 0) return '';
        const reg = RegExp(name + '=([^;]+)');
        const arr = document.cookie.match(reg);
        if (arr) {
            return this.baseToString(arr[1]);
        } else {
            return '';
        }
    }

    static deleteCookie (name) {
        this.setCookie(name, null, -1);
    }

    static stringToBase (v) {
        if (!v) return '';
        return window.btoa(v);
    }

    static baseToString (v) {
        if (!v) return '';
        return window.atob(v);
    }
}

export default CookieTools;
