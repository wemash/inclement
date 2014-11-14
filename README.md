# Past

A long time ago people thought that maybe mutable data structures made it
harder to reason about where data was being mutated, since that could happen
almost anywhere.

So, some people got together and made `Object.freeze`, and things were (mostly)
fine.

But `Object.freeze` had a flaw: It could take a mutable object and make it
impervious to change, but only so long as the object didn't have any properties
that were objects (`Object.freeze` doesn't alter them at all)
  
That was OK. Someone had the bright idea to just iterate over the properties of
an object and freeze any that were also objects, all the way down. So that was
[`deepFreeze`][mdn].

But `deepFreeze` too had a flaw: It could freeze objects owned by a given
object, but only if they weren't already frozen. Alas, a frozen owned object
with owned objects that weren't also frozen would expose thawed patches.

# Present

So, inclement tries to solve these problems with two methods:

`frost` acts like `Object.freeze` does now: An object will get a light
sprinkling of immutability, and any properties of the object that are also
objects will be left untouched.

Unlike `Object.freeze` it's more friendly, and will accept any type.
Non-objects simply get passed thru; objects, however, are frozen.

`freeze` acts like I think `Object.freeze` should have acted: Given an object,
`freeze` will plunge into its depths, find all objects, and freeze them.

It's totally cool to try and `freeze` an object with circular references:
`freeze` tracks nodes in the object graph internally.

# Using

## Getting it

Inclement is availabe as a bower package. Just run:

    > bower install inclement

Alternatively, feel free to clone this repo and grab `src/inclement.js`:

    > git clone https://github.com/wemash/inclement
    > cp inclement/src/inclement.js WHEREVER

## Requiring it

Inclement is designed to work in the browser, so just add this to whatever HTML
file you are using:

    <script src="PATH/TO/INCLEMENT"></script>

## Actually using it

Call `frost` when you want to do what `Object.freeze` does but maybe want to be
more liberal in what you accept.

Call `freeze` when you want a(n almost) completely immutable object.

## Caveats

* `frost` and `freeze` are declared at the global level, so they are polluting
  the global namespace.
* `freeze` doesn't touch prototypes. This isn't a problem for people who shy
  away from prototypal inheritance.

[mdn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
