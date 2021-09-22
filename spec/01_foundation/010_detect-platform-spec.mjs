

/**
 * Todo: 
 * * Collect new useragent strings from http://www.browser-info.net/useragents
 * * ! - Test Silk!!! => utils.mixin?
 */

import Platform from './../../src/Platform.mjs';

describe("Check platform detection", function() {
  it("Useragent string is Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0", function() {
    window.navigator.userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0";
    
    var p = new Platform;
    expect(p.gesture).toBe(false);
    expect(p.touch).toBe(false);
    expect(p.platformName).toBe("firefox");
    expect("firefox" in p).toBe(true);
  });
  
  it("Useragent string is Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/92.1.193 like Chrome/92.0.4515.131 Safari/537.36",function() {
	window.navigator.userAgent = "Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/92.1.193 like Chrome/92.0.4515.131 Safari/537.36";
	
	var p = new Platform;
	expect("androidChrome" in p).toBe(true);
  });
  
  it("Useragent string is 20	Mozilla/5.0 (iPad; U; CPU OS 5_1 like Mac OS X) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10 UCBrowser/3.4.3.532", function() {
	window.navigator.userAgent = "20	Mozilla/5.0 (iPad; U; CPU OS 5_1 like Mac OS X) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10 UCBrowser/3.4.3.532";
	
	var p = new Platform;
	expect("ios" in p).toBe(true);
	expect(p.ios).toBe(5);
  });
});

