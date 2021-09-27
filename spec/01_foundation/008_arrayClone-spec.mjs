
import { cloneArray } from './../../src/utils.mjs';

describe("test arrayClone function", function() {
  it("Checks if it can concat an array.",function () {
      var i = ["Start"];
      var r = [3,2,1];
      expect(cloneArray(r,0,i)).toEqual(["Start",3,2,1]);
  });
  
  it("Checks if it works with offset.", function () {
      var i = [9], r = [4,5,6,3];
      expect(cloneArray(r,2,i)).toEqual([9,6,3]);
  });
  
  it("Checks if it works with arguments array like object.", function () {
      var run = function () { return cloneArray(arguments); };
      expect(run(8,6,4)).toEqual([8,6,4]);
  }); 
});
