(function(window) {
    "use strict";
    var ns, Element, SwitchElement;

    // FIXME: Use utils module!
    var inherit;

    /**
     * Describes abstract parent class for all construction elements.
     */
    Element = function Element(name) {
        // Ensure being called with `new`
        if (!(this instanceof Element)) {
            return new Element();
        }

        // Private members
        var feature, called;

        Element.count += 1;
        this._name = name + '-' + Element.count;
        this._type = 'element';

        // feature is truly private here
        // Doesn't work with Arrays and Objects (passed by reference!)
        feature = 'sizzles';
        this.getFeature = function() {
            return feature;
        };
    };

    // Static methods
    Element.count = 0;

    // Instance methods
    Element.prototype.getName = function() {
        return this._name;
    };

    Element.prototype.getType = function() {
        return this._type;
    };

    Element.prototype.renderSelf = function(node) {
        var img;

        img = "<img src='build/" + this._icon + "' alt='" + this._type + ": " + this._name + "' />";
        node.innerHTML += img;
    };

    // FIXME: Use utils.inherit!
    inherit = (function() {
        var Proxy;
        Proxy = function() {};  // Temporary constructor, created only once
        return function(Child, Parent) {
            Proxy.prototype = Parent.prototype;
            Child.prototype = new Proxy();  // Only inherit prototype methods
            Child.superior = Parent.prototype;  // For access to the super class
            Child.prototype.constructor = Child;  // For introspection purposes
        };
    })();

    SwitchElement = function(name) {
        // Ensure being called with `new`
        if (!(this instanceof SwitchElement)) {
            return new SwitchElement(name);
        }

        // Private members
        var feature, called;

        SwitchElement.count += 1;
        this._name = name + '-' + SwitchElement.count;
        this._type = 'switch';
        this._state = 'closed';
        this._icon = 'switch';
    };

    inherit(SwitchElement, Element);
    // Static methods
    SwitchElement.count = 0;

    SwitchElement.prototype.isClosed = function() {
        return this._state === 'closed';
    };

    SwitchElement.prototype.renderSelf = function(node) {
        var img;

        img = "<img src='build/" + this._icon + "-" + this._state + ".svg' ";
        img += "alt='" + this._type + "-" + this._state + ": " + this._name + "' />";
        node.innerHTML += img;
    };

    window.JS13KBP = window.JS13KBP || {};

    /* API */
    ns = window.JS13KBP;
    ns.element = {
        Element: Element,
        SwitchElement: SwitchElement
    };
    return ns;
})(this);