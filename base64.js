/**
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 * 
 * @author Dan Kogai (https://github.com/dankogai)
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}(( typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
        : this
), function(global) {
    'use strict';
    global = global || {}; // existing version for noConflict()
    const _Base64 = global.Base64;
    const version = '3.0.2';
        const _b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const _b64tab = ((bin) => {
        let tab = {}, i = 0;
        for (const c of bin) tab[c] = i++;
        return tab;
    })(_b64chars);
    const _fromCharCode = String.fromCharCode;
    const _mkUriSafe =  (src) => String(src)
            .replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_')
            .replace(/=/g, '');
    /**
    * converts a Uint8Array to a Base64 string
    * @param {Uint8Array} src
    * @param {Boolean} urisafe URL-and-filename-safe a la RFC4648
    * @returns {String} Base64 string
    */
    const fromUint8Array = (src, urisafe) => {
        let b64 = '';
        for (let i = 0, l = src.length; i < l; i += 3) {
            const a0 = src[i], a1 = src[i+1], a2 = src[i+2];
            const ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    _b64chars.charAt( ord >>> 18)
                +     _b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? _b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? _b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? _mkUriSafe(b64) : b64;
    };
    /**
    * 100% compatibile with `window.btoa` of web browsers
    * @param {String} src binary string
    * @returns {String} Base64-encoded string
    */
    const btoa = global.btoa && typeof global.btoa == 'function'
        ? global.btoa.bind(global) : (src) => {
        if (src.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return fromUint8Array(
            Uint8Array.from(src,c => c.charCodeAt(0))
        );
    };
    /**
     * @deprecated since 3.0.0
     * @param {string} src UTF-8 string
     * @returns {string} UTF-16 string
     */
    const utob = (src) => unescape(encodeURIComponent(src));
     /**
    * converts a UTF-8-encoded string to a Base64 string
    * @param {String} src the string to convert
    * @param {Boolean} rfc4648 if `true` make the result URL-safe
    * @returns {String} Base64 string
    */
    const encode = (src, rfc4648) => {
        const b64 = btoa(utob(src));
        return rfc4648 ? _mkUriSafe(b64) : b64;
    };
    /**
    * converts a UTF-8-encoded string to URL-safe Base64 RFC4648
    * @param {String} src the string to convert
    * @returns {String} Base64 string
    */
   const encodeURI = (src) => encode(src, true);
    /**
     * @deprecated since 3.0.0
     * @param {string} src UTF-16 string
     * @returns {string} UTF-8 string
     */
    const btou = (src) => decodeURIComponent(escape(src));
    const _cb_decode = (cccc) => {
        let len = cccc.length,
        padlen = len % 4,
        n =   (len > 0 ? _b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? _b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? _b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? _b64tab[cccc.charAt(3)]       : 0),
        chars = [
            _fromCharCode( n >>> 16),
            _fromCharCode((n >>>  8) & 0xff),
            _fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    /**
    * 100% compatibile with `window.atob` of web browsers
    * @param {String} src Base64-encoded string
    * @returns {String} binary string
    */
    const atob = global.atob && typeof global.atob == 'function'
        ? global.atob.bind(global)  : (a) => {
        return String(a)
            .replace(/[^A-Za-z0-9\+\/]/g, '')
            .replace(/\S{1,4}/g, _cb_decode);
    };
    const _decode = (a) => btou(atob(a));
    const _fromURI = (a) => {
        return String(a)
            .replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/')
            .replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    /**
    * converts a Base64 string to a UTF-8 string
    * @param {String} src Base64 string.  Both normal and URL-safe are supported
    * @returns {String} UTF-8 string
    */
    const decode = (src) =>  _decode(_fromURI(src));
    /**
    * converts a Base64 string to a Uint8Array
    * @param {String} src Base64 string.  Both normal and URL-safe are supported
    * @returns {Uint8Array} UTF-8 string
    */
    const toUint8Array = (a) =>  {
        return Uint8Array.from(atob(_fromURI(a)), c => c.charCodeAt(0));
    };
    const noConflict = () => {
        let Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        encodeURL: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // make Base64.extendString() available
    const _noEnum = (v) => {
        return {
            value:v, enumerable:false, writable:true, configurable:true
        };
    };
    // make Base64.extendString() available
    global.Base64.extendString = function() {
        const _add = (name, body) => Object.defineProperty(
            String.prototype, name, _noEnum(body)
        );
        _add('fromBase64', function() {
            return decode(this);
        });
        _add('toBase64', function(rfc4648) {
            return encode(this, rfc4648);
        });
        _add('toBase64URI', function() {
            return encode(this, true);
        });
        _add('toBase64URL', function() {
            return encode(this, true);
        });
        _add('toUint8Array', function() {
            return toUint8Array(this);
        });
    };
    // make Base64.extendUint8Array() available
    global.Base64.extendUint8Array = function() {
        const _add = (name, body) => Object.defineProperty(
            Uint8Array.prototype, name, _noEnum(body)
        );
        _add('toBase64', function(rfc4648) {
            return fromUint8Array(this, rfc4648);
        });
        _add('toBase64URI', function() {
            return fromUint8Array(this, true);
        });
        _add('toBase64URL', function() {
            return fromUint8Array(this, true);
        });
    };
    global.Base64.extendBuiltins = () => {
        global.Base64.extendString();
        global.Base64.extendUint8Array();
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64};
}));
