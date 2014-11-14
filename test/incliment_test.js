describe("frost", function() {
  it("should accept any type, but should not throw", function() {
    expect(function() {
      frost(1);
      frost("How about that?");
      frost({});
    }).to.not.throw(TypeError);
  });

  it("should return a given object", function() {
    var thing = {};
    expect(frost(thing)).to.equal(thing);
  });

  it("should only freeze the given object", function() {
    expect(frost({})).to.be.frozen;
  });

  it("should not freeze objects owned by the given object", function() {
    expect(frost({child: {}}).child).to.not.be.frozen;
  });
});

describe("freeze", function() {
  it("should accept all types", function() {
    expect(function() {
      freeze(1);
      freeze("Well gee golly");
      freeze({this: {}, is: {}, deep: {}});
    }).to.not.throw(TypeError);
  });

  it("should freeze the given object", function() {
    expect(freeze({})).to.be.frozen;
  });

  it("should freeze all objects owned by the given object", function() {
    expect(freeze({child: {}}).child).to.be.frozen;
    expect(freeze({child1: {child2: {child3: {}}}}).child1.child2.child3).to.be.frozen;
  });

  it("should gracefully handle cyclic graphs", function() {
    var thing1 = {},
        thing2 = {},
        thing3 = {};

    thing1.thing2 = thing2;
    thing1.thing3 = thing3;

    thing2.thing1 = thing1;
    thing2.thing3 = thing3;

    thing3.thing1 = thing1;
    thing3.thing2 = thing2;
    expect(freeze(thing1)).to.be.frozen;
  });
});
