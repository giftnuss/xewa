
/**
* Determines OS versions of platforms that need special treatment. Can have one of the following
* properties:
*
* * android
* * androidChrome (Chrome on Android, standard starting in 4.1)
* * androidFirefox
* * ie
* * edge
* * ios
* * webos
* * windowsPhone
* * blackberry
* * tizen
* * safari (desktop version)
* * chrome (desktop version)
* * firefox (desktop version)
* * firefoxOS
*
* If the property is defined, its value will be the major version number of the platform.
*
* Example:
* ```javascript
* // android 2 does not have 3d css
* if (xewa.platform.android < 3) {
* 	t = 'translate(30px, 50px)';
* } else {
* 	t = 'translate3d(30px, 50px, 0)';
* }
* this.applyStyle('-webkit-transform', t);
* ```
*
* @module xewa/platform
*/

import { merge } from "./utils.mjs";

var platforms = [
	// Windows Phone 7 - 10
	{platform: 'windowsPhone', regex: /Windows Phone (?:OS )?(\d+)[.\d]+/},
	// Android 4+ using Chrome
	{platform: 'androidChrome', regex: /Android .* Chrome\/(\d+)[.\d]+/},
	// Android 2 - 4
	{platform: 'android', regex: /Android(?:\s|\/)(\d+)/},
	// Kindle Fire
	// Force version to 2, (desktop mode does not list android version)
	{platform: 'android', regex: /Silk\/1./, forceVersion: 2, extra: {silk: 1}},
	// Kindle Fire HD (Silk versions 2 or 3)
	// Force version to 4
	{platform: 'android', regex: /Silk\/2./, forceVersion: 4, extra: {silk: 2}},
	{platform: 'android', regex: /Silk\/3./, forceVersion: 4, extra: {silk: 3}},
	// IE 8 - 10
	{platform: 'ie', regex: /MSIE (\d+)/},
	// IE 11
	{platform: 'ie', regex: /Trident\/.*; rv:(\d+)/},
	// Edge
	{platform: 'edge', regex: /Edge\/(\d+)/},
	// iOS 3 - 5
	// Apple likes to make this complicated
	{platform: 'ios', regex: /iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/},
	// webOS 1 - 3
	{platform: 'webos', regex: /(?:web|hpw)OS\/(\d+)/},
	// webOS 4 / OpenWebOS
	{platform: 'webos', regex: /WebAppManager|Isis|webOS\./, forceVersion: 4},
	// Open webOS release LuneOS
	{platform: 'webos', regex: /LuneOS/, forceVersion: 4, extra: {luneos: 1}},
	// desktop Safari
	{platform: 'safari', regex: /Version\/(\d+)[.\d]+\s+Safari/},
	// desktop Chrome
	{platform: 'chrome', regex: /Chrome\/(\d+)[.\d]+/},
	// Firefox on Android
	{platform: 'androidFirefox', regex: /Android;.*Firefox\/(\d+)/},
	// FirefoxOS
	{platform: 'firefoxOS', regex: /Mobile;.*Firefox\/(\d+)/},
	// desktop Firefox
	{platform: 'firefox', regex: /Firefox\/(\d+)/},
	// Blackberry Playbook
	{platform: 'blackberry', regex: /PlayBook/i, forceVersion: 2},
	// Blackberry 10+
	{platform: 'blackberry', regex: /BB1\d;.*Version\/(\d+\.\d+)/},
	// Tizen
	{platform: 'tizen', regex: /Tizen (\d+)/}
];

var Platform = function () {
	
    var ua = window.navigator.userAgent;
    
	var res = {
		/**
		* `true` if the platform has native single-finger [events]{@glossary event}.
		* @public
		*/
		touch: Boolean(('ontouchstart' in window) || window.navigator.msMaxTouchPoints || (window.navigator.msManipulationViewsEnabled && window.navigator.maxTouchPoints)),
		/**
		* `true` if the platform has native double-finger [events]{@glossary event}.
		* @public
		*/
		gesture: Boolean(('ongesturestart' in window) || ('onmsgesturestart' in window && (window.navigator.msMaxTouchPoints > 1 || window.navigator.maxTouchPoints > 1)))
    }
    
	/**
	* The name of the platform that was detected or `undefined` if the platform
	* was unrecognized. This value is the key name for the major version of the
	* platform on the exported object.
	* @member {String} platformName
	* @public
	*/
	for (var i = 0, p, m, v; (p = platforms[i]); i++) {
		m = p.regex.exec(ua);
		if (m) {
			if (p.forceVersion) {
				v = p.forceVersion;
			} else {
				v = Number(m[1]);
			}
			res[p.platform] = v;
			if (p.extra) {
				merge(res,p.extra);
			}
			res.platformName = p.platform;
			break;
		}
	}

    return res;
};

export { Platform as default };
