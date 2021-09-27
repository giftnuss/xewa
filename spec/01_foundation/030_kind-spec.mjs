


import kind from './../../src/kind.mjs';

describe("a kind call", function() {
  it("without argument throws error", function() {
    expect(function () { kind(); }).toThrowError();
  });
  
  it("with empty spec throws exception", function() {
    expect(function () { kind({}); }).toThrow();
  });
  
  it("referencing undefined kind name throws exception", function (){
    expect(function () { kind({kind: 'custom.Namespace'}); }).toThrow();
  });

  it("referencing undefined kind throws exception", function (){
    var undef;
    expect(function () { kind({kind: undef}); }).toThrow();
  });
  
  it("kind with name and where base is null throws not", function() {
    expect(function () { kind({kind: null, name: "test0"}); }).not.toThrow();
  });
 
});

describe("kind is used directly,", function () {
    var test = kind({kind: null, name: "test1"});
    
    it("it throws when called directly", function () {
      expect(function () { return test(); }).toThrowMatching(
        function (thrown) {
           return thrown.search(/kind: constructor called directly, not using "new"/) > -1;
        });
    });
});
    
describe("instance of simple kind", function () {
    var test = kind({kind: null, name: "test1"});
    
    it("it has a kindName property", function () {
      var t = new test();
      expect(t.kindName).toBe("test1");
      // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(t)));
    });
    
});
 
