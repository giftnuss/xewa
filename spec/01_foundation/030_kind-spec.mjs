


import kind from './../../src/kind.mjs';

describe("basic kind specification", function() {
  it("a kind without argument throws error", function() {
    expect(function () { kind(); }).toThrowError();
  });
  
  it("a kind with empty spec throws exception", function() {
    expect(function () { kind({}); }).toThrow();
  });
  
  it("a kind referencing undefined kind name throws exception", function (){
    expect(function () { kind({kind: 'custom.Namespace'}); }).toThrow();
  });

  it("a kind referencing undefined kind throws exception", function (){
    var undef;
    expect(function () { kind({kind: undef}); }).toThrow();
  });
  
  it("kind with name and where base is null throws not", function() {
    expect(function () { kind({kind: null, name: "test0"}); }).not.toThrow();
  });
 
});
 
