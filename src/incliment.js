/**
 * Apply a light chill to an object
 *
 * Frost acts like Object.freeze - A given object is frozen, but its owned
 * objects are not. Unlike Object.freeze, frost can accept any type, and will
 * only actually frost objects.
 *
 * @param object Something that should probably be an object. But if you pass
 * in a non-object this method will just act like a nop.
 * @returns The given object, possibly frosted
 */
function frost(object) {
  if(typeof object != "object")
    return object;
  return Object.freeze(object);
}

/**
 * Freeze an object to the core
 *
 * Freeze acts like Object.freeze should have acted - A given object and all
 * objects that it owns are frozen. Freeze ignores prototypes, so it's possible
 * that you'll still have defrosted parts of an object, but it's unlikely to
 * happen if you don't use prototypal inheritance.
 *
 * @param object Something that should probably be an object.
 * @returns The given object, possibly frosted
 */
function freeze(object) {

  /**
   * A list of nodes that were visited during a trip into an object
   *
   * Objects may have circular references, so it's necessary to track which
   * objects have been visited, so we don't get stuck freezing everything and
   * end up freezing the main thread (ha!).
   *
   * @returns A nodelist prepped for spelunking an object with
   */
  function nodelist() {
    var nodes = [];

    function has(node) {
      return nodes.some(function(potential) {
        return potential === node;
      });
    }

    function add(node) {
      nodes.push(node);
    }

    return {
      add: add,
      has: has
    }
  }

  /**
   * Dive into an object, freezing things along the way
   *
   * Objects can be complicated webs of references, and while probing the
   * depths of an object we may find a circular reference. In order to avoid
   * hitting the maximum call-stack or freezing the main thread I track every
   * node as I visit it, assuming the node isn't terminal.
   *
   * @param object The object you want to dive into
   * @param visited A nodelist to track which nodes have been visited
   * @returns The object, (almost) completely frozen
   */
  function doFreeze(object, visited) {
    if(typeof object == "object") {
      visited.add(object);
      Object.keys(object).forEach(function(key) {
        if(Object.hasOwnProperty.call(object, key))
          var next = object[key];
          if(!visited.has(next))
            doFreeze(next, visited);
      });
    }
    return frost(object);
  }

  return doFreeze(object, nodelist());
}
