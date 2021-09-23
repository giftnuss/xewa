
import { merge } from './../../src/utils.mjs';

describe("Merge objects like lodash", function() {
  it("Checks simple object merge",function () {
      var obj = { touch: false, android: 4 };
      var src = { silk: 3 };
      
      merge(obj,src);
      expect(obj).toEqual({ touch: false, android: 4, silk: 3});
  });
});
