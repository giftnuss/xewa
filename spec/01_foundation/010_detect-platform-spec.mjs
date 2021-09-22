
import Platform from './../../src/Platform.mjs';

describe("Check platform detection", function() {
  it("Useragent string is Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0", function() {
    window.navigator.userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0";
    
    var p = new Platform;
    expect(p.gesture).toBe(false);
    expect(p.touch).toBe(false);
    expect("firefox" in p).toBe(true);
  });
});

