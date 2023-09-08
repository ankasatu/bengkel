var __bengkel__ = (!__bengkel__ ? {} : __bengkel__);

(function (__, _) {

    function base64ToBytes(base64) {
        const binString = atob(base64);
        return Uint8Array.from(binString, (m) => m.codePointAt(0));
    }

    function bytesToBase64(bytes) {
        const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
        return btoa(binString);
    }

    var encode = (value) => {
        var x = new TextEncoder().encode(value);
        return bytesToBase64(x);
    };
    var decode = (value) => {
        var x = base64ToBytes(value);
        return new TextDecoder().decode(x);
    };

    __[_] = { encode, decode };

})(__bengkel__, 'base64');